/**
 * Purpose: Creates and configures the Express application instance.
 * How it is used: Imported by the server bootstrap to attach middleware and routes.
 * Continue here: App-level middleware, route mounting, and global error wiring.
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(cors());

// Mount API routes under a versioned path
app.use('/api/v1', router);

// Root welcome (keeps your existing behavior)
app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Interior gallery');
});

// Inline 404 handler (we're not using external notFound middleware yet)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        data: null,
        meta: null,
    });
});

// Inline error handler (keeps a consistent shape without external middleware files)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const status = err?.statusCode ?? 500;
    const message = err?.message ?? 'Internal server error';
    res.status(status).json({ success: false, message, data: null, meta: null });
});

export { app };