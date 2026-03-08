import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const niches = [
  "E-commerce",
  "Serviços locais",
  "Infoprodutos",
  "SaaS",
  "Consultoria",
  "Agência de marketing",
  "Saúde e bem-estar",
  "Educação",
  "Outro",
];

const businessTypes = [
  "Pessoa física (MEI/Autônomo)",
  "Pequena empresa",
  "Média empresa",
  "Grande empresa",
  "Startup",
];

const goals = [
  "Vender mais",
  "Gerar mais leads",
  "Aumentar tráfego",
  "Construir marca",
  "Engajar audiência",
  "Lançar produto",
];

const Onboarding = () => {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [niche, setNiche] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: "Como podemos te chamar?", desc: "Seu nome será usado no app" },
    { title: "Qual seu nicho de atuação?", desc: "Isso nos ajuda a personalizar sugestões" },
    { title: "Tipo de negócio", desc: "Selecione o que mais se encaixa" },
    { title: "Seu principal objetivo", desc: "O que você quer alcançar com marketing digital?" },
  ];

  const canAdvance = () => {
    if (step === 0) return fullName.trim().length > 0;
    if (step === 1) return niche.length > 0;
    if (step === 2) return businessType.length > 0;
    if (step === 3) return mainGoal.length > 0;
    return false;
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        niche,
        business_type: businessType,
        main_goal: mainGoal,
        onboarding_completed: true,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Erro ao salvar perfil");
    } else {
      await refreshProfile();
      toast.success("Bem-vindo ao MarketFlow!");
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-foreground tracking-tight">MarketFlow</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-12 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{steps[step].title}</CardTitle>
            <CardDescription>{steps[step].desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <div>
                <Label>Nome completo</Label>
                <Input
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-2">
                {niches.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      niche === n
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {niche === n && <Check className="h-3 w-3 inline mr-1" />}
                    {n}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                {businessTypes.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBusinessType(b)}
                    className={`w-full p-3 rounded-lg border text-sm text-left transition-colors ${
                      businessType === b
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {businessType === b && <Check className="h-3 w-3 inline mr-1" />}
                    {b}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-2">
                {goals.map((g) => (
                  <button
                    key={g}
                    onClick={() => setMainGoal(g)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      mainGoal === g
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {mainGoal === g && <Check className="h-3 w-3 inline mr-1" />}
                    {g}
                  </button>
                ))}
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleNext}
              disabled={!canAdvance() || loading}
            >
              {loading ? "Salvando..." : step < 3 ? (
                <>Próximo <ArrowRight className="h-4 w-4 ml-1" /></>
              ) : (
                <>Começar a usar <ArrowRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
              >
                Voltar
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
