import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Mail, Megaphone, FileText, ChevronDown, Loader2, Copy, Save, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface FunnelStage {
  name: string;
  objective: string;
  content_type: string;
  content_format: string;
  message_goal: string;
  user_action: string;
}

interface EmailItem {
  subject: string;
  objective: string;
  summary: string;
}

interface AdItem {
  type: string;
  objective: string;
  idea: string;
}

interface GeneratedFunnel {
  stages: FunnelStage[];
  email_sequence: EmailItem[];
  ad_sequence: AdItem[];
}

const stageColors = [
  "from-primary/20 to-primary/5",
  "from-primary/30 to-primary/10",
  "from-primary/40 to-primary/15",
  "from-primary/55 to-primary/25",
  "from-primary/70 to-primary/40",
];

const stageWidths = ["w-full", "w-[90%]", "w-[78%]", "w-[64%]", "w-[50%]"];

const SalesFunnel = () => {
  const { user } = useAuth();
  const [productService, setProductService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [funnelType, setFunnelType] = useState("");
  const [funnel, setFunnel] = useState<GeneratedFunnel | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productService || !targetAudience || !campaignGoal || !funnelType) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    setFunnel(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-funnel", {
        body: { product_service: productService, target_audience: targetAudience, campaign_goal: campaignGoal, funnel_type: funnelType },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setFunnel(data.funnel);
      toast.success("Funil gerado com sucesso!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao gerar funil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !funnel) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("funnel_generations").insert({
        user_id: user.id,
        product_service: productService,
        funnel_type: funnelType,
        generated_funnel: funnel as any,
      });
      if (error) throw error;
      toast.success("Funil salvo no histórico!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar funil");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    toast.success("Copiado!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const copyStages = () => {
    if (!funnel) return;
    const text = funnel.stages.map((s, i) => `${i + 1}. ${s.name}\nObjetivo: ${s.objective}\nConteúdo: ${s.content_type} (${s.content_format})\nMensagem: ${s.message_goal}\nAção: ${s.user_action}`).join("\n\n");
    handleCopy(text, "stages");
  };

  const copyEmails = () => {
    if (!funnel) return;
    const text = funnel.email_sequence.map((e, i) => `E-mail ${i + 1}: ${e.subject}\nObjetivo: ${e.objective}\n${e.summary}`).join("\n\n");
    handleCopy(text, "emails");
  };

  const copyAds = () => {
    if (!funnel) return;
    const text = funnel.ad_sequence.map((a, i) => `Anúncio ${i + 1} (${a.type})\nObjetivo: ${a.objective}\nIdeia: ${a.idea}`).join("\n\n");
    handleCopy(text, "ads");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gere funis de vendas completos com IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Configuração do Funil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Produto ou Serviço</Label>
              <Input placeholder="Ex: Curso de Marketing Digital" value={productService} onChange={(e) => setProductService(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Público-Alvo</Label>
              <Input placeholder="Ex: Empreendedores digitais" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Objetivo da Campanha</Label>
              <Textarea placeholder="Ex: Vender 100 unidades no primeiro mês" value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Funil</Label>
              <Select value={funnelType} onValueChange={setFunnelType}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="captura_leads">Captura de Leads</SelectItem>
                  <SelectItem value="venda_direta">Venda Direta</SelectItem>
                  <SelectItem value="lancamento">Lançamento</SelectItem>
                  <SelectItem value="funil_conteudo">Funil de Conteúdo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Gerando...</> : <><GitBranch className="h-4 w-4 mr-2" /> Gerar Funil</>}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <Card className="glass-card">
              <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Gerando funil completo com IA...</p>
              </CardContent>
            </Card>
          )}

          {!loading && !funnel && (
            <Card className="glass-card">
              <CardContent className="p-8 text-center">
                <GitBranch className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Preencha os campos e clique em "Gerar Funil" para criar seu funil de vendas.</p>
              </CardContent>
            </Card>
          )}

          {funnel && (
            <>
              {/* Save button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} variant="outline">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar no Histórico
                </Button>
              </div>

              {/* Funnel stages visual */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Etapas do Funil</CardTitle>
                  <Button variant="ghost" size="sm" onClick={copyStages}>
                    {copiedSection === "stages" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    Copiar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 flex flex-col items-center">
                    {funnel.stages.map((stage, i) => (
                      <div key={i} className={`${stageWidths[i] || "w-full"} transition-all`}>
                        <div className={`rounded-lg overflow-hidden border border-border/50`}>
                          <div className={`bg-gradient-to-r ${stageColors[i] || stageColors[0]} px-4 py-2`}>
                            <p className="text-sm font-semibold">{stage.name}</p>
                          </div>
                          <div className="p-3 space-y-1">
                            <p className="text-xs"><span className="text-primary font-medium">Objetivo:</span> <span className="text-muted-foreground">{stage.objective}</span></p>
                            <p className="text-xs"><span className="text-primary font-medium">Conteúdo:</span> <span className="text-muted-foreground">{stage.content_type} ({stage.content_format})</span></p>
                            <p className="text-xs"><span className="text-primary font-medium">Mensagem:</span> <span className="text-muted-foreground">{stage.message_goal}</span></p>
                            <p className="text-xs"><span className="text-primary font-medium">Ação:</span> <span className="text-muted-foreground">{stage.user_action}</span></p>
                          </div>
                        </div>
                        {i < funnel.stages.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ChevronDown className="h-5 w-5 text-primary/50" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Email sequence */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" /> Sequência de E-mails</CardTitle>
                  <Button variant="ghost" size="sm" onClick={copyEmails}>
                    {copiedSection === "emails" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    Copiar
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {funnel.email_sequence.map((email, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-secondary/50">
                      <Badge variant="outline" className="shrink-0 mt-0.5">{i + 1}</Badge>
                      <div>
                        <p className="text-sm font-medium">{email.subject}</p>
                        <p className="text-xs text-primary">{email.objective}</p>
                        <p className="text-xs text-muted-foreground mt-1">{email.summary}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Ad sequence */}
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-4 w-4" /> Sequência de Anúncios</CardTitle>
                  <Button variant="ghost" size="sm" onClick={copyAds}>
                    {copiedSection === "ads" ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    Copiar
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {funnel.ad_sequence.map((ad, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-secondary/50">
                      <Badge className="shrink-0 mt-0.5">{ad.type}</Badge>
                      <div>
                        <p className="text-sm font-medium">{ad.objective}</p>
                        <p className="text-xs text-muted-foreground mt-1">{ad.idea}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesFunnel;
