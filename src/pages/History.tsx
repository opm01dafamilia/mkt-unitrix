import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, FileText, GitBranch, BarChart3, Clock, Eye, Loader2, Inbox } from "lucide-react";
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

interface FunnelGeneration {
  id: string;
  product_service: string;
  funnel_type: string;
  generated_funnel: any;
  created_at: string;
}

interface CampaignItem {
  id: string;
  campaign_name: string;
  platform: string;
  ad_cost: number;
  leads: number;
  sales: number;
  created_at: string;
}

const funnelTypeLabels: Record<string, string> = {
  captura_leads: "Captura de Leads",
  venda_direta: "Venda Direta",
  lancamento: "Lançamento",
  funil_conteudo: "Funil de Conteúdo",
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <Inbox className="h-10 w-10 mb-3 opacity-30" />
    <p className="text-sm">{message}</p>
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center py-12">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

const History = () => {
  const { user } = useAuth();
  const [adGenerations, setAdGenerations] = useState<AdGeneration[]>([]);
  const [copyGenerations, setCopyGenerations] = useState<CopyGeneration[]>([]);
  const [funnelGenerations, setFunnelGenerations] = useState<FunnelGeneration[]>([]);
  const [campaignItems, setCampaignItems] = useState<CampaignItem[]>([]);
  const [selectedAd, setSelectedAd] = useState<AdGeneration | null>(null);
  const [selectedCopy, setSelectedCopy] = useState<CopyGeneration | null>(null);
  const [selectedFunnel, setSelectedFunnel] = useState<FunnelGeneration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [adsRes, copiesRes, funnelsRes, campaignsRes] = await Promise.all([
        supabase.from("ad_generations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("copy_generations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("funnel_generations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("campaign_analysis").select("id, campaign_name, platform, ad_cost, leads, sales, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setAdGenerations(adsRes.data || []);
      setCopyGenerations(copiesRes.data || []);
      setFunnelGenerations(funnelsRes.data || []);
      setCampaignItems((campaignsRes.data as CampaignItem[]) || []);
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
          {loading ? <LoadingState /> : adGenerations.length === 0 ? (
            <EmptyState message="Nenhum anúncio gerado ainda. Acesse o Gerador de Anúncios para começar." />
          ) : (
            adGenerations.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Megaphone className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_service}</p>
                      <p className="text-xs text-muted-foreground">{item.platform} · {item.campaign_goal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{formatDate(item.created_at)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedAd(item)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="copies" className="mt-4 space-y-3">
          {loading ? <LoadingState /> : copyGenerations.length === 0 ? (
            <EmptyState message="Nenhuma copy gerada ainda. Acesse o Gerador de Copy para começar." />
          ) : (
            copyGenerations.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_service}</p>
                      <p className="text-xs text-muted-foreground">{item.content_type} · {item.sales_goal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{formatDate(item.created_at)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCopy(item)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="funis" className="mt-4 space-y-3">
          {loading ? <LoadingState /> : funnelGenerations.length === 0 ? (
            <EmptyState message="Nenhum funil gerado ainda. Acesse o Funil de Vendas para começar." />
          ) : (
            funnelGenerations.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <GitBranch className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_service}</p>
                      <p className="text-xs text-muted-foreground">{funnelTypeLabels[item.funnel_type] || item.funnel_type} · {item.generated_funnel?.stages?.length || 0} etapas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{formatDate(item.created_at)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedFunnel(item)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="campanhas" className="mt-4 space-y-3">
          {loading ? <LoadingState /> : campaignItems.length === 0 ? (
            <EmptyState message="Nenhuma campanha registrada ainda. Acesse Análise de Campanhas para começar." />
          ) : (
            campaignItems.map((item) => (
              <Card key={item.id} className="glass-card">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.campaign_name}</p>
                      <p className="text-xs text-muted-foreground">{item.platform} · {item.leads} leads · {item.sales} vendas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">R$ {Number(item.ad_cost).toFixed(2)}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(item.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Ad Detail Dialog */}
      <Dialog open={!!selectedAd} onOpenChange={() => setSelectedAd(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
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
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
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

      {/* Funnel Detail Dialog */}
      <Dialog open={!!selectedFunnel} onOpenChange={() => setSelectedFunnel(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Funil de Vendas</DialogTitle>
          </DialogHeader>
          {selectedFunnel && selectedFunnel.generated_funnel && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                {selectedFunnel.product_service} · {funnelTypeLabels[selectedFunnel.funnel_type] || selectedFunnel.funnel_type} · {formatDate(selectedFunnel.created_at)}
              </p>

              <div>
                <p className="text-sm font-semibold mb-2">Etapas</p>
                <div className="space-y-2">
                  {(selectedFunnel.generated_funnel.stages || []).map((s: any, i: number) => (
                    <div key={i} className="p-3 rounded-md bg-secondary/50">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.objective}</p>
                      <p className="text-xs text-muted-foreground">{s.content_type} · {s.user_action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">E-mails</p>
                <div className="space-y-2">
                  {(selectedFunnel.generated_funnel.email_sequence || []).map((e: any, i: number) => (
                    <div key={i} className="p-3 rounded-md bg-secondary/50">
                      <p className="text-sm font-medium">{e.subject}</p>
                      <p className="text-xs text-muted-foreground">{e.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Anúncios</p>
                <div className="space-y-2">
                  {(selectedFunnel.generated_funnel.ad_sequence || []).map((a: any, i: number) => (
                    <div key={i} className="p-3 rounded-md bg-secondary/50">
                      <p className="text-sm font-medium">{a.type}: {a.objective}</p>
                      <p className="text-xs text-muted-foreground">{a.idea}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
