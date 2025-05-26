import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
  PUBLIC_FRONTEND_URL,
} from "$env/static/public";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  googleLogin: async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${PUBLIC_FRONTEND_URL}/auth/callback`,
      },
    });

    if (error) {
      return fail(400, { message: "Something went wrong with Google login" });
    }

    throw redirect(303, data.url);
  },
  signInWithPassword: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const returnObject = {
      success: true,
      email,
      password,
      errors: [],
    };

    if (!email.length) {
      returnObject.errors.push("Email is required");
    }
    if (!password.length) {
      returnObject.errors.push("Password is required");
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.log("There has been an error");
      console.log(error);
      returnObject.success = false;
      return fail(404, returnObject);
    }

    redirect(303, "/private/dashboard");
  },
};
