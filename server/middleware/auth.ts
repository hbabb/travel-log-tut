import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  // @ts-expect-error Better Auth user id generation is off and the DB is set to use number not string
  event.context.user = session?.user;
  if (event.path.startsWith("/dashboard")) {
    if (!session?.user) {
      await sendRedirect(event, "/", 302);
    }
  }
});
