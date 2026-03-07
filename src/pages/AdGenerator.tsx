import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Copy, Sparkles } from "lucide-react";

const mockAds = [
  {
    platform: "Facebook",
    headline: "🚀 Transforme seu negócio com MarketFlow",
    body: "Automatize suas campanhas de marketing e aumente suas vendas em até 300%. Experimente grátis por 14 dias!",
    cta: "Comece Agora",
  },
  {
    platform: "Instagram",
    headline: "Marketing inteligente, resultados reais ✨",
    body: "Crie anúncios, copies e funis de vendas com IA. Mais de 10.000 empresas já usam.",
    cta: "Saiba Mais",
  },
  {
    platform: "Google Ads",
    headline: "Ferramentas de Marketing com IA | MarketFlow",
    body: "Gere anúncios profissionais em segundos. Otimize campanhas automaticamente. ROI garantido.",
    cta: "Teste Grátis",
  },
];

const AdGenerator = () => {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Gerador de Anúncios</h1>
        <p className="text-muted-foreground text-sm mt-1">Crie anúncios otimizados para qualquer plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Configurações do Anúncio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Produto ou Serviço</Label>
              <Input placeholder="Ex: Plataforma SaaS de marketing" className="mt-1.5" />
            </div>
            <div>
              <Label>Público Alvo</Label>
              <Input placeholder="Ex: Empreendedores digitais, 25-45 anos" className="mt-1.5" />
            </div>
            <div>
              <Label>Objetivo da Campanha</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversao">Conversão</SelectItem>
                  <SelectItem value="trafego">Tráfego</SelectItem>
                  <SelectItem value="engajamento">Engajamento</SelectItem>
                  <SelectItem value="branding">Branding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Plataforma</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Informações Adicionais</Label>
              <Textarea placeholder="Descreva detalhes extras sobre o produto..." className="mt-1.5" rows={3} />
            </div>
            <Button className="w-full" onClick={() => setGenerated(true)}>
              <Megaphone className="h-4 w-4 mr-2" />
              Gerar Anúncios
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {(generated ? mockAds : []).map((ad, i) => (
            <Card key={i} className="glass-card glow-green" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{ad.platform}</span>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <h3 className="font-semibold text-sm mb-2">{ad.headline}</h3>
                <p className="text-sm text-muted-foreground mb-3">{ad.body}</p>
                <Button size="sm" className="text-xs">{ad.cta}</Button>
              </CardContent>
            </Card>
          ))}
          {!generated && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Megaphone className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Preencha os campos e clique em gerar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdGenerator;
