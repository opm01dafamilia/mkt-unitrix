import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Mail, Megaphone, FileText, ChevronDown } from "lucide-react";

const funnelSteps = [
  {
    title: "Topo do Funil - Consciência",
    color: "from-primary/30 to-primary/10",
    width: "w-full",
    content: [
      { icon: Megaphone, label: "Anúncio no Facebook/Instagram", desc: "Anúncio de vídeo mostrando o problema que o produto resolve" },
      { icon: FileText, label: "Post no blog", desc: "Artigo: '5 erros que estão matando seu marketing digital'" },
    ],
    emails: ["E-mail 1: Boas-vindas + link para conteúdo gratuito", "E-mail 2: Case de sucesso de um cliente"],
  },
  {
    title: "Meio do Funil - Consideração",
    color: "from-primary/50 to-primary/20",
    width: "w-[85%]",
    content: [
      { icon: Megaphone, label: "Retargeting", desc: "Anúncio com depoimento de cliente para quem visitou o site" },
      { icon: FileText, label: "Webinar gratuito", desc: "Como automatizar seu marketing em 30 minutos" },
    ],
    emails: ["E-mail 3: Convite para webinar", "E-mail 4: Replay do webinar + oferta especial"],
  },
  {
    title: "Fundo do Funil - Decisão",
    color: "from-primary/70 to-primary/40",
    width: "w-[65%]",
    content: [
      { icon: Megaphone, label: "Anúncio de oferta", desc: "Oferta limitada: 50% de desconto nos primeiros 14 dias" },
      { icon: FileText, label: "Página de vendas", desc: "Landing page com prova social e garantia" },
    ],
    emails: ["E-mail 5: Oferta exclusiva com prazo", "E-mail 6: Último lembrete + bônus"],
  },
  {
    title: "Pós-venda - Retenção",
    color: "from-primary to-primary/60",
    width: "w-[45%]",
    content: [
      { icon: Mail, label: "Onboarding", desc: "Sequência de e-mails de boas-vindas e treinamento" },
      { icon: FileText, label: "Upsell", desc: "Apresentação de plano premium ou add-ons" },
    ],
    emails: ["E-mail 7: Guia de primeiros passos", "E-mail 8: Convite para plano anual"],
  },
];

const SalesFunnel = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground text-sm mt-1">Visualize e estruture seus funis de vendas</p>
        </div>
        <Button>
          <GitBranch className="h-4 w-4 mr-2" />
          Novo Funil
        </Button>
      </div>

      <div className="space-y-2 flex flex-col items-center">
        {funnelSteps.map((step, i) => (
          <div key={i} className={`${step.width} transition-all`}>
            <Card className={`glass-card overflow-hidden`}>
              <CardHeader className={`bg-gradient-to-r ${step.color} py-3`}>
                <CardTitle className="text-sm">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {step.content.map((item, j) => (
                    <div key={j} className="flex items-start gap-3 p-3 rounded-md bg-secondary/50">
                      <item.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 pt-3">
                  <p className="text-xs text-primary font-medium mb-2 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Sequência de E-mails
                  </p>
                  {step.emails.map((email, k) => (
                    <p key={k} className="text-xs text-muted-foreground ml-4 mb-1">• {email}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
            {i < funnelSteps.length - 1 && (
              <div className="flex justify-center py-1">
                <ChevronDown className="h-5 w-5 text-primary/50" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesFunnel;
