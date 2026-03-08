import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, FileText, GitBranch, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const performanceData = [
  { name: "Jan", impressoes: 4000, cliques: 2400, conversoes: 400 },
  { name: "Fev", impressoes: 3000, cliques: 1398, conversoes: 210 },
  { name: "Mar", impressoes: 5000, cliques: 3800, conversoes: 590 },
  { name: "Abr", impressoes: 4780, cliques: 3908, conversoes: 480 },
  { name: "Mai", impressoes: 5890, cliques: 4800, conversoes: 680 },
  { name: "Jun", impressoes: 6390, cliques: 5800, conversoes: 830 },
];

const campaignData = [
  { name: "Facebook", valor: 4500 },
  { name: "Instagram", valor: 3200 },
  { name: "Google", valor: 5800 },
  { name: "TikTok", valor: 2100 },
  { name: "LinkedIn", valor: 1800 },
];

interface RecentItem {
  action: string;
  detail: string;
  time: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [adCount, setAdCount] = useState(0);
  const [copyCount, setCopyCount] = useState(0);
  const [funnelCount, setFunnelCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<RecentItem[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const [adsRes, copiesRes, funnelsRes] = await Promise.all([
        supabase.from("ad_generations").select("id, product_service, created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("copy_generations").select("id, product_service, created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("funnel_generations").select("id, product_service, created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);

      setAdCount(adsRes.count || 0);
      setCopyCount(copiesRes.count || 0);

      // Build recent activity from real data
      const activity: RecentItem[] = [];
      const now = Date.now();
      const timeAgo = (date: string) => {
        const diff = now - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} min atrás`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h atrás`;
        return `${Math.floor(hours / 24)}d atrás`;
      };

      (adsRes.data || []).forEach((ad) => {
        activity.push({ action: "Anúncio gerado", detail: ad.product_service, time: timeAgo(ad.created_at) });
      });
      (copiesRes.data || []).forEach((copy) => {
        activity.push({ action: "Copy gerada", detail: copy.product_service, time: timeAgo(copy.created_at) });
      });

      // Sort by most recent (approximate via time string, but we can sort by original)
      activity.sort((a, b) => {
        const extractMins = (t: string) => {
          const num = parseInt(t);
          if (t.includes("min")) return num;
          if (t.includes("h")) return num * 60;
          if (t.includes("d")) return num * 1440;
          return 9999;
        };
        return extractMins(a.time) - extractMins(b.time);
      });

      setRecentActivity(activity.slice(0, 5));
    };
    fetchCounts();
  }, [user]);

  const stats = [
    { title: "Campanhas Criadas", value: "0", change: "--", up: true, icon: TrendingUp },
    { title: "Anúncios Gerados", value: String(adCount), change: adCount > 0 ? `${adCount}` : "--", up: adCount > 0, icon: Megaphone },
    { title: "Funis Criados", value: "0", change: "--", up: true, icon: GitBranch },
    { title: "Copies Geradas", value: String(copyCount), change: copyCount > 0 ? `${copyCount}` : "--", up: copyCount > 0, icon: FileText },
  ];

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
                <span className={`text-xs font-medium flex items-center gap-1 ${stat.up ? "text-primary" : "text-muted-foreground"}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Desempenho Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorConversoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 22%, 9%)",
                    border: "1px solid hsl(220, 20%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(220, 10%, 92%)",
                  }}
                />
                <Area type="monotone" dataKey="impressoes" stroke="hsl(220, 10%, 55%)" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="cliques" stroke="hsl(200, 60%, 50%)" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="conversoes" stroke="hsl(152, 60%, 42%)" fill="url(#colorConversoes)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Investimento por Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={campaignData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                <XAxis type="number" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 55%)" fontSize={12} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 22%, 9%)",
                    border: "1px solid hsl(220, 20%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(220, 10%, 92%)",
                  }}
                />
                <Bar dataKey="valor" fill="hsl(152, 60%, 42%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade recente. Comece gerando anúncios ou copies!</p>
            ) : (
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
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
