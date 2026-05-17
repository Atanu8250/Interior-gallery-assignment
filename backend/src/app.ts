/**
 * Purpose: Creates and configures the Express application instance.
 * How it is used: Imported by the server bootstrap to attach middleware and routes.
 * Continue here: App-level middleware, route mounting, and global error wiring.
 */
import express, { Request, Response } from 'express';
import cors from 'cors';
import { router } from './routes';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(express.json());
app.use(cors());

// Mount API routes under a versioned path
app.use('/api/v1', router);

// Root welcome (keeps your existing behavior)
app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to Interior gallery');
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };