"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminNav from "../components/AdminNav";

export default function TermsPage() {
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ term: "", definition: "", example: "", priority: 0 });
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ term: "", definition: "", example: "", priority: 0 });
  const supabase = createClient();

  useEffect(() => {
    supabase.from("terms").select("*").order("term").then(({ data }) => setData(data ?? []));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("terms").delete().eq("id", id);
    setData(data.filter((d) => d.id !== id));
  };

  const handleUpdate = async (id: number) => {
    await supabase.from("terms").update(editForm).eq("id", id);
    setData(data.map((d) => d.id === id ? { ...d, ...editForm } : d));
    setEditingId(null);
  };

  const handleAdd = async () => {
    const { data: inserted } = await supabase.from("terms").insert(newForm).select().single();
    if (inserted) { setData([inserted, ...data]); setAdding(false); setNewForm({ term: "", definition: "", example: "", priority: 0 }); }
  };

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Terms</h1>
          <button onClick={() => setAdding(!adding)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl">+ Add</button>
        </div>
        {adding && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 space-y-2">
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="Term" value={newForm.term} onChange={(e) => setNewForm({ ...newForm, term: e.target.value })} />
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="Definition" value={newForm.definition} onChange={(e) => setNewForm({ ...newForm, definition: e.target.value })} />
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="Example" value={newForm.example} onChange={(e) => setNewForm({ ...newForm, example: e.target.value })} />
            <input type="number" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="Priority" value={newForm.priority} onChange={(e) => setNewForm({ ...newForm, priority: Number(e.target.value) })} />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Add</button>
              <button onClick={() => setAdding(false)} className="text-gray-400 text-sm px-2">Cancel</button>
            </div>
          </div>
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>{["Term", "Definition", "Example", "Priority", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  {editingId === row.id ? (
                    <td colSpan={5} className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <input className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white" value={editForm.term} onChange={(e) => setEditForm({ ...editForm, term: e.target.value })} />
                        <input className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white flex-1" value={editForm.definition} onChange={(e) => setEditForm({ ...editForm, definition: e.target.value })} />
                        <input className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white flex-1" value={editForm.example} onChange={(e) => setEditForm({ ...editForm, example: e.target.value })} />
                        <input type="number" className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white w-20" value={editForm.priority} onChange={(e) => setEditForm({ ...editForm, priority: Number(e.target.value) })} />
                        <button onClick={() => handleUpdate(row.id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">Cancel</button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium">{row.term}</td>
                      <td className="px-4 py-3 text-gray-400">{row.definition}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.example}</td>
                      <td className="px-4 py-3 text-gray-400">{row.priority}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingId(row.id); setEditForm({ term: row.term, definition: row.definition, example: row.example, priority: row.priority }); }} className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">Edit</button>
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
