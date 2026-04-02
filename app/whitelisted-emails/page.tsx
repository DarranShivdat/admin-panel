"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminNav from "../components/AdminNav";

export default function WhitelistedEmailsPage() {
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.from("whitelisted_email_addresses").select("*").order("id").then(({ data }) => setData(data ?? []));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("whitelisted_email_addresses").delete().eq("id", id);
    setData(data.filter((d) => d.id !== id));
  };

  const handleUpdate = async (id: number) => {
    await supabase.from("whitelisted_email_addresses").update({ email: editEmail }).eq("id", id);
    setData(data.map((d) => d.id === id ? { ...d, email: editEmail } : d));
    setEditingId(null);
  };

  const handleAdd = async () => {
    const { data: inserted } = await supabase.from("whitelisted_email_addresses").insert({ email: newEmail }).select().single();
    if (inserted) { setData([...data, inserted]); setAdding(false); setNewEmail(""); }
  };

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Whitelisted Emails</h1>
          <button onClick={() => setAdding(!adding)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl">+ Add</button>
        </div>
        {adding && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 flex gap-3">
            <input className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="email@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Add</button>
            <button onClick={() => setAdding(false)} className="text-gray-400 text-sm px-2">Cancel</button>
          </div>
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>{["ID", "Email", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-400">{row.id}</td>
                  {editingId === row.id ? (
                    <td colSpan={2} className="px-4 py-3">
                      <div className="flex gap-2">
                        <input className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white flex-1" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        <button onClick={() => handleUpdate(row.id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">Cancel</button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium">{row.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingId(row.id); setEditEmail(row.email); }} className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">Edit</button>
                          <button onClick={() => handleDelete(row.id)} className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
