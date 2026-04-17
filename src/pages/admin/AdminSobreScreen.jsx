import { useEffect, useState } from "react";
import { BookOpen, Save } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { appConfig } from "../../config/appConfig";
import {
  buscarSobreAcademia,
  salvarSobreAcademia,
} from "../../services/sobreService";

export default function AdminSobreScreen({ goTo }) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [pdfTitulo, setPdfTitulo] = useState("");
  const [pdfUrl, setPdfUrl] = useState(appConfig.documentos.ebookPadrao);
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
      setPdfTitulo(dados.pdfTitulo || appConfig.textos.pdfTituloPadrao);
      setPdfUrl(dados.pdfUrl || appConfig.documentos.ebookPadrao);
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
        pdfTitulo: pdfTitulo.trim() || appConfig.textos.pdfTituloPadrao,
        pdfUrl: pdfUrl.trim() || appConfig.documentos.ebookPadrao,
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

            <Input
              placeholder="Texto do botão do PDF"
              value={pdfTitulo}
              onChange={(e) => setPdfTitulo(e.target.value)}
            />

            <Input
              placeholder="Link do PDF"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
            />

            <div className="text-xs text-zinc-500">
              Para usar o PDF padrão, deixa assim:
              <br />
              <span className="font-medium">{appConfig.documentos.ebookPadrao}</span>
            </div>

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-blue-900 font-medium">{erro}</div>
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