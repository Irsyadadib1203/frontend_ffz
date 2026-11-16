import type { Metadata } from "next";
import "@/app/global.css";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "IRXPLAY";
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL  || "https://irxplay.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Transaksi Terakhir`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Live Feed transaksi terakhir.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  )
}
