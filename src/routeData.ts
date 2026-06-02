import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware(async (context, next) => {
	// Always call next() first to let Starlight populate the data
	await next();

	const { head, entry } = context.locals.starlightRoute;

	// Access the existing head tags
	const titleTag = head.find((tag) => tag.tag === "title");
	if (titleTag) {
		// Set the title to ONLY be the page title, removing the site name suffix
		titleTag.content = entry.data.title;
	}
});
