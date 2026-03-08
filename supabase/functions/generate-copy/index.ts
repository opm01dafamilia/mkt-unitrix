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
    const { product_service, target_audience, sales_goal, content_type } = await req.json();

    const prompt = `Você é um copywriter profissional especializado em marketing digital. Gere 3 variações de copy de vendas.

Produto/Serviço: ${product_service}
Público-alvo: ${target_audience}
Objetivo da venda: ${sales_goal}
Tipo de conteúdo: ${content_type}

Para cada variação, retorne um JSON array com 3 objetos contendo:
- "headline": título principal chamativo (máximo 80 caracteres)
- "body": texto principal persuasivo com argumentos de venda (máximo 300 caracteres)
- "arguments": array com 3 argumentos de venda curtos (máximo 60 caracteres cada)
- "cta": chamada para ação (máximo 30 caracteres)

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

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let copies;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      copies = JSON.parse(cleaned);
    } catch {
      copies = [
        { headline: "Transforme seus resultados com " + product_service, body: "A solução ideal para " + target_audience + ". Resultados comprovados e garantidos.", arguments: ["Resultados rápidos", "Fácil de usar", "Suporte dedicado"], cta: "Comece Agora" },
        { headline: "Descubra o poder de " + product_service, body: "Feito para quem busca " + sales_goal + ". Milhares já confiam.", arguments: ["Tecnologia avançada", "Preço acessível", "Garantia total"], cta: "Saiba Mais" },
        { headline: product_service + " - Sua melhor escolha", body: "Não perca mais tempo. " + product_service + " entrega o que promete.", arguments: ["Comprovado pelo mercado", "ROI garantido", "Sem complicação"], cta: "Teste Grátis" },
      ];
    }

    return new Response(JSON.stringify({ copies }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
