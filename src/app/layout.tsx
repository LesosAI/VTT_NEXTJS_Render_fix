import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LoginProvider } from "@/context/LoginContext";
import { ClientOnly } from "@/components/ClientOnly";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ForgeLab",
  description:
    "ForgeLab is a platform for creating and sharing digital art and campaigns for tabletop RPGs.",
  icons: {
    icon: [
      { url: "/forgelabiconblack.png", sizes: "32x32", type: "image/png" },
      { url: "/forgelabiconblack.png", sizes: "16x16", type: "image/png" },
    ],
    apple: {
      url: "/forgelabiconblack.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoginProvider>
          <ClientOnly>{children}</ClientOnly>
        </LoginProvider>
      </body>
    </html>
  );
}
