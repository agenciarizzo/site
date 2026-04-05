const BASE_URL = "https://agenciarizzo.com.br";

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${BASE_URL}/#organization`,
  name: "Agência Rizzo",
  description:
    "Agência de marketing digital especializada em marketing médico. Ajudamos médicos e clínicas a crescerem sua presença digital e a captar mais pacientes.",
  url: BASE_URL,
  telephone: "+55-11-99999-0000",
  email: "contato@agenciarizzo.com.br",
  address: {
    "@type": "PostalAddress",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  sameAs: [
    "https://instagram.com/agenciarizzo",
    "https://linkedin.com/company/agenciarizzo",
  ],
  areaServed: {
    "@type": "Country",
    name: "Brazil",
  },
  priceRange: "$$",
};

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function professionalServiceJsonLd(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: service.name,
    description: service.description,
    url: `${BASE_URL}${service.url}`,
    provider: {
      "@type": "Organization",
      name: "Agência Rizzo",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "Brazil",
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${BASE_URL}${article.url}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    image: article.imageUrl,
    author: {
      "@type": "Organization",
      name: "Agência Rizzo",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Agência Rizzo",
      url: BASE_URL,
    },
  };
}
