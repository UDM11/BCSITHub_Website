// services/uploadService.ts
import { supabase } from "../lib/supabase";

export const getUserPastPapers = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("past_papers")
      .select("*")
      .eq("uploaded_by", userId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("[getUserPastPapers] Error fetching past papers:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[getUserPastPapers] Unexpected error:", err);
    return [];
  }
};
