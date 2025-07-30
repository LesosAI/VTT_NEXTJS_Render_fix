import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LoginProvider } from "@/context/LoginContext";
import { ClientOnly } from "@/components/ClientOnly";
import Script from "next/script";

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
      { url: "/ForgelabPro.png", sizes: "any", type: "image/png" },
      { url: "/ForgelabPro.png", sizes: "32x32", type: "image/png" },
      { url: "/ForgelabPro.png", sizes: "16x16", type: "image/png" },
    ],
    apple: {
      url: "/ForgelabPro.png",
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
      <head>
        <link rel="icon" href="/ForgelabPro.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/ForgelabPro.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/ForgelabPro.png?v=2" />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-M2B6K69L');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-M2B6K69L"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <LoginProvider>
          <ClientOnly>{children}</ClientOnly>
        </LoginProvider>
      </body>
    </html>
  );
}
