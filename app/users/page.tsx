import { createClient } from "@/lib/supabase/server";
import AdminNav from "../components/AdminNav";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, is_superadmin, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Users / Profiles</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                {["Name", "Email", "Superadmin", "Joined"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles?.map((p) => (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-medium">{p.first_name} {p.last_name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${p.is_superadmin ? "bg-indigo-900 text-indigo-300" : "bg-gray-800 text-gray-500"}`}>
                      {p.is_superadmin ? "✓ Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
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