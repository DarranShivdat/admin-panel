import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";

export default async function CaptionRequestsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("caption_requests")
    .select("*")
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Caption Requests</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                {["ID", "Status", "Image ID", "Created"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((r) => (
                <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3 text-gray-400">{r.status ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.image_id ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.created_datetime_utc ? new Date(r.created_datetime_utc).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
