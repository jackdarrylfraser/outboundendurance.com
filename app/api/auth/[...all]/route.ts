import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/better-auth";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;
export const POST = handlers.POST;
