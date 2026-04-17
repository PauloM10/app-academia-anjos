import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Image as ImageIcon,
  Trophy,
  ClipboardCheck,
} from "lucide-react";

import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import AppLogo from "../../components/layout/AppLogo";
import Badge from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";

import { buscarAvisoDestaque } from "../../services/avisoService";
import { buscarProdutoDestaque } from "../../services/produtoService";

export default function HomeAluno({ goTo }) {
  const [avisoDestaque, setAvisoDestaque] = useState(null);
  const [produtoDestaque, setProdutoDestaque] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [aviso, produto] = await Promise.all([
        buscarAvisoDestaque(),
        buscarProdutoDestaque(),
      ]);

      setAvisoDestaque(aviso);
      setProdutoDestaque(produto);
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
    }
  }

  return (
    <PhoneFrame title="Home">
      <div className="p-4 space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-3xl border-0 shadow-xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <AppLogo size="small" />

                <div>
                  <Badge className="bg-yellow-400 text-blue-900 border-0 mb-2">
                    Bem-vindo
                  </Badge>
                  <h2 className="text-xl font-bold">Portal do Aluno</h2>
                </div>
              </div>

              <div className="flex justify-between items-start gap-4">
                <p className="text-sm text-blue-100">
                  Treinos, avisos e acompanhamento completo da academia.
                </p>

                <Trophy className="h-7 w-7 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer" onClick={() => goTo("agenda")}>
            <CardContent className="p-4">
              <CalendarDays className="h-5 w-5 mb-2 text-blue-900" />
              <div className="font-semibold">Treinos</div>
              <div className="text-sm text-zinc-500">Dias e horários</div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer" onClick={() => goTo("fotos")}>
            <CardContent className="p-4">
              <ImageIcon className="h-5 w-5 mb-2 text-blue-900" />
              <div className="font-semibold">Fotos</div>
              <div className="text-sm text-zinc-500">Galeria</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Card className="cursor-pointer" onClick={() => goTo("chamada")}>
            <CardContent className="p-4">
              <ClipboardCheck className="h-5 w-5 mb-2 text-blue-900" />
              <div className="font-semibold">Chamada</div>
              <div className="text-sm text-zinc-500">Presença</div>
            </CardContent>
          </Card>
        </div>

        {avisoDestaque && (
          <Card className="border border-yellow-300">
            <CardContent className="p-4">
              <div className="text-sm font-semibold text-blue-900 mb-1">
                Aviso importante
              </div>
              <div className="text-sm text-zinc-700">
                {avisoDestaque.texto}
              </div>
            </CardContent>
          </Card>
        )}

        {produtoDestaque && (
          <Card className="border border-blue-200">
            <CardContent className="p-4">
              <div className="text-sm font-semibold text-blue-900 mb-1">
                Produto em destaque
              </div>
              <div className="text-sm text-zinc-700">
                {produtoDestaque.nome}
              </div>
            </CardContent>
          </Card>
        )}

        <BottomNav current="home" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}