import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, FileText, GitBranch, TrendingUp, ArrowUpRight, BarChart3, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RecentItem {
  action: string;
  detail: string;
  time: string;
  rawDate: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [adCount, setAdCount] = useState(0);
  const [copyCount, setCopyCount] = useState(0);
  const [funnelCount, setFunnelCount] = useState(0);
  const [campaignCount, setCampaignCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Build real chart data from campaigns
  const [platformChartData, setPlatformChartData] = useState<{ name: string; valor: number }[]>([]);
  const [campaignChartData, setCampaignChartData] = useState<{ name: string; leads: number; vendas: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const [adsRes, copiesRes, funnelsRes, campaignsRes] = await Promise.all([
        supabase.from("ad_generations").select("id, product_service, created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("copy_generations").select("id, product_service, created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("funnel_generations").select("id, product_service, created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("campaign_analysis").select("id, campaign_name, platform, leads, sales, ad_cost, created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      setAdCount(adsRes.count || 0);
      setCopyCount(copiesRes.count || 0);
      setFunnelCount(funnelsRes.count || 0);
      setCampaignCount(campaignsRes.count || 0);

      // Build platform chart from real campaigns
      const campaigns = (campaignsRes.data || []) as any[];
      const platformMap: Record<string, number> = {};
      campaigns.forEach((c: any) => {
        const p = c.platform || "Outro";
        platformMap[p] = (platformMap[p] || 0) + Number(c.ad_cost || 0);
      });
      setPlatformChartData(Object.entries(platformMap).map(([name, valor]) => ({ name, valor: Number(valor.toFixed(2)) })));

      // Campaign comparison chart (top 6)
      setCampaignChartData(campaigns.slice(0, 6).map((c: any) => ({
        name: c.campaign_name?.length > 12 ? c.campaign_name.slice(0, 12) + "…" : c.campaign_name || "—",
        leads: c.leads || 0,
        vendas: c.sales || 0,
      })));

      // Build recent activity
      const now = Date.now();
      const timeAgo = (date: string) => {
        const diff = now - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} min atrás`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h atrás`;
        return `${Math.floor(hours / 24)}d atrás`;
      };

      const activity: RecentItem[] = [];
      (adsRes.data || []).forEach((ad) => {
        activity.push({ action: "Anúncio gerado", detail: ad.product_service, time: timeAgo(ad.created_at), rawDate: new Date(ad.created_at).getTime() });
      });
      (copiesRes.data || []).forEach((copy) => {
        activity.push({ action: "Copy gerada", detail: copy.product_service, time: timeAgo(copy.created_at), rawDate: new Date(copy.created_at).getTime() });
      });
      (funnelsRes.data || []).forEach((f) => {
        activity.push({ action: "Funil criado", detail: f.product_service, time: timeAgo(f.created_at), rawDate: new Date(f.created_at).getTime() });
      });
      campaigns.slice(0, 5).forEach((c: any) => {
        activity.push({ action: "Campanha registrada", detail: c.campaign_name, time: timeAgo(c.created_at), rawDate: new Date(c.created_at).getTime() });
      });

      activity.sort((a, b) => b.rawDate - a.rawDate);
      setRecentActivity(activity.slice(0, 8));
      setLoading(false);
    };
    fetchCounts();
  }, [user]);

  const stats = [
    { title: "Campanhas Criadas", value: String(campaignCount), icon: BarChart3 },
    { title: "Anúncios Gerados", value: String(adCount), icon: Megaphone },
    { title: "Funis Criados", value: String(funnelCount), icon: GitBranch },
    { title: "Copies Geradas", value: String(copyCount), icon: FileText },
  ];

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    color: "hsl(var(--foreground))",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral das suas atividades de marketing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card glow-green">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-primary" />
                {Number(stat.value) > 0 && (
                  <span className="text-xs font-medium flex items-center gap-1 text-primary">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.value}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts - show real data or placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Comparação de Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            {campaignChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={campaignChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="leads" fill="hsl(200, 60%, 50%)" radius={[4, 4, 0, 0]} name="Leads" />
                  <Bar dataKey="vendas" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <TrendingUp className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Registre campanhas para ver o comparativo</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Investimento por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            {platformChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={platformChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="valor" fill="hsl(152, 60%, 42%)" radius={[0, 4, 4, 0]} name="Investimento" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <BarChart3 className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Registre campanhas para ver investimentos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhuma atividade recente. Comece gerando anúncios, copies ou funis!</p>
            ) : (
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
