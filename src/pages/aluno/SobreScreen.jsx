import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

import PhoneFrame from "../../components/layout/PhoneFrame";
import BottomNav from "../../components/layout/BottomNav";
import { Card, CardContent } from "../../components/ui/Card";

import { buscarSobreAcademia } from "../../services/sobreService";

export default function SobreScreen({ goTo }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const resultado = await buscarSobreAcademia();
      setDados(resultado);
    } catch (error) {
      console.error("Erro ao carregar sobre a academia:", error);
      setErro("Erro ao carregar informações da academia.");
    }
  }

  return (
    <PhoneFrame title="Sobre a Academia" showBack onBack={() => goTo("perfil")}>
      <div className="p-4 space-y-4">
        <Card className="border border-blue-200">
          <CardContent className="p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2 text-blue-900">
              <BookOpen className="h-5 w-5 text-yellow-400" />
              {dados?.titulo || "Sobre a academia"}
            </div>

            {erro ? (
              <div className="text-sm text-red-600 font-medium">
                {erro}
              </div>
            ) : (
              <div className="text-sm text-zinc-700 whitespace-pre-line">
                {dados?.texto || "Nenhuma informação cadastrada ainda."}
              </div>
            )}
          </CardContent>
        </Card>

        <BottomNav current="perfil" onChange={goTo} />
      </div>
    </PhoneFrame>
  );
}