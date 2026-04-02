import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";

export default async function CaptionsPage() {
  const supabase = await createClient();
  const { data: captions } = await supabase
    .from("captions")
    .select("id, content, like_count, created_datetime_utc, image_id, is_public")
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Captions</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                {["Caption", "Likes", "Public", "Created"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {captions?.filter(c => c.content).map((c) => (
                <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 max-w-xs">{c.content}</td>
                  <td className="px-4 py-3 text-gray-400">{c.like_count ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${c.is_public ? "bg-green-900 text-green-300" : "bg-gray-800 text-gray-500"}`}>
                      {c.is_public ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {c.created_datetime_utc ? new Date(c.created_datetime_utc).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}