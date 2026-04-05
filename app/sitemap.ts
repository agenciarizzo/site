import type { MetadataRoute } from "next";
import { portfolioCases } from "@/lib/portfolio";

const BASE_URL = "https://agenciarizzo.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/servicos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
  ];

  const serviceSlugs = [
    "seo-medico",
    "google-ads-medico",
    "gestao-redes-sociais",
    "branding-medico",
    "marketing-conteudo",
    "google-meu-negocio",
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE_URL}/servicos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioCases.map((item) => ({
    url: `${BASE_URL}/portfolio/${item.slug}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const especialidadeSlugs = [
    "dermatologia",
    "ortopedia",
    "medicina-estetica",
    "pediatria",
    "oftalmologia",
    "cardiologia",
  ];

  const especialidadeRoutes: MetadataRoute.Sitemap = especialidadeSlugs.map(
    (slug) => ({
      url: `${BASE_URL}/especialidades/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  const cidadeSlugs = [
    "sao-paulo",
    "belo-horizonte",
    "rio-de-janeiro",
    "curitiba",
    "recife",
    "porto-alegre",
  ];

  const cidadeRoutes: MetadataRoute.Sitemap = cidadeSlugs.map((slug) => ({
    url: `${BASE_URL}/cidades/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...portfolioRoutes,
    ...especialidadeRoutes,
    ...cidadeRoutes,
  ];
}
