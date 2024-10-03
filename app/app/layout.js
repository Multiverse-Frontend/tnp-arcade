import "./globals.css";
import { Play } from "next/font/google";
import { Press_Start_2P } from "next/font/google";

const play = Play({
  subsets: ["latin"],
  variable: "--font-play",
  weight: ["400", "700"],
});

const pressStart2p = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  weight: ["400"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${play.variable} ${pressStart2p.variable}`}>
        {children}
      </body>
    </html>
  );
}
