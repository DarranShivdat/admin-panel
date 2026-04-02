"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Image = { id: string; url: string | null; is_common_use: boolean | null; created_at: string | null; profile_id: string | null };

export default function ImagesClient({ initialImages }: { initialImages: Image[] }) {
  const [images, setImages] = useState(initialImages);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("images").delete().eq("id", id);
    setImages(images.filter((i) => i.id !== id));
  };

  const handleEdit = (img: Image) => {
    setEditingId(img.id);
    setEditUrl(img.url ?? "");
  };

  const handleUpdate = async (id: string) => {
    await supabase.from("images").update({ url: editUrl }).eq("id", id);
    setImages(images.map((i) => i.id === id ? { ...i, url: editUrl } : i));
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    const { data } = await supabase
      .from("images")
      .insert({ url: newUrl, is_common_use: false })
      .select()
      .single();
    if (data) {
      setImages([data, ...images]);
      setNewUrl("");
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAdding(!adding)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl"
        >
          + Add Image
        </button>
      </div>

      {adding && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4 flex gap-3">
          <input
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            placeholder="Image URL..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Add</button>
          <button onClick={() => setAdding(false)} className="text-gray-400 text-sm px-2">Cancel</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {img.url ? (
              <img src={img.url} alt="" className="w-full h-36 object-cover bg-gray-800" />
            ) : (
              <div className="w-full h-36 bg-gray-800 flex items-center justify-center text-2xl">🖼️</div>
            )}
            <div className="p-3">
              {editingId === img.id ? (
                <div className="space-y-2">
                  <input
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(img.id)} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-gray-500 font-mono truncate mb-2">{img.id.slice(0, 8)}...</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(img)} className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded hover:bg-gray-600">Edit</button>
                    <button onClick={() => handleDelete(img.id)} className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded hover:bg-red-900">Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}