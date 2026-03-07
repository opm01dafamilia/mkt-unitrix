import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Profile = () => {
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
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <Button variant="secondary" size="sm">Alterar foto</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <Input defaultValue="João Silva" className="mt-1.5" />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input defaultValue="joao@marketflow.com" className="mt-1.5" />
            </div>
            <div>
              <Label>Empresa</Label>
              <Input defaultValue="MarketFlow Inc." className="mt-1.5" />
            </div>
            <div>
              <Label>Cargo</Label>
              <Input defaultValue="Marketing Manager" className="mt-1.5" />
            </div>
          </div>
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
