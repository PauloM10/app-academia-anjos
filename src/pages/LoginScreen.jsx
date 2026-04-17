import { useState } from "react";
import PhoneFrame from "../components/layout/PhoneFrame";
import AppLogo from "../components/layout/AppLogo";
import { appConfig } from "../config/appConfig";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";

import { login } from "../services/authService";
import { buscarUsuarioPorUid } from "../services/userService";

export default function LoginScreen({ onEnter, perfil, setPerfil, goTo }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleEnter = async () => {
    setErro("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await login(email, senha);
      const user = userCredential.user;

      const dadosUsuario = await buscarUsuarioPorUid(user.uid);

      onEnter({
        uid: user.uid,
        email: user.email,
        perfil: dadosUsuario.perfil,
        nome: dadosUsuario.nome || "",
      });
    } catch (error) {
      console.error(error);
      setErro("E-mail ou senha inválidos, ou usuário não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneFrame title="Login">
      <div className="p-6">

        {/* CARD SUPERIOR */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white p-6 shadow-xl">
          <div className="flex justify-center mb-4">
            <AppLogo size="large" />
          </div>

          <Badge className="bg-yellow-400 text-blue-900 border-0 mb-3">
            Login real
          </Badge>

          <h1 className="text-2xl font-bold">
            {appConfig.nomeAcademia}
          </h1>

          <p className="text-sm text-blue-100 mt-2">
            {appConfig.textos.descricaoLogin}
          </p>
        </div>

        {/* FORM */}
        <Card className="mt-6 rounded-3xl border-0 shadow-md">
          <CardContent className="space-y-4 p-5">

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`rounded-2xl py-2 text-sm font-medium ${
                  perfil === "aluno"
                    ? "bg-blue-900 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
                onClick={() => setPerfil("aluno")}
              >
                Perfil Aluno
              </button>

              <button
                type="button"
                className={`rounded-2xl py-2 text-sm font-medium ${
                  perfil === "professor"
                    ? "bg-blue-900 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
                onClick={() => setPerfil("professor")}
              >
                Perfil Professor
              </button>
            </div>

            <Input
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && (
              <div className="text-sm text-blue-900">{erro}</div>
            )}

            <Button
              onClick={handleEnter}
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
            >
              {loading ? "Entrando..." : "Acessar aplicativo"}
            </Button>

            <div
              className="text-center text-sm text-blue-900 cursor-pointer"
              onClick={() => goTo("esqueci_senha")}
            >
              Esqueci minha senha
            </div>

          </CardContent>
        </Card>

      </div>
    </PhoneFrame>
  );
}