import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LA VER’nO | Ways of Men",
  description:
    "An atmospheric luxury world of mechanical watches, woven silk ties, sculpted cufflinks, and signature perfumes in Obsidian, Emerald, and Ruby.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-obsidian text-warm-ivory font-jost antialiased selection:bg-antique-gold/20 selection:text-warm-ivory min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
