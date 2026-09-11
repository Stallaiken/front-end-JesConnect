import { supabase } from "../supabaseClient.js";

export async function buscarModalidades() {
  const { data, error } = await supabase
    .from("modalidade")
    .select("id, nome, genero")
    .limit(20);

  if (error) {
    throw error;
  }

  return data;
}

export async function buscarModalidade(id) {
  const { data, error } = await supabase
    .from("modalidade")
    .select("id, nome, genero")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function validarModalidade(nome, genero) {
  if (!nome || !nome.trim()) {
    return "O nome da modalidade é obrigatório";
  }

  if (!genero) {
    return "O gênero é obrigatório";
  }

  return null;
}