import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";

export default async function LLMResponsesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("llm_responses").select("*").order("created_datetime_utc", { ascending: false }).limit(50);

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">LLM Responses</h1>
        <div className="space-y-3">
          {data?.map((row) => (
            <div key={row.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-500">{row.id}</span>
                <span className="text-xs text-gray-500">{row.created_datetime_utc ? new Date(row.created_datetime_utc).toLocaleDateString() : "—"}</span>
              </div>
              <div className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-3">{row.response_text ?? row.content ?? JSON.stringify(row)}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
