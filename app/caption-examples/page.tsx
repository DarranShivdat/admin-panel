"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminNav from "../components/AdminNav";

export default function CaptionExamplesPage() {
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ caption: "", explanation: "", image_description: "" });
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ caption: "", explanation: "", image_description: "" });
  const supabase = createClient();

  useEffect(() => {
    supabase.from("caption_examples").select("*").order("created_datetime_utc", { ascending: false }).then(({ data }) => setData(data ?? []));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    await supabase.from("caption_examples").delete().eq("id", id);
    setData(data.filter((d) => d.id !== id));
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setEditForm({ caption: row.caption ?? "", explanation: row.explanation ?? "", image_description: row.image_description ?? "" });
  };

  const handleUpdate = async (id: number) => {
    await supabase.from("caption_examples").update(editForm).eq("id", id);
    setData(data.map((d) => d.id === id ? { ...d, ...editForm } : d));
    setEditingId(null);
  };

  const handleAdd = async () => {
    const { data: inserted } = await supabase.from("caption_examples").insert(newForm).select().single();
    if (inserted) { setData([inserted, ...data]); setAdding(false); setNewForm({ caption: "", explanation: "", image_description: "" }); }
  };

  return (
    <>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Caption Examples</h1>
          <button onClick={() => setAdding(!adding)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl">+ Add</button>
        </div>
        {adding && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 space-y-2">
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="Caption" value={newForm.caption} onChange={(e) => setNewForm({ ...newForm, caption: e.target.value })} />
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="Explanation" value={newForm.explanation} onChange={(e) => setNewForm({ ...newForm, explanation: e.target.value })} />
            <textarea className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" placeholder="Image description" rows={2} value={newForm.image_description} onChange={(e) => setNewForm({ ...newForm, image_description: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Add</button>
              <button onClick={() => setAdding(false)} className="text-gray-400 text-sm px-2">Cancel</button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              {editingId === row.id ? (
                <div className="space-y-2">
                  <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" value={editForm.caption} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} />
                  <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" value={editForm.explanation} onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })} />
                  <textarea className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white" rows={2} value={editForm.image_description} onChange={(e) => setEditForm({ ...editForm, image_description: e.target.value })} />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(row.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-medium mb-1">{row.caption}</div>
                  <div className="text-sm text-gray-400 mb-2">{row.explanation}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(row)} className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(row.id)} className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
