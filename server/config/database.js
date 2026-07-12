import mongoose from "mongoose";

// Lazy + cached connection for serverless (Vercel) environments.
// The connection promise is cached on globalThis so it survives module
// re-evaluation and is reused across warm invocations.
const globalCache = globalThis;
if (!globalCache.__mongooseConn) {
  globalCache.__mongooseConn = { promise: null };
}
const cached = globalCache.__mongooseConn;

export const connectDB = async () => {
  if (!cached.promise) {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    console.log("Attempting MongoDB connection...");

    cached.promise = mongoose
      .connect(mongoUri, { bufferCommands: false })
      .then((m) => {
        console.log("✅ MongoDB connected successfully");
        return m;
      })
      .catch((error) => {
        // Reset so the next invocation can retry instead of reusing a
        // permanently rejected promise.
        cached.promise = null;
        console.error("❌ MongoDB connection error:");
        console.error(error.message);
        throw error;
      });
  }

  return cached.promise;
};
