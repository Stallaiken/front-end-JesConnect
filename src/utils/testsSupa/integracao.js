import { supabase } from "../supabaseClient.js";

export async function buscarTimesDaModalidade(idModalidade) {
  const { data, error } = await supabase
    .from("time")
    .select("id, Nome, id_modalidade")
    .eq("id_modalidade", idModalidade)
    .limit(20);

  if (error) {
    throw error;
  }

  return data;
}

export async function buscarModalidadeDoTime(idTime) {
  const { data, error } = await supabase
    .from("time")
    .select("id_modalidade")
    .eq("id", idTime)
    .single();

  if (error) {
    throw error;
  }

  const { data: modalidade, error: erroModalidade } = await supabase
    .from("modalidade")
    .select("id, nome, genero")
    .eq("id", data.id_modalidade)
    .single();

  if (erroModalidade) {
    throw erroModalidade;
  }

  return modalidade;
}