import { useState } from "react";
import { appConfig } from "../../config/appConfig";

export default function AppLogo({ size = "large" }) {
  const [erroImagem, setErroImagem] = useState(false);

  const tamanhoClasse =
    size === "small" ? "w-14 h-14" : "w-24 h-24";

  if (erroImagem) {
    return (
      <div
        className={`${tamanhoClasse} rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg`}
      >
        <div className="w-full h-full bg-zinc-900 text-white flex items-center justify-center text-center text-xs font-bold px-2">
          {appConfig.nomeAcademia}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${tamanhoClasse} rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg`}
    >
      <img
        src={appConfig.logoUrl}
        alt={`Logo ${appConfig.nomeAcademia}`}
        className="w-full h-full object-cover"
        onError={() => setErroImagem(true)}
      />
    </div>
  );
}