
import { supabase } from "./supabase";

export type Child = {
  id: string;
  user_id: string;
  school_id: string | null;
  full_name: string;
  birth_date: string;
  avatar_url: string | null;
  status: string;
  age_group_id: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCurrentChild(): Promise<Child | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar criança:", error);
    return null;
  }

  return data;
}

