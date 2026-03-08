import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Copy, Sparkles, Save, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface CopyVariation {
  headline: string;
  body: string;
  arguments: string[];
  cta: string;
}

const CopyGenerator = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copies, setCopies] = useState<CopyVariation[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [productService, setProductService] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [salesGoal, setSalesGoal] = useState("");
  const [contentType, setContentType] = useState("");

  const handleGenerate = async () => {
    if (!productService || !targetAudience || !salesGoal || !contentType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setCopies([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-copy", {
        body: { product_service: productService, target_audience: targetAudience, sales_goal: salesGoal, content_type: contentType },
      });

      if (error) throw error;
      setCopies(data.copies);
      toast.success("Copies geradas com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao gerar copies: " + (err.message || "Tente novamente"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (copy: CopyVariation, index: number) => {
    const args = copy.arguments?.join("\n• ") || "";
    const text = `${copy.headline}\n\n${copy.body}\n\n• ${args}\n\n${copy.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copy copiada!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = async () => {
    if (!user || copies.length === 0) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("copy_generations").insert({
        user_id: user.id,
        product_service: productService,
        target_audience: targetAudience,
        sales_goal: salesGoal,
        content_type: contentType,
        generated_copy: copies as any,
      });

      if (error) throw error;
      toast.success("Copies salvas no histórico!");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Gerador de Copy</h1>
        <p className="text-muted-foreground text-sm mt-1">Crie textos de vendas persuasivos e otimizados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Configurações da Copy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Produto ou Serviço *</Label>
              <Input placeholder="Ex: MarketFlow - SaaS de Marketing" className="mt-1.5" value={productService} onChange={(e) => setProductService(e.target.value)} />
            </div>
            <div>
              <Label>Público Alvo *</Label>
              <Input placeholder="Ex: Empreendedores digitais" className="mt-1.5" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
            </div>
            <div>
              <Label>Objetivo da Venda *</Label>
              <Select value={salesGoal} onValueChange={setSalesGoal}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gerar Vendas">Gerar Vendas</SelectItem>
                  <SelectItem value="Capturar Leads">Capturar Leads</SelectItem>
                  <SelectItem value="Iniciar Trial">Iniciar Trial</SelectItem>
                  <SelectItem value="Download">Download</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Conteúdo *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anúncio">Anúncio</SelectItem>
                  <SelectItem value="Página de Vendas">Página de Vendas</SelectItem>
                  <SelectItem value="E-mail Marketing">E-mail Marketing</SelectItem>
                  <SelectItem value="Post para Redes Sociais">Post para Redes Sociais</SelectItem>
                  <SelectItem value="Roteiro de Vídeo">Roteiro de Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              {loading ? "Gerando..." : "Gerar Copy"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-12 w-12 mb-3 animate-spin text-primary" />
              <p className="text-sm">Gerando copies com IA...</p>
            </div>
          )}

          {!loading && copies.length > 0 && (
            <>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <Save className="h-3 w-3 mr-1.5" />}
                  Salvar no Histórico
                </Button>
              </div>
              {copies.map((copy, i) => (
                <Card key={i} className="glass-card glow-green animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Variação {i + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(copy, i)}>
                        {copiedIndex === i ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>

                    <div>
                      <p className="text-xs text-primary font-medium mb-1">HEADLINE</p>
                      <p className="font-bold text-base">{copy.headline}</p>
                    </div>

                    <div>
                      <p className="text-xs text-primary font-medium mb-1">TEXTO PRINCIPAL</p>
                      <p className="text-sm text-muted-foreground">{copy.body}</p>
                    </div>

                    {copy.arguments && copy.arguments.length > 0 && (
                      <div>
                        <p className="text-xs text-primary font-medium mb-1">ARGUMENTOS DE VENDA</p>
                        <ul className="space-y-1">
                          {copy.arguments.map((arg, j) => (
                            <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span> {arg}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-primary font-medium mb-1">CTA</p>
                      <Button size="sm" className="text-xs">{copy.cta}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {!loading && copies.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Preencha os campos e clique em gerar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopyGenerator;
