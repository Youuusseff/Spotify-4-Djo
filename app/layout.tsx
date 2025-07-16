import type { Metadata } from "next";
import { Figtree} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const font = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Listen to your favorite music with this Spotify clone built using Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.variable}`}>
        <Sidebar>
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
