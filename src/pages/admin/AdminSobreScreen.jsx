import { useEffect, useState } from "react";
import { BookOpen, Save } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import {
  buscarSobreAcademia,
  salvarSobreAcademia,
} from "../../services/sobreService";

export default function AdminSobreScreen({ goTo }) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const dados = await buscarSobreAcademia();
      setTitulo(dados.titulo || "");
      setTexto(dados.texto || "");
    } catch (error) {
      console.error("Erro ao carregar sobre a academia:", error);
      setErro("Erro ao carregar informações.");
    }
  }

  async function handleSalvar() {
    setMensagem("");
    setErro("");

    if (!titulo.trim() || !texto.trim()) {
      setErro("Preencha o título e o texto.");
      return;
    }

    try {
      setLoading(true);

      await salvarSobreAcademia({
        titulo: titulo.trim(),
        texto: texto.trim(),
      });

      setMensagem("Informações salvas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar sobre a academia:", error);
      setErro("Erro ao salvar informações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneFrame title="Editar Sobre a Academia" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-900" />
              Conteúdo da área "Sobre a academia"
            </div>

            <Input
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <textarea
              placeholder="Texto sobre a academia"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700 outline-none min-h-[180px]"
            />

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-red-600 font-medium">{erro}</div>
            ) : null}

            <Button
              className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white"
              onClick={handleSalvar}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar informações"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PhoneFrame>
  );
}