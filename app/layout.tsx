import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import Base from "../components/base";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

const Noto = Noto_Sans_Thai({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Chickeam",
  description: "Chickeam Video",
  icons: {
    icon: '/favicon.ico',
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body className={Noto.className}>
      <NextTopLoader color="#F50F2B" showSpinner={false}/>
        <SessionProvider><Base>{children}</Base></SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
