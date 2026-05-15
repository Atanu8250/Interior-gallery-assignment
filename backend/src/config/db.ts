/**
 * Purpose: Centralizes MongoDB and Mongoose connection setup.
 * How it is used: Called during server startup before accepting requests.
 * Continue here: Connect options, retry logic, and connection event handlers.
 */
import mongoose from "mongoose";
import { env } from "./env";

const DEFAULT_MONGO_OPTIONS: mongoose.ConnectOptions = {
	// Add options here as needed. Mongoose >=6 has sensible defaults.
	// Example placeholders:
	// serverSelectionTimeoutMS: 5000,
    
};

async function tryConnect(uri: string, options: mongoose.ConnectOptions) {
	return mongoose.connect(uri, options);
}

/**
 * Connect to MongoDB with simple retry/backoff.
 * @param maxRetries number of retry attempts on initial connect
 */
export async function connectDB(maxRetries = 5): Promise<void> {
	const uri = env.mongoUri;
	let attempt = 0;
	const baseDelay = 1000; // ms

	while (true) {
		try {
			await tryConnect(uri, DEFAULT_MONGO_OPTIONS);
			console.info("MongoDB connected");
			return;
		} catch (err) {
			attempt += 1;
			console.error(`MongoDB connect attempt ${attempt} failed:`, err);
			if (attempt > maxRetries) {
				console.error("Exceeded max MongoDB connect retries");
				throw err;
			}
			const delay = baseDelay * Math.pow(2, attempt - 1);
			// eslint-disable-next-line no-await-in-loop
			await new Promise((res) => setTimeout(res, delay));
		}
	}
}

export async function disconnectDB(): Promise<void> {
	try {
		await mongoose.connection.close();
		console.info("MongoDB connection closed");
	} catch (err) {
		console.error("Error closing MongoDB connection:", err);
	}
}

// Connection event logging (keeps app-level logs consistent)
mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
	console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
	console.info("MongoDB reconnected");
});

export default mongoose;
