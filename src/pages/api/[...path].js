// Mounts the existing Express app under /api/* — same code path in `next dev`
// and as a serverless function on Vercel. Express handles its own body
// parsing and responses, so Next's are disabled.
import app from "../../../server/app.js";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default app;
