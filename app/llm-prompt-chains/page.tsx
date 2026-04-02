import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";

export default async function LLMPromptChainsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("llm_prompt_chains").select("*").order("id");

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">LLM Prompt Chains</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>{["ID", "Name", "Description", "Created"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data?.map((row) => (
                <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-400">{row.id}</td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.description}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.created_datetime_utc ? new Date(row.created_datetime_utc).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
