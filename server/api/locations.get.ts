import { findLocations } from "~/lib/db/queries/location";
import defineAuthEventHandler from "~/utils/define-auth-event-handler";

export default defineAuthEventHandler(async (event) => {
  // await new Promise(resolve => setTimeout(resolve, 2000)); // This is for development purposes TODO: Remove or comment out before pushing to production
  return findLocations(event.context.user.id);
});
