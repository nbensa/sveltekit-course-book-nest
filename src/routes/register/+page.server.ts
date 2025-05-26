import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;

    const returnObject = {
      success: true,
      email,
      name,
      password,
      passwordConfirmation,
      errors: [],
    };

    if (name.length < 2) {
      returnObject.success = false;
      returnObject.errors.push(
        "The name is two short. Must be at least 3 characters.",
      );
    }
    if (!email.length) {
      returnObject.errors.push("Email is required");
    }
    if (!password.length) {
      returnObject.errors.push("Password is required");
    }
    if (password !== passwordConfirmation) {
      returnObject.errors.push("Passwords do not match");
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.log("There has been an error");
      console.log(error);
      returnObject.success = false;
      return fail(400, returnObject);
    }

    await supabase.from("user_names").insert([
      {
        user_id: data.user.id,
        name,
      },
    ]);

    redirect(303, "/private/dashboard");
  },
};
