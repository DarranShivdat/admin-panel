"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminNav from "../components/AdminNav";

export default function HumorMixPage() {
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const supabase = createClient();

  useEffect(() => {
    supabase.from("humor_mix").select("*").order("id").then(({ data }) => setData(data ?? []));
  }, []);

  const handleUpdate = async (id: number) => {
    await supabase.from("humor_mix").update(editForm).eq("id", id);
    setData(data.map((d) => d.id === id ? { ...d, ...editForm } : d));
    setEditingId(null);
  };

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Humor Mix</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>{["ID", "Flavor ID", "Weight", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  {editingId === row.id ? (
                    <td colSpan={4} className="px-4 py-3">
                      <div className="flex gap-2">
                        <input type="number" className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white w-24" placeholder="Weight" value={editForm.weight ?? ""} onChange={(e) => setEditForm({ ...editForm, weight: Number(e.target.value) })} />
                        <button onClick={() => handleUpdate(row.id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">Cancel</button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-gray-400">{row.id}</td>
                      <td className="px-4 py-3">{row.humor_flavor_id}</td>
                      <td className="px-4 py-3 text-gray-400">{row.weight}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setEditingId(row.id); setEditForm({ weight: row.weight }); }} className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">Edit</button>
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
