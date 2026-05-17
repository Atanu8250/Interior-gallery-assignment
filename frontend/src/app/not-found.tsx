import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404 - Page Not Found</h1>
      <br/>
      <p>The page you're looking for doesn't exist.</p>
      <br/>
      <Link href="/">← Back to Gallery</Link>
    </div>
  );
}