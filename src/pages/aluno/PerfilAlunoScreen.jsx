import { useState } from "react";
import {
  Star,
  ClipboardCheck,
  LogOut,
  Shield,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import AppLogo from "../../components/layout/AppLogo";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { logout, alterarSenha } from "../../services/authService";

export default function PerfilAlunoScreen({
  goTo,
  usuario,
  voltarProfessor,
}) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarAlterarSenha, setMostrarAlterarSenha] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const handleAlterarSenha = async () => {
    setMensagem("");
    setErro("");

    if (!novaSenha.trim() || !confirmarSenha.trim()) {
      setErro("Preencha os dois campos de senha.");
      return;
    }

    if (novaSenha.trim().length < 6) {
      setErro("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setLoadingSenha(true);

      await alterarSenha(novaSenha.trim());

      setMensagem("Senha alterada com sucesso.");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);

      if (error?.code === "auth/requires-recent-login") {
        setErro("Por segurança, faça login novamente antes de alterar a senha.");
      } else if (error?.code === "auth/weak-password") {
        setErro("A nova senha é muito fraca.");
      } else {
        setErro("Erro ao alterar senha.");
      }
    } finally {
      setLoadingSenha(false);
    }
  };

  const ehProfessor = usuario?.perfil === "professor";

  return (
    <PhoneFrame title="Perfil">
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <AppLogo size="large" />
            </div>

            <div className="text-xl font-bold">
              {usuario?.nome || "Aluno Exemplo"}
            </div>
            <div className="text-sm text-zinc-500">
              {usuario?.email || "aluno@anjos.com"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">E-mail</span>
              <span>{usuario?.email || "aluno@anjos.com"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Perfil</span>
              <span>{usuario?.perfil || "aluno"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Nome</span>
              <span>{usuario?.nome || "Aluno Exemplo"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <button
              type="button"
              onClick={() => setMostrarAlterarSenha(!mostrarAlterarSenha)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="font-semibold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-blue-900" />
                Alterar senha
              </div>

              {mostrarAlterarSenha ? (
                <ChevronUp className="h-5 w-5 text-zinc-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-zinc-500" />
              )}
            </button>

            {mostrarAlterarSenha ? (
              <div className="space-y-4">
                <Input
                  placeholder="Nova senha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />

                <Input
                  placeholder="Confirmar nova senha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                {mensagem ? (
                  <div className="text-sm text-green-600">{mensagem}</div>
                ) : null}

                {erro ? (
                  <div className="text-sm text-blue-900">{erro}</div>
                ) : null}

                <Button
                  onClick={handleAlterarSenha}
                  disabled={loadingSenha}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                >
                  {loadingSenha ? "Alterando..." : "Salvar nova senha"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {ehProfessor ? (
          <Card className="cursor-pointer" onClick={voltarProfessor}>
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="font-semibold">Voltar ao painel do professor</div>
                <div className="text-sm text-zinc-500">
                  Acessar área administrativa
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="cursor-pointer" onClick={() => goTo("chamada")}>
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-blue-900" />
            <div>
              <div className="font-semibold">Minha chamada</div>
              <div className="text-sm text-zinc-500">
                Ver presença e observações
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => goTo("sobre")}>
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-400" />
            <div>
              <div className="font-semibold">Sobre a academia</div>
              <div className="text-sm text-zinc-500">
                Informações e material da academia
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleLogout}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>

        <BottomNav current="perfil" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}