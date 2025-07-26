import type { LibsqlError } from "@libsql/client";

import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

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

  const existingLocation = await db.query.location.findFirst({
    where:
      and(
        eq(location.name, result.data.name),
        eq(location.userId, event.context.user.id),
      ),
  });

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    }));
  }

  // Optimize the Unique slug creation
  let slug = slugify(result.data.name);
  let existing = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));

  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    }));
    if (!existing) {
      slug = idSlug;
    }
  }

  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();
    return created;
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
