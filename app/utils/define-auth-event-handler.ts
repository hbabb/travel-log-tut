import type { EventHandler } from "h3";

export default function defineAuthEventHandler(handler: EventHandler) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }));
    }

    return handler;
  });
};
