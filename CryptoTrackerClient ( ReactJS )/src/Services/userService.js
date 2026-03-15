import { supabase } from "../supabaseClient";

/* =========================
   AUTH FUNCTIONS
========================= */

export const signupUser = async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const loginUser = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const logoutUser = async () => {
  return await supabase.auth.signOut();
};

/* =========================
   PROFILE FUNCTIONS
========================= */

export const checkExistingProfile = async (username, mobile) => {
  return await supabase
    .from("profiles")
    .select("id")
    .or(`username.eq.${username},mobile.eq.${mobile}`);
};

export const createProfile = async (id, username, mobile) => {
  return await supabase.from("profiles").insert({
    id,
    username,
    mobile,
  });
};

export const getProfile = async (userId) => {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
};

export const updateProfile = async (userId, updatedData) => {
  return await supabase
    .from("profiles")
    .update(updatedData)
    .eq("id", userId);
};

export const deleteUserAccount = async (password) => {

  await supabase.auth.refreshSession();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { error: { message: "Session not found" } };
  }

  const response = await fetch(
    "https://igzfqpvuebwzwysbnnpz.functions.supabase.co/delete-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ password }),
    }
  );

  const result = await response.text();

  if (!response.ok) {
    return { error: { message: result } };
  }

  return { data: result };
};

export const updateUserPassword = async (newPassword) => {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
};

export const updateUserEmail = async (newEmail) => {
  return await supabase.auth.updateUser({
    email: newEmail,
  });
};