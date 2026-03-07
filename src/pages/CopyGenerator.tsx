import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Copy, Sparkles } from "lucide-react";

const mockCopy = {
  headline: "Pare de perder tempo com marketing manual",
  subheadline: "A plataforma que automatiza sua estratégia de marketing digital de ponta a ponta",
  problema: "Você gasta horas criando anúncios, escrevendo copies e planejando funis de vendas. Enquanto isso, seus concorrentes estão escalando com inteligência artificial.",
  solucao: "Com o MarketFlow, você gera anúncios profissionais, copies persuasivas e funis completos em minutos. Tudo com IA treinada em milhões de campanhas de sucesso.",
  beneficios: [
    "Gere anúncios otimizados para qualquer plataforma em segundos",
    "Crie copies de alta conversão com frameworks comprovados",
    "Monte funis de vendas completos com sequências automatizadas",
    "Analise o desempenho das suas campanhas em tempo real",
  ],
  cta: "Comece sua avaliação gratuita de 14 dias →",
  urgencia: "Oferta limitada: Primeiros 100 usuários ganham 50% de desconto no plano anual.",
};

const CopyGenerator = () => {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Gerador de Copy</h1>
        <p className="text-muted-foreground text-sm mt-1">Crie textos de vendas persuasivos e otimizados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Configurações da Copy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Produto</Label>
              <Input placeholder="Ex: MarketFlow - SaaS de Marketing" className="mt-1.5" />
            </div>
            <div>
              <Label>Público Alvo</Label>
              <Input placeholder="Ex: Empreendedores digitais" className="mt-1.5" />
            </div>
            <div>
              <Label>Objetivo da Venda</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Gerar Vendas</SelectItem>
                  <SelectItem value="leads">Capturar Leads</SelectItem>
                  <SelectItem value="trial">Iniciar Trial</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Conteúdo</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landing">Landing Page</SelectItem>
                  <SelectItem value="email">E-mail Marketing</SelectItem>
                  <SelectItem value="social">Post Social</SelectItem>
                  <SelectItem value="video">Script de Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => setGenerated(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar Copy
            </Button>
          </CardContent>
        </Card>

        <div>
          {generated ? (
            <Card className="glass-card glow-green">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Copy Gerada</CardTitle>
                  <Button variant="ghost" size="sm"><Copy className="h-3 w-3" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-primary font-medium mb-1">HEADLINE</p>
                  <p className="font-bold text-lg">{mockCopy.headline}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">SUBHEADLINE</p>
                  <p className="text-muted-foreground">{mockCopy.subheadline}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">PROBLEMA</p>
                  <p className="text-muted-foreground">{mockCopy.problema}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">SOLUÇÃO</p>
                  <p className="text-muted-foreground">{mockCopy.solucao}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">BENEFÍCIOS</p>
                  <ul className="space-y-1">
                    {mockCopy.beneficios.map((b, i) => (
                      <li key={i} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">CTA</p>
                  <p className="font-semibold">{mockCopy.cta}</p>
                </div>
                <div>
                  <p className="text-xs text-primary font-medium mb-1">URGÊNCIA</p>
                  <p className="text-muted-foreground">{mockCopy.urgencia}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Preencha os campos e clique em gerar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyGenerator;
