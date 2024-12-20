import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    // Add a global type for Node.js to avoid "any"
    var mongoose: MongooseConnection | undefined;
}

let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<Mongoose> => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            dbName: "aiSaas",
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    global.mongoose = cached; // Persist to the global scope
    return cached.conn;
};
