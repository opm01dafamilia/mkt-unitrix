import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

const kpis = [
  { title: "Taxa de Conversão", value: "4.8%", change: "+0.6%", icon: Target },
  { title: "Custo por Lead", value: "R$ 12,50", change: "-8%", icon: DollarSign },
  { title: "Total de Leads", value: "1.284", change: "+23%", icon: Users },
  { title: "ROI", value: "320%", change: "+15%", icon: TrendingUp },
];

const conversionData = [
  { name: "Sem 1", taxa: 3.2 },
  { name: "Sem 2", taxa: 3.8 },
  { name: "Sem 3", taxa: 4.1 },
  { name: "Sem 4", taxa: 4.5 },
  { name: "Sem 5", taxa: 4.2 },
  { name: "Sem 6", taxa: 4.8 },
  { name: "Sem 7", taxa: 5.1 },
  { name: "Sem 8", taxa: 4.9 },
];

const costData = [
  { name: "Jan", custo: 18 },
  { name: "Fev", custo: 16 },
  { name: "Mar", custo: 15 },
  { name: "Abr", custo: 14 },
  { name: "Mai", custo: 13 },
  { name: "Jun", custo: 12.5 },
];

const channelData = [
  { name: "Facebook", value: 35 },
  { name: "Google", value: 30 },
  { name: "Instagram", value: 20 },
  { name: "Orgânico", value: 15 },
];

const COLORS = ["hsl(152, 60%, 42%)", "hsl(200, 60%, 50%)", "hsl(280, 60%, 50%)", "hsl(40, 60%, 50%)"];

const tooltipStyle = {
  backgroundColor: "hsl(220, 22%, 9%)",
  border: "1px solid hsl(220, 20%, 16%)",
  borderRadius: "8px",
  color: "hsl(220, 10%, 92%)",
};

const CampaignAnalysis = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Análise de Campanhas</h1>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe o desempenho das suas campanhas</p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="glass-card">
            <CardContent className="p-5">
              <kpi.icon className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{kpi.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{kpi.title}</p>
                <span className="text-xs text-primary font-medium">{kpi.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Taxa de Conversão</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="taxa" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ fill: "hsl(152, 60%, 42%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-base">Custo por Lead (R$)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={costData}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="custo" stroke="hsl(152, 60%, 42%)" fill="url(#costGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Resultados por Canal</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {channelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAnalysis;
