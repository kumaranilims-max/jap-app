"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Mantra } from "@/lib/supabase";
import { getCurrentUser, isAdmin, logout } from "@/lib/auth";

export default function AdminPanel() {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editingMantra, setEditingMantra] = useState<Mantra | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title_hindi: "",
    title_english: "",
    subtitle_hindi: "",
    subtitle_english: "",
    description_hindi: "",
    description_english: "",
    verses_hindi: "",
    verses_english: "",
    category: "",
    color: "bg-orange-500",
    icon: "🕉️",
    image_url: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user || !isAdmin()) {
      router.push('/login');
      return;
    }
    setIsAuthorized(true);
    fetchMantras();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const fetchMantras = async () => {
    const { data } = await supabase.from('mantras').select('*');
    if (data) setMantras(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('mantra-images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from('mantra-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const versesHindiArray = formData.verses_hindi.split('\n').filter(v => v.trim());
    const versesEnglishArray = formData.verses_english.split('\n').filter(v => v.trim());
    
    const mantraData = {
      title_hindi: formData.title_hindi,
      title_english: formData.title_english,
      subtitle_hindi: formData.subtitle_hindi,
      subtitle_english: formData.subtitle_english,
      description_hindi: formData.description_hindi,
      description_english: formData.description_english,
      verses_hindi: versesHindiArray,
      verses_english: versesEnglishArray,
      category: formData.category,
      color: formData.color,
      icon: formData.icon,
      image_url: formData.image_url
    };

    let error;
    if (editingMantra) {
      const { error: updateError } = await supabase
        .from('mantras')
        .update(mantraData)
        .eq('id', editingMantra.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('mantras').insert(mantraData);
      error = insertError;
    }

    if (!error) {
      setShowForm(false);
      setEditingMantra(null);
      setFormData({
        title_hindi: "",
        title_english: "",
        subtitle_hindi: "",
        subtitle_english: "",
        description_hindi: "",
        description_english: "",
        verses_hindi: "",
        verses_english: "",
        category: "",
        color: "bg-orange-500",
        icon: "🕉️",
        image_url: ""
      });
      fetchMantras();
    }
  };

  const deleteMantra = async (id: number) => {
    if (confirm('Are you sure you want to delete this mantra?')) {
      await supabase.from('mantras').delete().eq('id', id);
      fetchMantras();
    }
  };

  const startEditMantra = (mantra: Mantra) => {
    setEditingMantra(mantra);
    setFormData({
      title_hindi: mantra.title_hindi,
      title_english: mantra.title_english,
      subtitle_hindi: mantra.subtitle_hindi || "",
      subtitle_english: mantra.subtitle_english || "",
      description_hindi: mantra.description_hindi,
      description_english: mantra.description_english,
      verses_hindi: mantra.verses_hindi?.join('\n') || "",
      verses_english: mantra.verses_english?.join('\n') || "",
      category: mantra.category,
      color: mantra.color,
      icon: mantra.icon,
      image_url: mantra.image_url || ""
    });
    setShowForm(true);
  };

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Mantra Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                  setEditingMantra(null);
                  setFormData({
                    title_hindi: "",
                    title_english: "",
                    subtitle_hindi: "",
                    subtitle_english: "",
                    description_hindi: "",
                    description_english: "",
                    verses_hindi: "",
                    verses_english: "",
                    category: "",
                    color: "bg-orange-500",
                    icon: "🕉️",
                    image_url: ""
                  });
                } else {
                  setShowForm(true);
                }
              }}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              {showForm ? 'Cancel' : 'Add New Mantra'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">{editingMantra ? 'Edit Mantra' : 'Add New Mantra'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title Hindi (e.g., हनुमान चालीसा)"
                  value={formData.title_hindi}
                  onChange={(e) => setFormData({...formData, title_hindi: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Title English (e.g., Hanuman Chalisa)"
                  value={formData.title_english}
                  onChange={(e) => setFormData({...formData, title_english: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Subtitle Hindi"
                  value={formData.subtitle_hindi}
                  onChange={(e) => setFormData({...formData, subtitle_hindi: e.target.value})}
                  className="p-3 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Subtitle English"
                  value={formData.subtitle_english}
                  onChange={(e) => setFormData({...formData, subtitle_english: e.target.value})}
                  className="p-3 border rounded-lg"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Description Hindi"
                  value={formData.description_hindi}
                  onChange={(e) => setFormData({...formData, description_hindi: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Description English"
                  value={formData.description_english}
                  onChange={(e) => setFormData({...formData, description_english: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Category (e.g., chalisa, mantra)"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="p-3 border rounded-lg"
                >
                  <option value="bg-red-500">Red</option>
                  <option value="bg-orange-500">Orange</option>
                  <option value="bg-yellow-500">Yellow</option>
                  <option value="bg-green-500">Green</option>
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-pink-500">Pink</option>
                </select>
                <input
                  type="text"
                  placeholder="Icon (emoji)"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="p-3 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="p-3 border rounded-lg w-full"
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {formData.image_url && (
                  <div className="mt-2">
                    <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <textarea
                  placeholder="Verses Hindi (one per line)&#10;ॐ नमः शिवाय&#10;हरे कृष्ण हरे राम"
                  value={formData.verses_hindi}
                  onChange={(e) => setFormData({...formData, verses_hindi: e.target.value})}
                  className="p-3 border rounded-lg h-32"
                  required
                />
                <textarea
                  placeholder="Verses English (one per line)&#10;Om Namah Shivaya&#10;Hare Krishna Hare Rama"
                  value={formData.verses_english}
                  onChange={(e) => setFormData({...formData, verses_english: e.target.value})}
                  className="p-3 border rounded-lg h-32"
                />
              </div>
              
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                {editingMantra ? 'Update Mantra' : 'Add Mantra'}
              </button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mantras.map((mantra) => (
            <div key={mantra.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${mantra.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {mantra.icon}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditMantra(mantra)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteMantra(mantra.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{mantra.title_hindi}</h3>
              <p className="text-sm text-orange-600 mb-1">{mantra.subtitle_hindi}</p>
              <p className="text-xs text-gray-500 mb-2">{mantra.title_english}</p>
              <p className="text-gray-600 mb-3">{mantra.description_hindi}</p>
              <p className="text-sm text-gray-500">Category: {mantra.category}</p>
              <p className="text-sm text-gray-500">Verses: {mantra.verses_hindi?.length || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}