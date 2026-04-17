import { useEffect, useState } from "react";
import { Video, Settings2 } from "lucide-react";
import PhoneFrame from "../../components/layout/PhoneFrame";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
  cadastrarVideo,
  listarVideos,
  atualizarVideo,
  excluirVideo,
  buscarCategoriasVideos,
  salvarCategoriasVideos,
} from "../../services/videoService";

export default function AdminVideosScreen({ goTo }) {
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  const [videos, setVideos] = useState([]);
  const [videoSelecionado, setVideoSelecionado] = useState(null);

  const [editTitulo, setEditTitulo] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editCategoria, setEditCategoria] = useState("");

  const [categorias, setCategorias] = useState([
    "Categoria 1",
    "Categoria 2",
    "Categoria 3",
    "Categoria 4",
    "Categoria 5",
  ]);

  const [editCategorias, setEditCategorias] = useState([
    "Categoria 1",
    "Categoria 2",
    "Categoria 3",
    "Categoria 4",
    "Categoria 5",
  ]);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    try {
      const [dadosVideos, dadosCategorias] = await Promise.all([
        listarVideos(),
        buscarCategoriasVideos(),
      ]);

      setVideos(dadosVideos);
      setCategorias(dadosCategorias);
      setEditCategorias(dadosCategorias);

      if (!categoria && dadosCategorias[0]) {
        setCategoria(dadosCategorias[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setErro("Erro ao carregar vídeos.");
    }
  }

  function alterarCategoriaConfig(index, valor) {
    const novas = [...editCategorias];
    novas[index] = valor;
    setEditCategorias(novas);
  }

  async function handleSalvarCategorias() {
    setMensagem("");
    setErro("");

    try {
      await salvarCategoriasVideos(editCategorias);

      const categoriasAtualizadas = await buscarCategoriasVideos();
      setCategorias(categoriasAtualizadas);
      setEditCategorias(categoriasAtualizadas);

      if (!categoriasAtualizadas.includes(categoria)) {
        setCategoria(categoriasAtualizadas[0] || "");
      }

      if (videoSelecionado && !categoriasAtualizadas.includes(editCategoria)) {
        setEditCategoria(categoriasAtualizadas[0] || "");
      }

      setMensagem("Categorias salvas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar categorias:", error);
      setErro("Erro ao salvar categorias.");
    }
  }

  async function handleCadastrar() {
    setMensagem("");
    setErro("");

    if (!titulo.trim() || !link.trim()) {
      setErro("Preencha título e link.");
      return;
    }

    if (!categoria.trim()) {
      setErro("Selecione uma categoria.");
      return;
    }

    try {
      await cadastrarVideo({
        titulo: titulo.trim(),
        link: link.trim(),
        descricao: descricao.trim(),
        categoria: categoria,
      });

      setMensagem("Vídeo cadastrado!");
      setTitulo("");
      setLink("");
      setDescricao("");
      setCategoria(categorias[0] || "");

      await carregarTudo();
    } catch (error) {
      console.error("Erro ao cadastrar vídeo:", error);
      setErro("Erro ao cadastrar vídeo.");
    }
  }

  function selecionar(video) {
    setVideoSelecionado(video);
    setEditTitulo(video.titulo || "");
    setEditLink(video.link || "");
    setEditDescricao(video.descricao || "");
    setEditCategoria(video.categoria || categorias[0] || "");
    setMensagem("");
    setErro("");
  }

  async function salvarEdicao() {
    setMensagem("");
    setErro("");

    if (!videoSelecionado) {
      setErro("Selecione um vídeo.");
      return;
    }

    if (!editTitulo.trim() || !editLink.trim()) {
      setErro("Preencha título e link.");
      return;
    }

    if (!editCategoria.trim()) {
      setErro("Selecione uma categoria.");
      return;
    }

    try {
      await atualizarVideo(videoSelecionado.id, {
        titulo: editTitulo.trim(),
        link: editLink.trim(),
        descricao: editDescricao.trim(),
        categoria: editCategoria,
      });

      setMensagem("Atualizado!");
      setVideoSelecionado(null);
      await carregarTudo();
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
      setErro("Erro ao atualizar vídeo.");
    }
  }

  async function deletar() {
    setMensagem("");
    setErro("");

    if (!videoSelecionado) {
      setErro("Selecione um vídeo.");
      return;
    }

    try {
      await excluirVideo(videoSelecionado.id);
      setVideoSelecionado(null);
      setMensagem("Vídeo excluído!");
      await carregarTudo();
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      setErro("Erro ao excluir vídeo.");
    }
  }

  return (
    <PhoneFrame title="Gerenciar Vídeos" showBack onBack={() => goTo("admin_home")}>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-900" />
              Nomes das 5 abas
            </div>

            {editCategorias.map((item, index) => (
              <Input
                key={index}
                placeholder={`Nome da aba ${index + 1}`}
                value={item}
                onChange={(e) => alterarCategoriaConfig(index, e.target.value)}
              />
            ))}

            <Button
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              onClick={handleSalvarCategorias}
            >
              Salvar nomes das abas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-900" />
              Cadastrar vídeo
            </div>

            <Input
              placeholder="Título do vídeo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <Input
              placeholder="Link do vídeo"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <Input
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700 outline-none"
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {mensagem ? (
              <div className="text-sm text-green-600 font-medium">{mensagem}</div>
            ) : null}

            {erro ? (
              <div className="text-sm text-blue-900 font-medium">{erro}</div>
            ) : null}

            <Button
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              onClick={handleCadastrar}
            >
              Cadastrar vídeo
            </Button>
          </CardContent>
        </Card>

        {videos.map((video) => (
          <Card
            key={video.id}
            className={`cursor-pointer transition ${
              videoSelecionado?.id === video.id ? "ring-2 ring-yellow-400" : ""
            }`}
            onClick={() => selecionar(video)}
          >
            <CardContent className="p-4 space-y-1">
              <div className="font-semibold">{video.titulo}</div>
              <div className="text-sm text-zinc-500">{video.categoria}</div>
              {video.descricao ? (
                <div className="text-sm text-zinc-600">{video.descricao}</div>
              ) : null}
            </CardContent>
          </Card>
        ))}

        {videoSelecionado ? (
          <Card className="border-2 border-yellow-300">
            <CardContent className="p-4 space-y-3">
              <div className="font-semibold text-blue-900">
                Editar vídeo selecionado
              </div>

              <Input
                placeholder="Título"
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
              />

              <Input
                placeholder="Link"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
              />

              <Input
                placeholder="Descrição"
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
              />

              <select
                value={editCategoria}
                onChange={(e) => setEditCategoria(e.target.value)}
                className="w-full rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700 outline-none"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {mensagem ? (
                <div className="text-sm text-green-600 font-medium">{mensagem}</div>
              ) : null}

              {erro ? (
                <div className="text-sm text-blue-900 font-medium">{erro}</div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="bg-blue-900 hover:bg-blue-800 text-white"
                  onClick={salvarEdicao}
                >
                  Salvar edição
                </Button>
                <Button variant="outline" onClick={deletar}>
                  Excluir vídeo
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PhoneFrame>
  );
}