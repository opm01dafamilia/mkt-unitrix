import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Target, Plus, Loader2, Pencil, Trash2, Eye, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Campaign {
  id: string;
  campaign_name: string;
  platform: string;
  objective: string;
  start_date: string | null;
  end_date: string | null;
  impressions: number;
  clicks: number;
  leads: number;
  sales: number;
  ad_cost: number;
  created_at: string;
}

const COLORS = ["hsl(152, 60%, 42%)", "hsl(200, 60%, 50%)", "hsl(280, 60%, 50%)", "hsl(40, 60%, 50%)", "hsl(0, 60%, 50%)"];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
};

const CampaignAnalysis = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailCampaign, setDetailCampaign] = useState<Campaign | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    campaign_name: "", platform: "", objective: "", start_date: "", end_date: "",
    impressions: 0, clicks: 0, leads: 0, sales: 0, ad_cost: 0,
  });

  const resetForm = () => setForm({ campaign_name: "", platform: "", objective: "", start_date: "", end_date: "", impressions: 0, clicks: 0, leads: 0, sales: 0, ad_cost: 0 });

  const fetchCampaigns = async () => {
    if (!user) return;
    const { data } = await supabase.from("campaign_analysis").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setCampaigns((data as Campaign[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, [user]);

  const openNew = () => { resetForm(); setEditingId(null); setDialogOpen(true); };
  const openEdit = (c: Campaign) => {
    setForm({
      campaign_name: c.campaign_name, platform: c.platform || "", objective: c.objective || "",
      start_date: c.start_date || "", end_date: c.end_date || "",
      impressions: c.impressions, clicks: c.clicks, leads: c.leads, sales: c.sales, ad_cost: c.ad_cost,
    });
    setEditingId(c.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.campaign_name || !form.platform) { toast.error("Preencha nome e plataforma"); return; }
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        campaign_name: form.campaign_name,
        platform: form.platform,
        objective: form.objective,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        impressions: form.impressions,
        clicks: form.clicks,
        leads: form.leads,
        sales: form.sales,
        ad_cost: form.ad_cost,
      };
      if (editingId) {
        const { error } = await supabase.from("campaign_analysis").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Campanha atualizada!");
      } else {
        const { error } = await supabase.from("campaign_analysis").insert(payload);
        if (error) throw error;
        toast.success("Campanha registrada!");
      }
      setDialogOpen(false);
      resetForm();
      setEditingId(null);
      fetchCampaigns();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("campaign_analysis").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Campanha excluída");
    fetchCampaigns();
  };

  // KPI calculations
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((s, c) => s + (c.clicks || 0), 0);
  const totalLeads = campaigns.reduce((s, c) => s + (c.leads || 0), 0);
  const totalSales = campaigns.reduce((s, c) => s + (c.sales || 0), 0);
  const totalCost = campaigns.reduce((s, c) => s + Number(c.ad_cost || 0), 0);

  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";
  const conversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(2) : "0";
  const costPerLead = totalLeads > 0 ? (totalCost / totalLeads).toFixed(2) : "0";
  const costPerSale = totalSales > 0 ? (totalCost / totalSales).toFixed(2) : "0";

  const calcKpis = (c: Campaign) => {
    const ctrC = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0";
    const convC = c.clicks > 0 ? ((c.sales / c.clicks) * 100).toFixed(2) : "0";
    const cplC = c.leads > 0 ? (Number(c.ad_cost) / c.leads).toFixed(2) : "0";
    const cpsC = c.sales > 0 ? (Number(c.ad_cost) / c.sales).toFixed(2) : "0";
    return { ctr: ctrC, conv: convC, cpl: cplC, cps: cpsC };
  };

  // Chart data
  const platformData = Object.entries(
    campaigns.reduce<Record<string, number>>((acc, c) => { acc[c.platform || "Outro"] = (acc[c.platform || "Outro"] || 0) + Number(c.ad_cost || 0); return acc; }, {})
  ).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));

  const comparisonData = campaigns.slice(0, 8).map(c => ({
    name: c.campaign_name.length > 15 ? c.campaign_name.slice(0, 15) + "…" : c.campaign_name,
    leads: c.leads || 0,
    vendas: c.sales || 0,
  }));

  // Insights
  const insights: { label: string; value: string; color: string }[] = [];
  if (campaigns.length > 0) {
    const bestConv = [...campaigns].sort((a, b) => {
      const ra = a.clicks > 0 ? a.sales / a.clicks : 0;
      const rb = b.clicks > 0 ? b.sales / b.clicks : 0;
      return rb - ra;
    })[0];
    if (bestConv) insights.push({ label: "Melhor conversão", value: bestConv.campaign_name, color: "text-primary" });

    const highestCost = [...campaigns].sort((a, b) => Number(b.ad_cost) - Number(a.ad_cost))[0];
    if (highestCost) insights.push({ label: "Maior investimento", value: highestCost.campaign_name, color: "text-destructive" });

    const bestROI = [...campaigns].filter(c => Number(c.ad_cost) > 0).sort((a, b) => {
      const ra = a.sales / Number(a.ad_cost);
      const rb = b.sales / Number(b.ad_cost);
      return rb - ra;
    })[0];
    if (bestROI) insights.push({ label: "Melhor retorno", value: bestROI.campaign_name, color: "text-primary" });
  }

  const kpis = [
    { title: "CTR", value: `${ctr}%`, icon: Target },
    { title: "Taxa de Conversão", value: `${conversionRate}%`, icon: TrendingUp },
    { title: "Custo por Lead", value: `R$ ${costPerLead}`, icon: DollarSign },
    { title: "Custo por Venda", value: `R$ ${costPerSale}`, icon: Users },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Análise de Campanhas</h1>
          <p className="text-muted-foreground text-sm mt-1">Registre campanhas, acompanhe métricas e visualize desempenho</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Nova Campanha</Button>
      </div>

      {/* KPIs */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.title} className="glass-card">
              <CardContent className="p-5">
                <kpi.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {insights.map((ins, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-4 flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{ins.label}</p>
                  <p className={`text-sm font-semibold ${ins.color}`}>{ins.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">Comparação de Campanhas</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="leads" fill="hsl(200, 60%, 50%)" radius={[4, 4, 0, 0]} name="Leads" />
                  <Bar dataKey="vendas" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">Investimento por Plataforma</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" label={({ name, value }) => `${name}: R$${value}`}>
                    {platformData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaign list */}
      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Campanhas Registradas</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma campanha registrada. Clique em "Nova Campanha" para começar.</p>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 flex-wrap gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.campaign_name}</p>
                      <p className="text-xs text-muted-foreground">{c.platform} · {c.leads} leads · {c.sales} vendas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">R$ {Number(c.ad_cost).toFixed(2)}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailCampaign(c)}><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New/Edit campaign dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Campanha</Label>
              <Input value={form.campaign_name} onChange={e => setForm({ ...form, campaign_name: e.target.value })} placeholder="Ex: Black Friday 2026" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facebook Ads">Facebook Ads</SelectItem>
                    <SelectItem value="Instagram Ads">Instagram Ads</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Objetivo</Label>
                <Input value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} placeholder="Ex: Gerar leads" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data de Término</Label>
                <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-3">Métricas</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Impressões</Label>
                  <Input type="number" min={0} value={form.impressions} onChange={e => setForm({ ...form, impressions: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Cliques</Label>
                  <Input type="number" min={0} value={form.clicks} onChange={e => setForm({ ...form, clicks: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Leads</Label>
                  <Input type="number" min={0} value={form.leads} onChange={e => setForm({ ...form, leads: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Vendas</Label>
                  <Input type="number" min={0} value={form.sales} onChange={e => setForm({ ...form, sales: Number(e.target.value) })} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Custo do Anúncio (R$)</Label>
                  <Input type="number" min={0} step="0.01" value={form.ad_cost} onChange={e => setForm({ ...form, ad_cost: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingId ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campaign detail dialog */}
      <Dialog open={!!detailCampaign} onOpenChange={() => setDetailCampaign(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{detailCampaign?.campaign_name}</DialogTitle>
          </DialogHeader>
          {detailCampaign && (() => {
            const k = calcKpis(detailCampaign);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">Plataforma</p><p className="text-sm font-medium">{detailCampaign.platform || "—"}</p></div>
                  <div><p className="text-xs text-muted-foreground">Objetivo</p><p className="text-sm font-medium">{detailCampaign.objective || "—"}</p></div>
                  <div><p className="text-xs text-muted-foreground">Início</p><p className="text-sm font-medium">{detailCampaign.start_date || "—"}</p></div>
                  <div><p className="text-xs text-muted-foreground">Término</p><p className="text-sm font-medium">{detailCampaign.end_date || "—"}</p></div>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-medium mb-2">Métricas</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Impressões:</span> {detailCampaign.impressions}</div>
                    <div><span className="text-muted-foreground">Cliques:</span> {detailCampaign.clicks}</div>
                    <div><span className="text-muted-foreground">Leads:</span> {detailCampaign.leads}</div>
                    <div><span className="text-muted-foreground">Vendas:</span> {detailCampaign.sales}</div>
                    <div className="col-span-2"><span className="text-muted-foreground">Custo:</span> R$ {Number(detailCampaign.ad_cost).toFixed(2)}</div>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-medium mb-2">Indicadores</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">CTR:</span> <span className="text-primary font-medium">{k.ctr}%</span></div>
                    <div><span className="text-muted-foreground">Conversão:</span> <span className="text-primary font-medium">{k.conv}%</span></div>
                    <div><span className="text-muted-foreground">Custo/Lead:</span> <span className="font-medium">R$ {k.cpl}</span></div>
                    <div><span className="text-muted-foreground">Custo/Venda:</span> <span className="font-medium">R$ {k.cps}</span></div>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignAnalysis;
