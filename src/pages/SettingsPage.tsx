import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Personalize sua experiência no MarketFlow</p>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Aparência</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
              <div>
                <p className="text-sm font-medium">Tema do Aplicativo</p>
                <p className="text-xs text-muted-foreground">
                  {theme === "dark" ? "Modo escuro ativado" : "Modo claro ativado"}
                </p>
              </div>
            </div>
            <Select value={theme} onValueChange={(v: "light" | "dark") => setTheme(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Notificações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Notificações por e-mail</p>
              <p className="text-xs text-muted-foreground">Receba atualizações sobre suas campanhas</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Relatórios semanais</p>
              <p className="text-xs text-muted-foreground">Resumo semanal de desempenho</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Alertas de performance</p>
              <p className="text-xs text-muted-foreground">Notificação quando uma campanha atinge meta</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Preferências</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Idioma</Label>
            <Select defaultValue="pt">
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fuso Horário</Label>
            <Select defaultValue="brt">
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brt">Brasília (GMT-3)</SelectItem>
                <SelectItem value="est">Eastern (GMT-5)</SelectItem>
                <SelectItem value="pst">Pacific (GMT-8)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Salvar Preferências</Button>
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/30">
        <CardHeader><CardTitle className="text-base text-destructive">Zona de Perigo</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Ações irreversíveis para sua conta</p>
          <Button variant="destructive" size="sm">Excluir Conta</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
