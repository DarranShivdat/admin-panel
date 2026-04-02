import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";
import ImagesClient from "./ImagesClient";

export default async function ImagesPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("images")
    .select("id, url, is_common_use, created_at, profile_id")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Images</h1>
        <ImagesClient initialImages={images ?? []} />
      </main>
    </>
  );
}