// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Area 1337";
export const SITE_DESCRIPTION =
  "Elite software for professionals who demand the best. Area 1337 builds enterprise-grade tools for security, compliance, encryption, and beyond.";
export const SITE_URL = "https://area1337.com";
export const COMPANY_NAME = "Area 1337";
export const COMPANY_LEGAL_NAME = "Mecanik Dev Ltd";
export const COMPANY_EMAIL = "contact@area1337.com";
export const COMPANY_SUPPORT_EMAIL = "support@area1337.com";

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const PLATFORMS = ["Windows", "macOS", "Linux"] as const;

export interface ProductEdition {
  name: string;
  price: string;
  features: readonly string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  platforms: readonly string[];
  status: "available" | "coming-soon";
  href: string;
  editions: Record<string, ProductEdition>;
}

export const PRODUCTS: readonly Product[] = [
  {
    id: "v1337-registry",
    name: "V1337 Registry",
    tagline: "Encrypted Compliance Evidence Registry",
    description:
      "Local-first encrypted compliance evidence registry for UK tax & international regulatory compliance. Manage document vaults, audit trails, risk scoring, and evidence exports with zero external dependencies.",
    platforms: ["Windows", "macOS", "Linux"],
    status: "available",
    href: "/products",
    editions: {
      business: {
        name: "Business",
        price: "Contact Sales",
        features: [
          "AES-256-CBC encrypted vaults",
          "Full-text search (FTS5)",
          "Immutable audit trail",
          "Compliance risk scoring",
          "Retention policy management",
          "7 jurisdiction templates",
          "AI-powered analysis (local + remote)",
          "Evidence relationship graph",
          "Email evidence capture",
          "Prepare for Audit wizard",
          "CSV & encrypted export packages",
          "Application logging & diagnostics",
        ],
      },
      enterprise: {
        name: "Enterprise",
        price: "Contact Sales",
        features: [
          "Everything in Business, plus:",
          "Team / multi-user server mode",
          "TLS-encrypted server communication",
          "Mutual TLS (mTLS) support",
          "Centralized vault management",
          "Real-time collaboration features",
          "Document locking & sync",
          "Server push notifications",
          "Role-based access control",
          "TOTP two-factor authentication",
          "Dedicated support & SLA",
          "Custom integration assistance",
        ],
      },
    },
  },
] as const;
