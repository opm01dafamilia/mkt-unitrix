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
    const { product_service, target_audience, campaign_goal, funnel_type } = await req.json();

    const prompt = `Você é um estrategista de marketing digital expert em funis de vendas. Crie um funil completo.

Produto/Serviço: ${product_service}
Público-alvo: ${target_audience}
Objetivo: ${campaign_goal}
Tipo de funil: ${funnel_type}

Retorne APENAS um JSON object (sem markdown, sem explicações) com esta estrutura:
{
  "stages": [
    {
      "name": "Nome da Etapa",
      "objective": "Objetivo desta etapa (máx 80 chars)",
      "content_type": "Tipo de conteúdo recomendado",
      "content_format": "Formato do conteúdo (vídeo, texto, imagem, etc)",
      "message_goal": "Objetivo da mensagem nesta etapa",
      "user_action": "Ação esperada do usuário"
    }
  ],
  "email_sequence": [
    {
      "subject": "Assunto do e-mail",
      "objective": "Objetivo do e-mail",
      "summary": "Resumo do conteúdo (máx 120 chars)"
    }
  ],
  "ad_sequence": [
    {
      "type": "Tipo do anúncio (descoberta/remarketing/conversão)",
      "objective": "Objetivo do anúncio",
      "idea": "Ideia principal do anúncio (máx 100 chars)"
    }
  ]
}

Gere 5 etapas no funil (descoberta, interesse, consideração, conversão, pós-venda), 5 e-mails e 3 anúncios.
Responda APENAS com o JSON, sem markdown.`;

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

    let funnel;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      funnel = JSON.parse(cleaned);
    } catch {
      funnel = {
        stages: [
          { name: "Descoberta", objective: "Atrair atenção do público", content_type: "Conteúdo educativo", content_format: "Vídeo curto", message_goal: "Gerar awareness", user_action: "Assistir / Curtir" },
          { name: "Interesse", objective: "Gerar engajamento", content_type: "Prova social", content_format: "Carrossel", message_goal: "Criar conexão", user_action: "Comentar / Salvar" },
          { name: "Consideração", objective: "Educar sobre solução", content_type: "Webinar / Demo", content_format: "Vídeo longo", message_goal: "Mostrar valor", user_action: "Cadastrar-se" },
          { name: "Conversão", objective: "Fechar venda", content_type: "Oferta direta", content_format: "Landing page", message_goal: "Converter", user_action: "Comprar" },
          { name: "Pós-venda", objective: "Fidelizar cliente", content_type: "Onboarding", content_format: "E-mail", message_goal: "Reter", user_action: "Usar produto" },
        ],
        email_sequence: [
          { subject: "Bem-vindo!", objective: "Boas-vindas", summary: "Apresentação e primeiros passos" },
          { subject: "Conteúdo exclusivo", objective: "Entregar valor", summary: "Material gratuito relevante" },
          { subject: "O que dizem nossos clientes", objective: "Prova social", summary: "Depoimentos e cases" },
          { subject: "Oferta especial para você", objective: "Converter", summary: "Desconto por tempo limitado" },
          { subject: "Última chance", objective: "Urgência", summary: "Lembrete final da oferta" },
        ],
        ad_sequence: [
          { type: "Descoberta", objective: "Atrair público frio", idea: "Vídeo educativo sobre o problema que " + product_service + " resolve" },
          { type: "Remarketing", objective: "Re-engajar visitantes", idea: "Depoimento de cliente com resultados" },
          { type: "Conversão", objective: "Fechar venda", idea: "Oferta com desconto e urgência" },
        ],
      };
    }

    return new Response(JSON.stringify({ funnel }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
