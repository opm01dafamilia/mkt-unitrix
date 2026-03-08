import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Loader2, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [niche, setNiche] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || user?.email || "");
      setNiche(profile.niche || "");
      setBusinessType(profile.business_type || "");
      setMainGoal(profile.main_goal || "");
      setLoaded(true);
    } else if (user) {
      setEmail(user.email || "");
      setLoaded(true);
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          email,
          niche,
          business_type: businessType,
          main_goal: mainGoal,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Perfil atualizado com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie suas informações pessoais</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {initials || <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{fullName || "Seu nome"}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Nicho</Label>
              <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Marketing Digital" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Negócio</Label>
              <Input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Ex: SaaS, E-commerce" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Objetivo Principal</Label>
              <Input value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} placeholder="Ex: Escalar vendas online" />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
