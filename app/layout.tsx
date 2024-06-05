import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contact ship challenge",
  description:
    "Contact ship challenge made by Carlos Gomes using Next.js, React.js and TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-7xl mx-auto grid min-h-screen grid-rows-[auto,1fr,auto] font-sans antialiased bg-[#1D232A]`}
      >
        <header className="text-xl text-center font-bold leading-[4rem] pt-5">
          <Link className="text-3xl font-bold text-white" href="/">
            ContactShip Challenge
          </Link>
        </header>
        <main className="py-8">{children}</main>
        <footer className="text-center text-white leading-[4rem] opacity-70">
          © {new Date().getFullYear()} Carlos Gomes
        </footer>
      </body>
    </html>
  );
}
