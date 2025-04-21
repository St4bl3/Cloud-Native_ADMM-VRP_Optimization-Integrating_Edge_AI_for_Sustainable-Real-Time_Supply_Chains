import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconExchange,
  IconHome,
  IconInfoCircleFilled,
  IconPackage,
  IconTruck,
} from "@tabler/icons-react";
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
  title: "verdeCorsa",
  description: "Sustainable Logistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "Orders",
      icon: (
        <IconPackage className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/add-demands",
    },
    {
      title: "Trucks",
      icon: (
        <IconTruck className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/add-trucks",
    },

    {
      title: "Routing",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/routing",
    },
    {
      title: "Help",
      icon: (
        <IconInfoCircleFilled className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/docs",
    },

    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-max z-50">
          <FloatingDock items={links} />
        </div>
        {children}
      </body>
    </html>
  );
}
