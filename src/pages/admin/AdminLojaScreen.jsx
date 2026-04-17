import { useEffect, useRef, useState } from "react";
import { Package } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { appConfig } from "../../config/appConfig";
import {
  cadastrarProduto,
  listarProdutos,
  atualizarProduto,
  excluirProduto,
} from "../../services/produtoService";

export default function AdminLojaScreen({ goTo }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linkWhatsapp, setLinkWhatsapp] = useState("");
  const [imagem, setImagem] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editLinkWhatsapp, setEditLinkWhatsapp] = useState("");
  const [editImagem, setEditImagem] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const areaEdicaoRef = useRef(null);
  const cardSelecionadoRef = useRef(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    function handleCliqueFora(event) {
      if (!produtoSelecionado) return;

      const clicouNaAreaEdicao =
        areaEdicaoRef.current &&
        areaEdicaoRef.current.contains(event.target);

      const clicouNoCardSelecionado =
        cardSelecionadoRef.current &&
        cardSelecionadoRef.current.contains(event.target);

      if (!clicouNaAreaEdicao && !clicouNoCardSelecionado) {
        limparEdicao();
      }
    }

    document.addEventListener("mousedown", handleCliqueFora);
    return () =>
      document.removeEventListener("mousedown", handleCliqueFora);
  }, [produtoSelecionado]);

  async function carregarProdutos() {
    try {
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar produtos.");
    }
  }

  function limparFormulario() {
    setNome("");
    setPreco("");
    setDescricao("");
    setLinkWhatsapp("");
    setImagem(null);
  }

  function limparEdicao() {
    setProdutoSelecionado(null);
    setEditNome("");
    setEditPreco("");
    setEditDescricao("");
    setEditLinkWhatsapp("");
    setEditImagem(null);
  }

  async function enviarImagem(arquivo) {
    if (!arquivo) return "";

    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", appConfig.cloudinary.pastaProdutos);

    const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Erro ao enviar imagem");
    }

    return data.secure_url;
  }

  async function handleCadastrar() {
    setMensagem("");
    setErro("");

    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }

    try {
      setLoading(true);

      const imagemUrl = await enviarImagem(imagem);

      await cadastrarProduto({
        nome,
        preco,
        descricao,
        linkWhatsapp,
        imagemUrl,
      });

      setMensagem("Produto cadastrado!");
      limparFormulario();
      await carregarProdutos();
    } catch (error) {
      console.error(error);
      setErro("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  }

  function selecionar(produto) {
    setProdutoSelecionado(produto);
    setEditNome(produto.nome || "");
    setEditPreco(produto.preco || "");
    setEditDescricao(produto.descricao || "");
    setEditLinkWhatsapp(produto.linkWhatsapp || "");
    setMensagem("");
    setErro("");
  }

  async function salvarEdicao() {
    if (!produtoSelecionado) return;

    try {
      const imagemUrl = editImagem
        ? await enviarImagem(editImagem)
        : produtoSelecionado.imagemUrl;

      await atualizarProduto(produtoSelecionado.id, {
        nome: editNome,
        preco: editPreco,
        descricao: editDescricao,
        linkWhatsapp: editLinkWhatsapp,
        imagemUrl,
      });

      setMensagem("Atualizado!");
      limparEdicao();
      await carregarProdutos();
    } catch (error) {
      console.error(error);
      setErro("Erro ao atualizar.");
    }
  }

  async function deletar() {
    if (!produtoSelecionado) return;

    await excluirProduto(produtoSelecionado.id);
    limparEdicao();
    await carregarProdutos();
  }

  return (
    <PhoneFrame title="Gerenciar Loja" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">

        {/* CADASTRO */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-900" />
              Cadastro de produto
            </div>

            <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <Input placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} />
            <Input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            <Input placeholder="WhatsApp" value={linkWhatsapp} onChange={(e) => setLinkWhatsapp(e.target.value)} />

            <input type="file" onChange={(e) => setImagem(e.target.files[0])} />

            <Button
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              onClick={handleCadastrar}
              disabled={loading}
            >
              Cadastrar produto
            </Button>

            {mensagem && <div className="text-green-600 text-sm">{mensagem}</div>}
            {erro && <div className="text-blue-900 text-sm">{erro}</div>}
          </CardContent>
        </Card>

        {/* LISTA */}
        {produtos.map((produto) => (
          <Card
            key={produto.id}
            onClick={() => selecionar(produto)}
            className={`cursor-pointer ${
              produtoSelecionado?.id === produto.id
                ? "ring-2 ring-yellow-400"
                : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="font-semibold">{produto.nome}</div>
              <div className="text-sm text-zinc-500">{produto.preco}</div>
            </CardContent>
          </Card>
        ))}

        {/* EDIÇÃO */}
        {produtoSelecionado && (
          <div ref={areaEdicaoRef}>
            <Card className="border-2 border-yellow-300">
              <CardContent className="p-4 space-y-3">
                <div className="font-semibold text-blue-900">Editar produto</div>

                <Input value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                <Input value={editPreco} onChange={(e) => setEditPreco(e.target.value)} />
                <Input value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} />
                <Input value={editLinkWhatsapp} onChange={(e) => setEditLinkWhatsapp(e.target.value)} />

                <input type="file" onChange={(e) => setEditImagem(e.target.files[0])} />

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-blue-900 text-white"
                    onClick={salvarEdicao}
                  >
                    Salvar
                  </Button>

                  <Button variant="outline" onClick={deletar}>
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </PhoneFrame>
  );
}