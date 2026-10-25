import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Daloy — Make work flow",
  description: "Design and simulate thoughtful automations with Daloy.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
