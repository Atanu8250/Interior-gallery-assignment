/**
 * Purpose: Starts the HTTP server and coordinates startup dependencies.
 * How it is used: Run by npm scripts as the executable backend entry point.
 * Continue here: DB connect, app.listen, graceful shutdown, and startup logs.
 */
import { app } from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';

async function start() {
    try {
        await connectDB();

        const server = app.listen(env.port, () => {
            console.log('App is running on port:', env.port);
        });

        const shutdown = async () => {
            console.log('Shutting down server...');
            server.close(async () => {
                await disconnectDB();
                process.exit(0);
            });
            // Force exit after timeout
            setTimeout(() => process.exit(1), 30_000);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (err) {
        console.error('Failed to start application', err);
        process.exit(1);
    }
}

start();

