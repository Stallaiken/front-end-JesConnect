import { supabase } from "../supabaseClient.js";

export async function buscarTimes() {
  const { data, error } = await supabase
    .from("time")
    .select("id, Nome, id_modalidade, logo_URL")
    .limit(20);

  if (error) {
    throw error;
  }

  return data;
}

export async function buscarTime(id) {
  const { data, error } = await supabase
    .from("time")
    .select("id, Nome, id_modalidade, logo_URL")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function validarTime(nome, modalidade) {
  if (!nome || !nome.trim()) {
    return "O nome do time é obrigatório";
  }

  if (!modalidade) {
    return "A modalidade é obrigatória";
  }

  return null;
}