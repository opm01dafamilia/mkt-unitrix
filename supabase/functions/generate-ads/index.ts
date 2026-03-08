import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product_service, target_audience, campaign_goal, platform } = await req.json();

    const prompt = `Você é um especialista em marketing digital. Gere 3 variações de anúncios para a plataforma ${platform}.

Produto/Serviço: ${product_service}
Público-alvo: ${target_audience}
Objetivo: ${campaign_goal}
Plataforma: ${platform}

Para cada variação, gere em JSON um array com 3 objetos, cada um contendo:
- "headline": título chamativo do anúncio (máximo 60 caracteres)
- "body": texto principal do anúncio (máximo 150 caracteres)
- "cta": chamada para ação (máximo 25 caracteres)

Responda APENAS com o JSON array, sem markdown, sem explicações.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response, handling possible markdown wrapping
    let ads;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      ads = JSON.parse(cleaned);
    } catch {
      ads = [
        { headline: "Descubra " + product_service, body: "A solução ideal para " + target_audience + ". Resultados comprovados.", cta: "Saiba Mais" },
        { headline: "Transforme seus resultados", body: product_service + " - feito para quem busca " + campaign_goal + ".", cta: "Comece Agora" },
        { headline: "Não perca essa oportunidade", body: "Milhares já usam " + product_service + ". Junte-se a eles!", cta: "Teste Grátis" },
      ];
    }

    return new Response(JSON.stringify({ ads }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
