import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { PostHogProvider } from "@/contexts/PostHogProvider";
import { Toaster } from "@/components/ui/sonner";

import { organizationSchema } from "@/lib/schema";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planify | CRM pour Conseillers Financiers",
  description: "La plateforme CRM pensée pour les professionnels de l'assurance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.className} bg-slate-900 antialiased`}>
        <PostHogProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
