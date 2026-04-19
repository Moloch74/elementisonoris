import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://elementisonori.growtrend.uk";

const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/chi-siamo", changefreq: "monthly", priority: "0.7" },
  { path: "/catalogo", changefreq: "daily", priority: "0.9" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
  { path: "/eventi", changefreq: "weekly", priority: "0.7" },
  { path: "/contatti", changefreq: "monthly", priority: "0.6" },
];

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products, error } = await supabase
      .from("products")
      .select("id, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    const today = new Date().toISOString().split("T")[0];

    const urls: string[] = [];

    for (const r of STATIC_ROUTES) {
      urls.push(
        `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
      );
    }

    for (const p of products ?? []) {
      const lastmod = p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : today;
      const loc = `${SITE_URL}/shop?p=${escapeXml(p.id)}`;
      urls.push(
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<error>${escapeXml(message)}</error>`,
      {
        headers: { ...corsHeaders, "Content-Type": "application/xml; charset=utf-8" },
        status: 500,
      }
    );
  }
});
