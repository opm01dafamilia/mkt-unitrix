import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  CheckCircle2,
  Clock,
  Crown,
  XCircle,
  UserX,
  AppWindow,
  DollarSign,
} from "lucide-react";

const ADMIN_EMAIL = "lp070087@gmail.com";

interface ProfileRow {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  onboarding_completed: boolean;
  created_at: string;
}

interface Metrics {
  total: number;
  active: number;
  trial: number;
  lifetime: number;
  cancelled: number;
  inactive: number;
  apps: number;
  revenue: number;
}

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    total: 0,
    active: 0,
    trial: 0,
    lifetime: 0,
    cancelled: 0,
    inactive: 0,
    apps: 6,
    revenue: 0,
  });
  const [fetching, setFetching] = useState(true);

  const isAdmin =
    !!profile?.is_admin || user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setFetching(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const rows = (data || []) as ProfileRow[];
      setProfiles(rows);

      const total = rows.length;
      const active = rows.filter((r) => r.onboarding_completed).length;
      const trial = rows.filter((r) => !r.onboarding_completed).length;
      const lifetime = rows.filter((r) => r.is_admin).length;
      setMetrics({
        total,
        active,
        trial,
        lifetime,
        cancelled: 0,
        inactive: total - active,
        apps: 6,
        revenue: active * 49,
      });
      setFetching(false);
    };
    load();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const cards = [
    { label: "Total de usuários", value: metrics.total, icon: Users },
    { label: "Assinaturas ativas", value: metrics.active, icon: CheckCircle2 },
    { label: "Em trial", value: metrics.trial, icon: Clock },
    { label: "Vitalícios", value: metrics.lifetime, icon: Crown },
    { label: "Cancelados", value: metrics.cancelled, icon: XCircle },
    { label: "Inativos", value: metrics.inactive, icon: UserX },
    { label: "Apps ativos", value: metrics.apps, icon: AppWindow },
    {
      label: "Receita estimada",
      value: `R$ ${metrics.revenue.toLocaleString("pt-BR")}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
        <p className="text-muted-foreground mt-1">
          Painel central de gerenciamento do sistema
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {c.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fetching ? "—" : c.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="apps">Aplicativos</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {fetching ? "Carregando..." : "Nenhum usuário encontrado"}
                      </TableCell>
                    </TableRow>
                  )}
                  {profiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.full_name || "—"}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>
                        <Badge variant={p.onboarding_completed ? "default" : "secondary"}>
                          {p.onboarding_completed ? "Ativo" : "Em trial"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {p.is_admin ? (
                          <Badge variant="default">Admin</Badge>
                        ) : (
                          <Badge variant="outline">Usuário</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apps" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aplicativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Gerenciamento de aplicativos em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Configuração de webhooks em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
