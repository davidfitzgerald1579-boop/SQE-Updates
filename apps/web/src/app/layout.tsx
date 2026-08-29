import type { Metadata, Viewport } from "next";
import { EB_Garamond, Lato } from "next/font/google";
import "./globals.css";

const headingFont = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SQE Updates",
    template: "%s | SQE Updates",
  },
  description:
    "Sitting-specific, source-backed legal updates for SQE1 and SQE2 candidates.",
  applicationName: "SQE Updates",
  category: "education",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1e3a8a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
