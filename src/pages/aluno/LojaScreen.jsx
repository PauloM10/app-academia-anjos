import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Browser } from "@capacitor/browser";
import { AppLauncher } from "@capacitor/app-launcher";

import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

import { listarProdutos } from "../../services/produtoService";

function normalizarWhatsAppUrl(linkWhatsapp) {
  const valor = (linkWhatsapp || "").trim();

  if (!valor) {
    return {
      webUrl: "https://wa.me/",
      appUrl: "https://wa.me/",
    };
  }

  if (valor.startsWith("http://") || valor.startsWith("https://")) {
    return {
      webUrl: valor,
      appUrl: valor,
    };
  }

  let numero = valor.replace(/\D/g, "");

  if (!numero.startsWith("55")) {
    numero = `55${numero}`;
  }

  return {
    webUrl: `https://wa.me/${numero}`,
    appUrl: `https://wa.me/${numero}`,
  };
}

export default function LojaScreen({ goTo }) {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      setErro("");
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setErro("Erro ao carregar produtos.");
    }
  }

  async function abrirWhatsApp(linkWhatsapp, produtoNome) {
    try {
      const { webUrl, appUrl } = normalizarWhatsAppUrl(linkWhatsapp);

      const mensagem = `Olá, tenho interesse no produto: ${produtoNome}`;
      const mensagemCodificada = encodeURIComponent(mensagem);

      const urlFinal = `${webUrl}?text=${mensagemCodificada}`;
      const appUrlFinal = `${appUrl}?text=${mensagemCodificada}`;

      const resultado = await AppLauncher.canOpenUrl({ url: appUrl });

      if (resultado.value) {
        await AppLauncher.openUrl({ url: appUrlFinal });
      } else {
        await Browser.open({ url: urlFinal });
      }
    } catch (error) {
      console.error("Erro ao abrir WhatsApp:", error);
    }
  }

  return (
    <PhoneFrame title="Loja" showBack onBack={() => goTo("home")}>
      <div className="p-4 space-y-4">

        {erro && (
          <Card>
            <CardContent className="p-4 text-sm text-blue-900">
              {erro}
            </CardContent>
          </Card>
        )}

        {produtos.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-zinc-500">
              Nenhum produto cadastrado no momento.
            </CardContent>
          </Card>
        ) : (
          produtos.map((produto) => (
            <Card key={produto.id} className="overflow-hidden">

              {/* IMAGEM */}
              <div className="h-40 bg-zinc-100 flex items-center justify-center overflow-hidden">
                {produto.imagemUrl ? (
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-zinc-400 text-sm">Sem imagem</span>
                )}
              </div>

              <CardContent className="p-4 space-y-2">

                <div className="font-semibold text-blue-900">
                  {produto.nome}
                </div>

                {produto.preco && (
                  <div className="text-sm text-yellow-500 font-semibold">
                    {produto.preco}
                  </div>
                )}

                {produto.descricao && (
                  <div className="text-sm text-zinc-600">
                    {produto.descricao}
                  </div>
                )}

                <Button
                  onClick={() =>
                    abrirWhatsApp(produto.linkWhatsapp, produto.nome)
                  }
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comprar pelo WhatsApp
                </Button>

              </CardContent>
            </Card>
          ))
        )}

        <BottomNav current="loja" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}