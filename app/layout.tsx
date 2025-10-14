import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://comunidadeflix.com"),
  title: {
    default: "ComunidadeFlix - Educacao Financeira que Transforma",
    template: "%s | ComunidadeFlix",
  },
  description:
    "Domine seu dinheiro em 30 dias com a metodologia do Mitsuo Ishida. Cursos, consultoria e e-books sobre financas pessoais, impostos e investimentos.",
  keywords: [
    "educacao financeira",
    "imposto de renda",
    "investimentos",
    "financas pessoais",
    "mitjunior",
    "mitsuo ishida",
    "me poupe",
    "cursos online",
    "consultoria financeira",
    "planejamento financeiro",
    "como investir",
    "educacao fiscal",
  ],
  authors: [{ name: "Mitsuo Ishida (mitjunior)" }],
  creator: "ComunidadeFlix",
  publisher: "ComunidadeFlix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://comunidadeflix.com",
    siteName: "ComunidadeFlix",
    title: "ComunidadeFlix - Educacao Financeira que Transforma",
    description: "Domine seu dinheiro em 30 dias com a metodologia do Mitsuo Ishida",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ComunidadeFlix - Educacao Financeira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ComunidadeFlix - Educacao Financeira",
    description: "Domine seu dinheiro em 30 dias",
    images: ["/og-image.jpg"],
    creator: "@mitjunior",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token_aqui",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://comunidadeflix.com" />
        <meta name="theme-color" content="#0F1419" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
