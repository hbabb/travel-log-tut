# Locations Post file

This file is the documentation file for the Post method on the locations table.

## Issue: possible :bug: found with DrizzleError and LibSql

The tutorial by CJ uses DrizzleError to parse the error object and create an if statement using the error, however I have an issue where this does not work on my system. I am having to use a LibsqlError instead. To verify the error structure, just use the following console logs.

```typescript
try {
  const [created] = await db.insert(location).values({
    ...result.data,
    slug: result.data.name.replaceAll(" ", "-").toLowerCase(),
    userId: event.context.user.id,
  }).returning();
  return created;
}
catch (e) {
  const error = e as LibsqlError;
  const cause = error?.cause as LibsqlError;

  // console.log("=== RAW ERROR ===");
  // consol.dir(error, {depth: null});

  if (cause?.code === "SQLITE_CONSTRAINT" && cause?.message?.includes("UNIQUE constraint failed: location.slug")) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists.",
    }));
  }
  throw error;
}
```
