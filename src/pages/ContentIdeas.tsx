import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Instagram, Video, Megaphone, FileText } from "lucide-react";

const categories = {
  posts: {
    icon: Instagram,
    label: "Posts",
    items: [
      { title: "Antes e Depois", desc: "Mostre a transformação que seu produto/serviço proporciona com imagens comparativas", tags: ["Instagram", "Facebook"] },
      { title: "Carrossel Educativo", desc: "5 dicas práticas de marketing digital que seu público pode aplicar hoje", tags: ["Instagram", "LinkedIn"] },
      { title: "Bastidores", desc: "Mostre o dia a dia da equipe e como o produto é desenvolvido", tags: ["Instagram", "TikTok"] },
      { title: "Enquete Interativa", desc: "Qual sua maior dificuldade em marketing digital? A) Criar conteúdo B) Gerar leads", tags: ["Stories", "Twitter"] },
      { title: "Depoimento de Cliente", desc: "Compartilhe resultados reais de clientes com números e métricas", tags: ["Todas"] },
    ],
  },
  anuncios: {
    icon: Megaphone,
    label: "Anúncios",
    items: [
      { title: "Anúncio de Escassez", desc: "Últimas vagas: apenas 10 acessos restantes com 50% de desconto", tags: ["Facebook", "Google"] },
      { title: "Social Proof Ad", desc: "Anúncio com depoimentos em vídeo de clientes satisfeitos", tags: ["Facebook", "Instagram"] },
      { title: "Comparação", desc: "Compare seu produto com a forma antiga de fazer as coisas", tags: ["Google", "YouTube"] },
      { title: "Retargeting de Carrinho", desc: "Lembre visitantes que não finalizaram a compra com oferta especial", tags: ["Facebook", "Google"] },
    ],
  },
  videos: {
    icon: Video,
    label: "Vídeos",
    items: [
      { title: "Tutorial Rápido", desc: "Como criar um anúncio de alta conversão em 60 segundos", tags: ["YouTube", "TikTok"] },
      { title: "Q&A ao Vivo", desc: "Responda as principais dúvidas sobre marketing digital ao vivo", tags: ["Instagram Live", "YouTube"] },
      { title: "Case Study", desc: "Documentário curto mostrando como um cliente triplicou suas vendas", tags: ["YouTube"] },
      { title: "Tendências", desc: "Top 5 tendências de marketing digital para 2025", tags: ["TikTok", "Reels"] },
    ],
  },
  campanhas: {
    icon: FileText,
    label: "Campanhas",
    items: [
      { title: "Lançamento Semente", desc: "Campanha de pré-lançamento com lista de espera e conteúdo exclusivo", tags: ["E-mail", "Social"] },
      { title: "Black Friday Antecipada", desc: "Campanha de uma semana com ofertas progressivas", tags: ["Todas"] },
      { title: "Desafio 7 Dias", desc: "Engaje sua audiência com um desafio gratuito de 7 dias", tags: ["E-mail", "Instagram"] },
      { title: "Parceria Estratégica", desc: "Campanha conjunta com influenciador ou marca complementar", tags: ["Social", "YouTube"] },
    ],
  },
};

const ContentIdeas = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Ideias de Conteúdo</h1>
        <p className="text-muted-foreground text-sm mt-1">Sugestões de conteúdo para suas estratégias de marketing</p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="bg-secondary">
          {Object.entries(categories).map(([key, cat]) => (
            <TabsTrigger key={key} value={key} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <cat.icon className="h-4 w-4 mr-1.5" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categories).map(([key, cat]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.items.map((item, i) => (
                <Card key={i} className="glass-card hover:glow-green transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentIdeas;
