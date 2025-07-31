import type { LibsqlError } from "@libsql/client";

import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";
import defineAuthEventHandler from "~/utils/define-auth-event-handler";

export default defineAuthEventHandler(async (event) => {
  /**
   * ! BUG: readValidatedBody(even, InsertLocation.safeParse) works in development but fails in production with "keyValidator _parse is not a function". This appears to be related to how h3/Nuxt handles method binding during production compilation.
   * ROOT CAUSE: Unknown
   * ? WORKAROUND: Parse body manually instead of passing bound method to readValidatedBody
   */
  // TODO: Investigate Nuxt's readValidatedBody with Zod integration
  const body = await readBody(event);
  const result = InsertLocation.safeParse(body);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as LibsqlError;
    const cause = error?.cause as LibsqlError;

    console.log("=== RAW ERROR ===");
    console.dir(error, { depth: null });

    if (cause?.code === "SQLITE_CONSTRAINT" && cause?.message?.includes("UNIQUE constraint failed: location.name")) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "A location with that name already exists.",
      }));
    }
    throw error;
  }
});
