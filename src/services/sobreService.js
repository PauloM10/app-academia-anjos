import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { appConfig } from "../config/appConfig";

const SOBRE_DOC_ID = "sobre_academia";

export async function buscarSobreAcademia() {
  const ref = doc(db, "configuracoes", SOBRE_DOC_ID);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      titulo: appConfig.textos.tituloSobre,
      texto: appConfig.textos.sobreAcademia,
    };
  }

  return snap.data();
}

export async function salvarSobreAcademia(dados) {
  const ref = doc(db, "configuracoes", SOBRE_DOC_ID);

  await setDoc(
    ref,
    {
      titulo: dados.titulo,
      texto: dados.texto,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true }
  );
}