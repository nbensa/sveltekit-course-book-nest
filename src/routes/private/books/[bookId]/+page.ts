import { error } from "@sveltejs/kit";

export const load = async ({ parent, params }) => {
  const { supabase } = await parent();
  const { bookId } = params;

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (data) {
    return { book: data };
  }

  error(404, "not found");
};
