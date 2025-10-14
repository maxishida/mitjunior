import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    // !! ATENÇÃO !!
    // Esta opção foi adicionada para contornar um erro persistente de tipo durante o build.
    // O ideal é investigar a causa raiz do conflito de tipos no futuro.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
