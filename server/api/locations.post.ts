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

   * BUG FIX: readValidatedBody(even, InsertLocation.safeParse) works in development but fails in production with "keyValidator _parse is not a function". This appears to be related to how h3/Nuxt handles method binding during production compilation.
   * ROOT CAUSE: Unknown - TODO: investigate Nuxt's readValidatedBody implementation
   *
   * WORKAROUND: Parse body manually instead of passing bound method to readValidatedBody

   * const body = away readValidatedBody(event);
   * const result = InsertLocation.safeParse(body);
   * OR a one line version as shown below
   */
  // TODO: Investigate Nuxt's readValidatedBody with Zod integration
  // --- START LOGS ---
  console.log("--- VERCEL DIAGNOSTIC LOG FOR InsertLocation.safeParse ---");
  console.log("Timestamp: ", new Date().toISOString());
  console.log("Checking the 'InsertLocation' object directly.");
  console.log("Is 'InsertLocation' defined? ", !!InsertLocation);
  console.log("What is typeof InsertLocation? ", typeof InsertLocation);

  if (InsertLocation) {
    console.log("What are the keys of InsertLocation? ", Object.keys(InsertLocation));
    console.log("Does it have a .safeParse method? ", typeof InsertLocation.safeParse === "function");
    console.log("Does it have a ._parse method? ", typeof InsertLocation._parse === "function");
  }
  else {
    console.log("!!! 'InsertLocation' IS UNDEFINED OR NULL. THIS IS THE ROOT CAUSE. !!!");
  }
  console.log("--- END OF DIAGNOSTICS ---");
  // --- END OF LOGS ---

  const result = await readValidatedBody(event, body => InsertLocation.safeParse(body));

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

    // console.log("=== RAW ERROR ===");
    // consol.dir(error, {depth: null});

    if (cause?.code === "SQLITE_CONSTRAINT" && cause?.message?.includes("UNIQUE constraint failed: location.name")) {
      return sendError(event, createError({
        statusCode: 409,
        statusMessage: "A location with that name already exists.",
      }));
    }
    throw error;
  }
});
