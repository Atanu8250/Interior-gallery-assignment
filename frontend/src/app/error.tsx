"use client";

/**
 * Generic client-side error boundary UI for app router segments.
 */
interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Something went wrong</h1>
      <br/>
      <p>{error.message}</p>
      <br/>
      <button type="button" className="errorButton" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}