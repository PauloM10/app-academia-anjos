import { LogOut, Smartphone } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import AppLogo from "../../components/layout/AppLogo";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { logout } from "../../services/authService";
import { appConfig } from "../../config/appConfig";

export default function AdminDashboardScreen({ goTo, usuario, abrirAreaAluno }) {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <PhoneFrame title="Painel do Professor">
      <div className="p-4 space-y-4">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-blue-100">Área administrativa</div>
                <div className="text-xl font-bold mt-1">
                  {usuario?.nome || "Professor"} - {appConfig.nomeAcademia}
                </div>
              </div>

              <AppLogo size="small" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => goTo("admin_alunos")}>Lista de alunos</Button>
          <Button onClick={() => goTo("admin_cadastro")}>Cadastrar aluno</Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => goTo("admin_professores")}>Lista de professores</Button>
          <Button variant="outline" onClick={() => goTo("admin_cadastro_professor")}>
            Cadastrar professor
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => goTo("admin_treinos")}>Cadastrar treino</Button>
          <Button variant="outline" onClick={() => goTo("admin_chamada")}>
            Chamada
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => goTo("admin_loja")}>
            Loja
          </Button>
          <Button variant="outline" onClick={() => goTo("admin_fotos")}>
            Fotos
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" onClick={() => goTo("admin_avisos")}>
            Avisos
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" onClick={() => goTo("admin_sobre")}>
            Sobre a academia
          </Button>
        </div>

        <Button className="w-full h-11" onClick={abrirAreaAluno}>
          <Smartphone className="h-4 w-4 mr-2" />
          Ver área do aluno
        </Button>

        <Button variant="outline" className="w-full h-11" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </PhoneFrame>
  );
}