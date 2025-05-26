import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { createClient } from "@supabase/supabase-js";
import { json } from "@sveltejs/kit";

export const PATCH = async ({ request }) => {
  const supabaseAdmin = createClient(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  );

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json({ error: "No valid authorization header" }, { staus: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data: userData, error: verificationError } =
      await supabaseAdmin.auth.getUser(token);
    if (verificationError || !userData.user) {
      return json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = userData.user.id;
    const { userName, email } = await request.json();

    const { error: updateAuthError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        email,
      });

    if (updateAuthError) {
      return json({ error: "failed to update email" }, { status: 500 });
    }

    const { error: updateProfileError } = await supabaseAdmin
      .from("user_names")
      .update({ name: userName })
      .eq("user_id", userId);

    if (updateProfileError) {
      return json({ error: "failed to update username" }, { status: 500 });
    }
    return json({ message: "account successfully updated" });
  } catch (error) {
    return json({ error: "an unexpected error ocurred" }, { status: 500 });
  }
};
