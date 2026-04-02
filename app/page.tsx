import { createClient } from "@/lib/supabase/server";
import AdminNav from "./components/AdminNav";

export default async function Dashboard() {
  const supabase = await createClient();

  const [
    { count: userCount },
    { count: imageCount },
    { count: captionCount },
    { count: voteCount },
    { data: recentUsers },
    { data: topImages },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase.from("caption_votes").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id, email, first_name, last_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("images")
      .select("id, url, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "Total Users", value: userCount ?? 0, icon: "👥", color: "from-blue-600 to-blue-800" },
    { label: "Total Images", value: imageCount ?? 0, icon: "🖼️", color: "from-purple-600 to-purple-800" },
    { label: "Total Captions", value: captionCount ?? 0, icon: "💬", color: "from-green-600 to-green-800" },
    { label: "Total Votes", value: voteCount ?? 0, icon: "🗳️", color: "from-orange-600 to-orange-800" },
  ];

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-6`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-bold">{s.value.toLocaleString()}</div>
              <div className="text-sm opacity-80 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4 text-gray-300">Recent Users</h2>
            <div className="space-y-3">
              {recentUsers?.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold">
                    {(u.first_name?.[0] || u.email?.[0] || "?").toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{u.first_name} {u.last_name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-4 text-gray-300">Recent Images</h2>
            <div className="space-y-3">
              {topImages?.map((img) => (
                <div key={img.id} className="flex items-center gap-3">
                  {img.url ? (
                    <img src={img.url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">🖼️</div>
                  )}
                  <div className="text-xs text-gray-400 font-mono truncate">{img.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}