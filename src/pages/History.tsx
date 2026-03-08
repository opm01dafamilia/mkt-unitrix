import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, FileText, GitBranch, BarChart3, Clock, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdGeneration {
  id: string;
  product_service: string;
  target_audience: string;
  campaign_goal: string;
  platform: string;
  generated_ads: any;
  created_at: string;
}

interface CopyGeneration {
  id: string;
  product_service: string;
  target_audience: string;
  sales_goal: string;
  content_type: string;
  generated_copy: any;
  created_at: string;
}

const mockFunis = [
  { title: "Funil de Webinar", steps: 4, date: "03/03/2026", status: "Ativo" },
  { title: "Funil de Lançamento", steps: 5, date: "20/02/2026", status: "Pausado" },
  { title: "Funil Evergreen", steps: 3, date: "10/02/2026", status: "Ativo" },
];

const mockCampanhas = [
  { title: "Performance Q4 2025", period: "Out-Dez 2025", date: "05/01/2026", roi: "280%" },
  { title: "Black Friday 2025", period: "Nov 2025", date: "01/12/2025", roi: "420%" },
  { title: "Lançamento Beta", period: "Set 2025", date: "01/10/2025", roi: "180%" },
];

const History = () => {
  const { user } = useAuth();
  const [adGenerations, setAdGenerations] = useState<AdGeneration[]>([]);
  const [copyGenerations, setCopyGenerations] = useState<CopyGeneration[]>([]);
  const [selectedAd, setSelectedAd] = useState<AdGeneration | null>(null);
  const [selectedCopy, setSelectedCopy] = useState<CopyGeneration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [adsRes, copiesRes] = await Promise.all([
        supabase.from("ad_generations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("copy_generations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setAdGenerations(adsRes.data || []);
      setCopyGenerations(copiesRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("pt-BR");

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
          {loading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Carregando...</div>
          ) : adGenerations.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">Nenhum anúncio gerado ainda</div>
          ) : (
            adGenerations.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{item.product_service}</p>
                      <p className="text-xs text-muted-foreground">{item.platform} · {item.campaign_goal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{formatDate(item.created_at)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedAd(item)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Badge variant="secondary">Concluído</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="copies" className="mt-4 space-y-3">
          {loading ? (
            <div className="text-sm text-muted-foreground text-center py-8">Carregando...</div>
          ) : copyGenerations.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">Nenhuma copy gerada ainda</div>
          ) : (
            copyGenerations.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{item.product_service}</p>
                      <p className="text-xs text-muted-foreground">{item.content_type} · {item.sales_goal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{formatDate(item.created_at)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCopy(item)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Badge variant="secondary">Concluído</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="funis" className="mt-4 space-y-3">
          {mockFunis.map((item, i) => (
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
          {mockCampanhas.map((item, i) => (
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

      {/* Ad Detail Dialog */}
      <Dialog open={!!selectedAd} onOpenChange={() => setSelectedAd(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Anúncios Gerados</DialogTitle>
          </DialogHeader>
          {selectedAd && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {selectedAd.platform} · {selectedAd.campaign_goal} · {formatDate(selectedAd.created_at)}
              </p>
              {Array.isArray(selectedAd.generated_ads) && selectedAd.generated_ads.map((ad: any, i: number) => (
                <Card key={i} className="glass-card">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{ad.headline}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{ad.body}</p>
                    <Badge>{ad.cta}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Copy Detail Dialog */}
      <Dialog open={!!selectedCopy} onOpenChange={() => setSelectedCopy(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Copies Geradas</DialogTitle>
          </DialogHeader>
          {selectedCopy && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {selectedCopy.content_type} · {selectedCopy.sales_goal} · {formatDate(selectedCopy.created_at)}
              </p>
              {Array.isArray(selectedCopy.generated_copy) && selectedCopy.generated_copy.map((copy: any, i: number) => (
                <Card key={i} className="glass-card">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs text-primary font-medium">HEADLINE</p>
                    <h3 className="font-semibold text-sm">{copy.headline}</h3>
                    <p className="text-xs text-primary font-medium mt-2">TEXTO</p>
                    <p className="text-sm text-muted-foreground">{copy.body}</p>
                    {copy.arguments && (
                      <>
                        <p className="text-xs text-primary font-medium mt-2">ARGUMENTOS</p>
                        <ul className="space-y-1">
                          {copy.arguments.map((arg: string, j: number) => (
                            <li key={j} className="text-sm text-muted-foreground flex gap-2"><span className="text-primary">•</span>{arg}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <Badge className="mt-2">{copy.cta}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
