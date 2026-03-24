import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXTAUTH_URL || "https://blog-app-ts-iota.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/write/", "/edit/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
