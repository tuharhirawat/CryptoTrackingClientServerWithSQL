import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://igzfqpvuebwzwysbnnpz.supabase.co";
const supabaseAnonKey = "sb_publishable_datJey2IFMmvi_y_aj2e7g_0DzPcpC0";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
