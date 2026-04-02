import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";

export default async function HumorFlavorsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("humor_flavors").select("*").order("id");
  const { data: steps } = await supabase.from("humor_flavor_steps").select("*").order("id");

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Humor Flavors</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>{["ID", "Name", "Description"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data?.map((row) => (
                <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-400">{row.id}</td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-400">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-bold mb-4">Humor Flavor Steps</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>{["ID", "Flavor ID", "Step", "Description"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {steps?.map((row) => (
                <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-400">{row.id}</td>
                  <td className="px-4 py-3 text-gray-400">{row.humor_flavor_id}</td>
                  <td className="px-4 py-3 font-medium">{row.step_number ?? row.order ?? row.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
