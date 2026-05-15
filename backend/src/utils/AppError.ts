/**
 * Purpose: Custom application error class for operational failures.
 * How it is used: Thrown in service/controller layers for known error cases.
 * Continue here: statusCode, error code, and safe public message handling.
 *
 * Usage example:
 *   throw new AppError(400, 'Invalid request payload');
 *
 * Rationale:
 *   Use an AppError for expected, operational errors so the centralized
 *   error middleware can map them to proper HTTP responses.
 */
export class AppError extends Error {
	statusCode: number;
	isOperational: boolean;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;

		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace?.(this, this.constructor);
	}
}

