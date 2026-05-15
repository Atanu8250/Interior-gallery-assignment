/**
 * Purpose: Loads and validates environment configuration values.
 * How it is used: Imported by modules that need typed runtime config.
 * Continue here: Env parsing, defaults, required keys, and type-safe exports.
 */
import dotenv from 'dotenv';
dotenv.config();

type Env = {
    port: number;
    mongoUri: string;
    nodeEnv: string;
};

const port = Number(process.env.PORT ?? 5000);
const mongoUri = process.env.MONGO_URI;
const nodeEnv = process.env.NODE_ENV ?? "development";

if (!mongoUri) {
    throw new Error("MONGO_URI is required");
}

export const env: Env = {
    port,
    mongoUri,
    nodeEnv,
};
