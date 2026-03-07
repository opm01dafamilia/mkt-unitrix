import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, FileText, GitBranch, BarChart3, Clock } from "lucide-react";

const history = {
  anuncios: [
    { title: "Campanha Black Friday", platform: "Facebook", date: "05/03/2026", status: "Concluído" },
    { title: "Lançamento Produto X", platform: "Instagram", date: "28/02/2026", status: "Concluído" },
    { title: "Retargeting Q1", platform: "Google Ads", date: "20/02/2026", status: "Concluído" },
    { title: "Branding Awareness", platform: "TikTok", date: "15/02/2026", status: "Concluído" },
  ],
  copies: [
    { title: "Landing Page SaaS", type: "Landing Page", date: "04/03/2026", status: "Concluído" },
    { title: "E-mail de Lançamento", type: "E-mail", date: "01/03/2026", status: "Concluído" },
    { title: "Script YouTube", type: "Script de Vídeo", date: "25/02/2026", status: "Concluído" },
  ],
  funis: [
    { title: "Funil de Webinar", steps: 4, date: "03/03/2026", status: "Ativo" },
    { title: "Funil de Lançamento", steps: 5, date: "20/02/2026", status: "Pausado" },
    { title: "Funil Evergreen", steps: 3, date: "10/02/2026", status: "Ativo" },
  ],
  campanhas: [
    { title: "Performance Q4 2025", period: "Out-Dez 2025", date: "05/01/2026", roi: "280%" },
    { title: "Black Friday 2025", period: "Nov 2025", date: "01/12/2025", roi: "420%" },
    { title: "Lançamento Beta", period: "Set 2025", date: "01/10/2025", roi: "180%" },
  ],
};

const History = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-muted-foreground text-sm mt-1">Visualize todos os itens gerados e analisados</p>
      </div>

      <Tabs defaultValue="anuncios">
        <TabsList className="bg-secondary">
          <TabsTrigger value="anuncios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Megaphone className="h-4 w-4 mr-1.5" /> Anúncios
          </TabsTrigger>
          <TabsTrigger value="copies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-4 w-4 mr-1.5" /> Copies
          </TabsTrigger>
          <TabsTrigger value="funis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <GitBranch className="h-4 w-4 mr-1.5" /> Funis
          </TabsTrigger>
          <TabsTrigger value="campanhas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-1.5" /> Campanhas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anuncios" className="mt-4 space-y-3">
          {history.anuncios.map((item, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{item.date}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="copies" className="mt-4 space-y-3">
          {history.copies.map((item, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{item.date}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="funis" className="mt-4 space-y-3">
          {history.funis.map((item, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.steps} etapas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{item.date}</span>
                  <Badge variant={item.status === "Ativo" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="campanhas" className="mt-4 space-y-3">
          {history.campanhas.map((item, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-primary font-medium">ROI: {item.roi}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{item.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
