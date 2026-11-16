import { describe, expect, it } from "bun:test";
import { createHmac } from "node:crypto";
import {
  createLeadAccessToken,
  verifyLeadAccessToken,
} from "./lead-access-token.ts";

describe("lead access tokens", () => {
  const secret = "test-secret-with-sufficient-entropy";
  const now = 1_800_000_000_000;

  it("verifies an unexpired token signed with the same secret", () => {
    const token = createLeadAccessToken(
      { leadId: "lead-id", expiresAt: now + 60_000 },
      secret,
    );

    expect(verifyLeadAccessToken(token, secret, now)).toEqual({
      leadId: "lead-id",
      expiresAt: now + 60_000,
    });
  });

  it("rejects guest cookies issued before the token-version change", () => {
    const payload = Buffer.from(
      JSON.stringify({ leadId: "lead-id", expiresAt: now + 60_000 }),
    ).toString("base64url");
    const signature = createHmac("sha256", secret)
      .update(`lead-access-v1.${payload}`)
      .digest("base64url");

    expect(verifyLeadAccessToken(`${payload}.${signature}`, secret, now)).toBe(
      null,
    );
  });

  it("rejects altered, incorrectly signed, and expired tokens", () => {
    const token = createLeadAccessToken(
      { leadId: "lead-id", expiresAt: now + 60_000 },
      secret,
    );
    const [payload, signature] = token.split(".");
    const alteredSignature = `${signature[0] === "A" ? "B" : "A"}${signature.slice(1)}`;
    const alteredToken = `${payload}.${alteredSignature}`;

    expect(verifyLeadAccessToken(alteredToken, secret, now)).toBeNull();
    expect(verifyLeadAccessToken(token, "different-secret", now)).toBeNull();
    expect(
      verifyLeadAccessToken(
        createLeadAccessToken({ leadId: "lead-id", expiresAt: now }, secret),
        secret,
        now,
      ),
    ).toBeNull();
  });
});
