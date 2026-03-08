import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Copy, Sparkles, Save, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Ad {
  headline: string;
  body: string;
  cta: string;
}

const AdGenerator = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [productService, setProductService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [platform, setPlatform] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleGenerate = async () => {
    if (!productService || !targetAudience || !campaignGoal || !platform) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setAds([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-ads", {
        body: {
          product_service: productService,
          target_audience: targetAudience,
          campaign_goal: campaignGoal,
          platform,
          additional_info: additionalInfo,
        },
      });

      if (error) throw error;
      setAds(data.ads);
      toast.success("Anúncios gerados com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao gerar anúncios: " + (err.message || "Tente novamente"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (ad: Ad, index: number) => {
    const text = `${ad.headline}\n\n${ad.body}\n\n${ad.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Anúncio copiado!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = async () => {
    if (!user || ads.length === 0) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("ad_generations").insert({
        user_id: user.id,
        product_service: productService,
        target_audience: targetAudience,
        campaign_goal: campaignGoal,
        platform,
        generated_ads: ads as any,
      });

      if (error) throw error;
      toast.success("Anúncios salvos no histórico!");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Gerador de Anúncios</h1>
        <p className="text-muted-foreground text-sm mt-1">Crie anúncios otimizados para qualquer plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Configurações do Anúncio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Produto ou Serviço *</Label>
              <Input placeholder="Ex: Plataforma SaaS de marketing" className="mt-1.5" value={productService} onChange={(e) => setProductService(e.target.value)} />
            </div>
            <div>
              <Label>Público Alvo *</Label>
              <Input placeholder="Ex: Empreendedores digitais, 25-45 anos" className="mt-1.5" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
            </div>
            <div>
              <Label>Objetivo da Campanha *</Label>
              <Select value={campaignGoal} onValueChange={setCampaignGoal}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversao">Conversão</SelectItem>
                  <SelectItem value="trafego">Tráfego</SelectItem>
                  <SelectItem value="engajamento">Engajamento</SelectItem>
                  <SelectItem value="branding">Branding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Plataforma *</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Informações Adicionais</Label>
              <Textarea placeholder="Descreva detalhes extras sobre o produto..." className="mt-1.5" rows={3} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Megaphone className="h-4 w-4 mr-2" />}
              {loading ? "Gerando..." : "Gerar Anúncios"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-12 w-12 mb-3 animate-spin text-primary" />
              <p className="text-sm">Gerando anúncios com IA...</p>
            </div>
          )}

          {!loading && ads.length > 0 && (
            <>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <Save className="h-3 w-3 mr-1.5" />}
                  Salvar no Histórico
                </Button>
              </div>
              {ads.map((ad, i) => (
                <Card key={i} className="glass-card glow-green animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{platform}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(ad, i)}>
                        {copiedIndex === i ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{ad.headline}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{ad.body}</p>
                    <Button size="sm" className="text-xs">{ad.cta}</Button>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {!loading && ads.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Megaphone className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Preencha os campos e clique em gerar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdGenerator;
