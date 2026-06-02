import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Release Checklist",
  description: "Track release checklist progress and status.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
