import { supabase } from "../lib/supabase";

export const getUserPastPapers = async (userId: string) => {
  const { data, error } = await supabase
    .from("past_papers")
    .select("*")
    .eq("uploaded_by", userId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching papers:", error.message);
    return [];
  }

  return data;
};
