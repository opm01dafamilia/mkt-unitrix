import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  CheckCircle2,
  Clock,
  Crown,
  XCircle,
  UserX,
  DollarSign,
  ShieldCheck,
  MoreHorizontal,
} from "lucide-react";

const ADMIN_EMAIL = "lp070087@gmail.com";

type Plan = "mensal" | "anual" | "trial" | "vitalicio" | null;
type Status = "ativo" | "inativo";

interface ProfileRow {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  onboarding_completed: boolean;
  created_at: string;
  plan: Plan;
  status: Status;
  trial_ends_at: string | null;
}

interface Metrics {
  total: number;
  active: number;
  trial: number;
  lifetime: number;
  cancelled: number;
  inactive: number;
  revenue: number;
}

const planLabel = (p: Plan) => {
  switch (p) {
    case "mensal":
      return "Mensal";
    case "anual":
      return "Anual";
    case "trial":
      return "Trial";
    case "vitalicio":
      return "Vitalício";
    default:
      return "—";
  }
};

const planVariant = (p: Plan): "default" | "secondary" | "outline" => {
  if (p === "vitalicio") return "default";
  if (p === "trial") return "secondary";
  return "outline";
};

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
    revenue: 0,
  });
  const [fetching, setFetching] = useState(true);
  const [detailUser, setDetailUser] = useState<ProfileRow | null>(null);

  const isAdmin = !!profile?.is_admin || user?.email === ADMIN_EMAIL;

  const computeMetrics = (rows: ProfileRow[]) => {
    const total = rows.length;
    const active = rows.filter((r) => r.status === "ativo").length;
    const inactive = rows.filter((r) => r.status === "inativo").length;
    const trial = rows.filter((r) => r.plan === "trial").length;
    const lifetime = rows.filter((r) => r.plan === "vitalicio").length;
    const monthly = rows.filter((r) => r.plan === "mensal" && r.status === "ativo").length;
    const annual = rows.filter((r) => r.plan === "anual" && r.status === "ativo").length;
    const revenue = monthly * 49 + annual * (490 / 12);
    setMetrics({
      total,
      active,
      trial,
      lifetime,
      cancelled: inactive,
      inactive,
      revenue: Math.round(revenue),
    });
  };

  const load = useCallback(async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar usuários");
      setFetching(false);
      return;
    }
    const rows = (data || []) as ProfileRow[];
    setProfiles(rows);
    computeMetrics(rows);
    setFetching(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    load();
  }, [isAdmin, load]);

  const updateProfile = async (
    userRow: ProfileRow,
    patch: Partial<ProfileRow>,
    successMsg: string
  ) => {
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userRow.id);
    if (error) {
      toast.error("Erro ao atualizar usuário");
      return;
    }
    toast.success(successMsg);
    load();
  };

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
    { label: "Ativos", value: metrics.active, icon: CheckCircle2 },
    { label: "Em trial", value: metrics.trial, icon: Clock },
    { label: "Vitalícios", value: metrics.lifetime, icon: Crown },
    { label: "Cancelados", value: metrics.cancelled, icon: XCircle },
    { label: "Inativos", value: metrics.inactive, icon: UserX },
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
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          {fetching ? "Carregando..." : "Nenhum usuário encontrado"}
                        </TableCell>
                      </TableRow>
                    )}
                    {profiles.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{p.email}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === "ativo" ? "default" : "secondary"}>
                            {p.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={planVariant(p.plan)}>{planLabel(p.plan)}</Badge>
                        </TableCell>
                        <TableCell>
                          {p.is_admin ? (
                            <Badge variant="default" className="gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline">Normal</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => setDetailUser(p)}>
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {p.is_admin ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateProfile(p, { is_admin: false }, "Admin removido")
                                  }
                                  disabled={p.email === ADMIN_EMAIL}
                                >
                                  Remover Admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateProfile(p, { is_admin: true }, "Tornado Admin")
                                  }
                                >
                                  Tornar Admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  const ends = new Date();
                                  ends.setDate(ends.getDate() + 7);
                                  updateProfile(
                                    p,
                                    {
                                      plan: "trial",
                                      status: "ativo",
                                      trial_ends_at: ends.toISOString(),
                                    },
                                    "Teste gratuito liberado (7 dias)"
                                  );
                                }}
                              >
                                Liberar Teste Gratuito
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  updateProfile(
                                    p,
                                    {
                                      plan: "vitalicio",
                                      status: "ativo",
                                      trial_ends_at: null,
                                    },
                                    "Acesso vitalício liberado"
                                  )
                                }
                              >
                                Liberar Acesso Vitalício
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  updateProfile(
                                    p,
                                    { status: "inativo" },
                                    "Acesso cancelado"
                                  )
                                }
                              >
                                Cancelar Acesso
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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

      <Dialog open={!!detailUser} onOpenChange={(o) => !o && setDetailUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do usuário</DialogTitle>
          </DialogHeader>
          {detailUser && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Nome</span>
                <span className="col-span-2 font-medium">{detailUser.full_name || "—"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Email</span>
                <span className="col-span-2 font-medium">{detailUser.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Status</span>
                <span className="col-span-2">
                  <Badge variant={detailUser.status === "ativo" ? "default" : "secondary"}>
                    {detailUser.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Plano</span>
                <span className="col-span-2">
                  <Badge variant={planVariant(detailUser.plan)}>
                    {planLabel(detailUser.plan)}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Tipo</span>
                <span className="col-span-2">
                  {detailUser.is_admin ? "Admin" : "Normal"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Cadastro</span>
                <span className="col-span-2">
                  {new Date(detailUser.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
              {detailUser.trial_ends_at && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Trial até</span>
                  <span className="col-span-2">
                    {new Date(detailUser.trial_ends_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Onboarding</span>
                <span className="col-span-2">
                  {detailUser.onboarding_completed ? "Concluído" : "Pendente"}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
