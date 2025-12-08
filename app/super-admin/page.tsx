"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SuperAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [mantras, setMantras] = useState<any[]>([]);
  const [chalisaVerses, setChalisaVerses] = useState<any[]>([]);
  const [secretKey, setSecretKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMantraForm, setShowMantraForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingMantra, setEditingMantra] = useState<any>(null);
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
    user_type: "user",
    full_name: ""
  });
  const [mantraFormData, setMantraFormData] = useState({
    title_hindi: "",
    title_english: "",
    subtitle_hindi: "",
    subtitle_english: "",
    description_hindi: "",
    description_english: "",
    verses_hindi: "",
    verses_english: "",
    category: "mantra",
    color: "bg-orange-500",
    icon: "🕉️",
    background_image: ""
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const SUPER_ADMIN_KEY = "SPIRITUAL_ADMIN_2024";

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
      fetchMantras();
      fetchChalisaVerses();
    }
  }, [isAuthorized]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setCaptchaAnswer("");
    setCaptchaVerified(false);
  };

  const verifyCaptcha = () => {
    if (parseInt(captchaAnswer) === captchaQuestion.answer) {
      setCaptchaVerified(true);
      return true;
    } else {
      showToast("गलत जवाब! कृपया पुनः प्रयास करें / Wrong answer!", 'error');
      generateCaptcha();
      return false;
    }
  };

  const handleAuth = () => {
    if (!captchaVerified && !verifyCaptcha()) {
      return;
    }
    if (secretKey === SUPER_ADMIN_KEY) {
      setIsAuthorized(true);
    } else {
      showToast("Invalid secret key!", 'error');
      generateCaptcha();
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
  };

  const fetchMantras = async () => {
    const { data } = await supabase.from('mantras').select('*');
    if (data) setMantras(data);
  };

  const fetchChalisaVerses = async () => {
    const { data } = await supabase.from('chalisa_verses').select('*').order('verse_number');
    if (data) setChalisaVerses(data);
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userFormData.email,
        password: userFormData.password,
        options: {
          data: {
            full_name: userFormData.full_name,
            user_type: userFormData.user_type
          }
        }
      });

      if (error) {
        showToast("Error: " + error.message, 'error');
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: userFormData.email,
          user_type: userFormData.user_type,
          full_name: userFormData.full_name
        });

        if (profileError) {
          showToast("Error: " + profileError.message, 'error');
          return;
        }

        showToast("✅ User created successfully!");
        setShowCreateForm(false);
        setUserFormData({ email: "", password: "", user_type: "user", full_name: "" });
        fetchUsers();
      }
    } catch (err: any) {
      showToast("Error: " + err.message, 'error');
    }
  };

  const uploadImage = async (file: File, bucketName = 'mantra-images', folderName = 'mantra-backgrounds') => {
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      showToast('Error uploading image: ' + error.message, 'error');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setMantraFormData({...mantraFormData, background_image: imageUrl});
      }
    }
  };

  const createMantra = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const versesHindiArray = mantraFormData.verses_hindi.split('\n').filter(v => v.trim());
    const versesEnglishArray = mantraFormData.verses_english.split('\n').filter(v => v.trim());
    
    const { error } = await supabase.from('mantras').insert({
      title_hindi: mantraFormData.title_hindi,
      title_english: mantraFormData.title_english,
      subtitle_hindi: mantraFormData.subtitle_hindi,
      subtitle_english: mantraFormData.subtitle_english,
      description_hindi: mantraFormData.description_hindi,
      description_english: mantraFormData.description_english,
      verses_hindi: versesHindiArray,
      verses_english: versesEnglishArray,
      category: mantraFormData.category,
      color: mantraFormData.color,
      icon: mantraFormData.icon,
      background_image: mantraFormData.background_image
    });

    if (!error) {
      showToast("✅ Mantra created successfully!");
      setShowMantraForm(false);
      setMantraFormData({
        title_hindi: "",
        title_english: "",
        subtitle_hindi: "",
        subtitle_english: "",
        description_hindi: "",
        description_english: "",
        verses_hindi: "",
        verses_english: "",
        category: "mantra",
        color: "bg-orange-500",
        icon: "🕉️",
        background_image: ""
      });
      fetchMantras();
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        user_type: userFormData.user_type,
        full_name: userFormData.full_name
      })
      .eq('id', editingUser.id);

    if (!error) {
      showToast("✅ User updated successfully!");
      setEditingUser(null);
      setUserFormData({ email: "", password: "", user_type: "user", full_name: "" });
      fetchUsers();
    }
  };

  const deleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) {
        showToast("Error: " + error.message, 'error');
      } else {
        showToast("✅ User deleted!");
        fetchUsers();
      }
    }
  };

  const deleteMantra = async (mantraId: number) => {
    if (confirm("Are you sure you want to delete this mantra?")) {
      const { error } = await supabase.from('mantras').delete().eq('id', mantraId);
      if (error) {
        showToast("Error: " + error.message, 'error');
      } else {
        showToast("✅ Mantra deleted!");
        fetchMantras();
      }
    }
  };

  const startEditUser = (user: any) => {
    setEditingUser(user);
    setUserFormData({
      email: user.email,
      password: "",
      user_type: user.user_type,
      full_name: user.full_name || ""
    });
  };

  const startEditMantra = (mantra: any) => {
    setEditingMantra(mantra);
    setMantraFormData({
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
      background_image: mantra.background_image || ""
    });
    setShowMantraForm(true);
  };

  const updateMantra = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const versesHindiArray = mantraFormData.verses_hindi.split('\n').filter(v => v.trim());
    const versesEnglishArray = mantraFormData.verses_english.split('\n').filter(v => v.trim());
    
    const { error } = await supabase
      .from('mantras')
      .update({
        title_hindi: mantraFormData.title_hindi,
        title_english: mantraFormData.title_english,
        subtitle_hindi: mantraFormData.subtitle_hindi,
        subtitle_english: mantraFormData.subtitle_english,
        description_hindi: mantraFormData.description_hindi,
        description_english: mantraFormData.description_english,
        verses_hindi: versesHindiArray,
        verses_english: versesEnglishArray,
        category: mantraFormData.category,
        color: mantraFormData.color,
        icon: mantraFormData.icon,
        background_image: mantraFormData.background_image
      })
      .eq('id', editingMantra.id);

    if (!error) {
      showToast("✅ Mantra updated successfully!");
      setShowMantraForm(false);
      setEditingMantra(null);
      setMantraFormData({
        title_hindi: "",
        title_english: "",
        subtitle_hindi: "",
        subtitle_english: "",
        description_hindi: "",
        description_english: "",
        verses_hindi: "",
        verses_english: "",
        category: "mantra",
        color: "bg-orange-500",
        icon: "🕉️",
        background_image: ""
      });
      fetchMantras();
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-200">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-gray-800">Super Admin</h1>
            <p className="text-gray-600 mt-2">Enter secret key to access</p>
          </div>
          
          {/* Human Challenge */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
            <div className="flex items-center justify-center mb-3">
              <span className="text-2xl mr-2">🤖</span>
              <h3 className="font-bold text-gray-700">मानव सत्यापन / Human Verification</h3>
            </div>
            <div className="text-center mb-3">
              <p className="text-lg font-semibold text-gray-800">
                {captchaQuestion.num1} + {captchaQuestion.num2} = ?
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="उत्तर दर्ज करें / Enter answer"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={captchaVerified}
              />
              <button
                onClick={generateCaptcha}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
                title="Refresh"
              >
                🔄
              </button>
            </div>
            {captchaVerified && (
              <div className="mt-2 text-center text-green-600 font-semibold flex items-center justify-center">
                <span className="mr-2">✅</span>
                सत्यापित / Verified
              </div>
            )}
          </div>

          <input
            type="password"
            placeholder="Enter secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
          />
          <button
            onClick={handleAuth}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold transition-all transform hover:scale-105"
          >
            Access Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-semibold`}>
          {toast.message}
        </div>
      )}
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              👑 Super Admin Dashboard
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'users' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👥 Users
              </button>
              <button
                onClick={() => setActiveTab('mantras')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'mantras' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🕉️ Mantras
              </button>
              <button
                onClick={() => setActiveTab('chalisa')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'chalisa' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🙏 Chalisa
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">👥</div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">👑</div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.user_type === 'admin').length}
                    </div>
                    <div className="text-gray-600">Admins</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🕉️</div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{mantras.length}</div>
                    <div className="text-gray-600">Total Mantras</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">✅</div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {mantras.filter(m => m.is_active !== false).length}
                    </div>
                    <div className="text-gray-600">Active Mantras</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.full_name}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.user_type === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.user_type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Recent Mantras</h3>
                <div className="space-y-3">
                  {mantras.slice(0, 5).map(mantra => (
                    <div key={mantra.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{mantra.icon}</div>
                        <div>
                          <div className="font-medium">{mantra.title_hindi}</div>
                          <div className="text-sm text-gray-500">{mantra.category}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {mantra.verses_hindi?.length || 0} verses
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Management</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
              >
                + Create User
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{user.email}</div>
                            {user.full_name && (
                              <div className="text-sm text-gray-500">{user.full_name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            user.user_type === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.user_type === 'admin' ? '👑 Admin' : '👤 User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditUser(user)}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hanuman Chalisa Tab */}
        {activeTab === 'chalisa' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🙏 Hanuman Chalisa Management</h2>
              <button
                onClick={() => {
                  const newVerse = {
                    verse_number: 1,
                    verse_text_hindi: '',
                    verse_text_english: '',
                    meaning_hindi: '',
                    meaning_english: '',
                    mantra_id: null,
                    verse_image: ''
                  };
                  setChalisaVerses([newVerse, ...chalisaVerses]);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold"
              >
                + Add Verse
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {chalisaVerses.map((verse, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-100 hover:border-red-300 transition-all">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">श्लोक {verse.id ? verse.verse_number : 'New'}</h3>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this verse?')) {
                            if (verse.id) {
                              await supabase.from('chalisa_verses').delete().eq('id', verse.id);
                              fetchChalisaVerses();
                            } else {
                              setChalisaVerses(chalisaVerses.filter((_, i) => i !== index));
                            }
                          }
                        }}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link to Mantra (Optional)</label>
                      <select
                        value={verse.mantra_id || ''}
                        onChange={(e) => {
                          const updated = [...chalisaVerses];
                          updated[index].mantra_id = e.target.value ? parseInt(e.target.value) : null;
                          setChalisaVerses(updated);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">-- Select Mantra --</option>
                        {mantras.map(m => (
                          <option key={m.id} value={m.id}>{m.title_hindi} - {m.title_english}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verse Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = await uploadImage(file, 'mantra-images', 'chalisa-verses');
                            if (imageUrl) {
                              const updated = [...chalisaVerses];
                              updated[index].verse_image = imageUrl;
                              setChalisaVerses(updated);
                            }
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        disabled={uploadingImage}
                      />
                      <div className="text-center text-gray-500 text-sm my-2">OR</div>
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        value={verse.verse_image || ''}
                        onChange={(e) => {
                          const updated = [...chalisaVerses];
                          updated[index].verse_image = e.target.value;
                          setChalisaVerses(updated);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                      {verse.verse_image && (
                        <img src={verse.verse_image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verse Text (Hindi)</label>
                      <textarea
                        value={verse.verse_text_hindi || verse.verse_text || ''}
                        onChange={(e) => {
                          const updated = [...chalisaVerses];
                          updated[index].verse_text_hindi = e.target.value;
                          setChalisaVerses(updated);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 h-20"
                        placeholder="श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verse Text (English)</label>
                      <textarea
                        value={verse.verse_text_english || ''}
                        onChange={(e) => {
                          const updated = [...chalisaVerses];
                          updated[index].verse_text_english = e.target.value;
                          setChalisaVerses(updated);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 h-20"
                        placeholder="With the dust of Guru's Lotus feet, I clean the mirror of my mind"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meaning (Hindi)</label>
                      <textarea
                        value={verse.meaning_hindi || ''}
                        onChange={(e) => {
                          const updated = [...chalisaVerses];
                          updated[index].meaning_hindi = e.target.value;
                          setChalisaVerses(updated);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 h-20"
                        placeholder="गुरु के चरण कमलों की धूलि से..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Meaning (English)</label>
                      <textarea
                        value={verse.meaning_english || ''}
                        onChange={(e) => {
                          const updated = [...chalisaVerses];
                          updated[index].meaning_english = e.target.value;
                          setChalisaVerses(updated);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 h-20"
                        placeholder="With the dust of Guru's Lotus feet..."
                      />
                    </div>
                    
                    <button
                      onClick={async () => {
                        const verseData = {
                          verse_number: index + 1,
                          verse_text_hindi: verse.verse_text_hindi || verse.verse_text,
                          verse_text_english: verse.verse_text_english,
                          meaning_hindi: verse.meaning_hindi,
                          meaning_english: verse.meaning_english,
                          mantra_id: verse.mantra_id,
                          verse_image: verse.verse_image
                        };
                        
                        if (verse.id) {
                          await supabase.from('chalisa_verses').update(verseData).eq('id', verse.id);
                        } else {
                          await supabase.from('chalisa_verses').insert(verseData);
                        }
                        showToast('✅ Verse saved!');
                        fetchChalisaVerses();
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg hover:from-red-600 hover:to-orange-600 font-semibold"
                    >
                      💾 Save Verse
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mantras Tab */}
        {activeTab === 'mantras' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mantra Management</h2>
              <button
                onClick={() => setShowMantraForm(true)}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 font-semibold"
              >
                + Add Mantra
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mantras.map((mantra) => (
                <div key={mantra.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {mantra.background_image && (
                    <div className="relative h-48 w-full">
                      <img 
                        src={mantra.background_image} 
                        alt={mantra.title_hindi}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => startEditMantra(mantra)}
                          className="bg-white/90 hover:bg-white text-blue-600 p-2 rounded-lg shadow-lg"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteMantra(mantra.id)}
                          className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-lg shadow-lg"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className={`w-12 h-12 ${mantra.color} rounded-lg flex items-center justify-center text-white text-2xl shadow-lg`}>
                          {mantra.icon}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!mantra.background_image && (
                    <div className={`relative h-48 w-full ${mantra.color} flex items-center justify-center`}>
                      <div className="text-6xl">{mantra.icon}</div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={() => startEditMantra(mantra)}
                          className="bg-white text-blue-600 p-2 rounded-lg shadow-lg"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteMantra(mantra.id)}
                          className="bg-white text-red-600 p-2 rounded-lg shadow-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-1 text-gray-800">
                      {mantra.title_hindi}
                    </h3>
                    <p className="text-sm mb-1 font-medium text-purple-600">
                      {mantra.subtitle_hindi}
                    </p>
                    <p className="text-xs mb-2 text-gray-500">
                      {mantra.title_english}
                    </p>
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {mantra.description_hindi}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500 pt-3 border-t">
                      <span className="bg-gray-100 px-2 py-1 rounded">{mantra.category}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{mantra.verses_hindi?.length || 0} verses</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Create/Edit Modal */}
      {(showCreateForm || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingUser ? 'Edit User' : 'Create New User'}
            </h2>
            
            <form onSubmit={editingUser ? updateUser : createUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={editingUser}
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={userFormData.full_name}
                  onChange={(e) => setUserFormData({...userFormData, full_name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  value={userFormData.user_type}
                  onChange={(e) => setUserFormData({...userFormData, user_type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                    setUserFormData({ email: "", password: "", user_type: "user", full_name: "" });
                  }}
                  className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mantra Create/Edit Modal */}
      {showMantraForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{editingMantra ? 'Edit Mantra' : 'Add New Mantra'}</h2>
            
            <form onSubmit={editingMantra ? updateMantra : createMantra} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title Hindi"
                  value={mantraFormData.title_hindi}
                  onChange={(e) => setMantraFormData({...mantraFormData, title_hindi: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Title English"
                  value={mantraFormData.title_english}
                  onChange={(e) => setMantraFormData({...mantraFormData, title_english: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Subtitle Hindi"
                  value={mantraFormData.subtitle_hindi}
                  onChange={(e) => setMantraFormData({...mantraFormData, subtitle_hindi: e.target.value})}
                  className="p-3 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Subtitle English"
                  value={mantraFormData.subtitle_english}
                  onChange={(e) => setMantraFormData({...mantraFormData, subtitle_english: e.target.value})}
                  className="p-3 border rounded-lg"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Description Hindi"
                  value={mantraFormData.description_hindi}
                  onChange={(e) => setMantraFormData({...mantraFormData, description_hindi: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Description English"
                  value={mantraFormData.description_english}
                  onChange={(e) => setMantraFormData({...mantraFormData, description_english: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Category"
                  value={mantraFormData.category}
                  onChange={(e) => setMantraFormData({...mantraFormData, category: e.target.value})}
                  className="p-3 border rounded-lg"
                  required
                />
                <select
                  value={mantraFormData.color}
                  onChange={(e) => setMantraFormData({...mantraFormData, color: e.target.value})}
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
                  value={mantraFormData.icon}
                  onChange={(e) => setMantraFormData({...mantraFormData, icon: e.target.value})}
                  className="p-3 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-3 border rounded-lg"
                    disabled={uploadingImage}
                  />
                  <div className="text-center text-gray-500">OR</div>
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    value={mantraFormData.background_image}
                    onChange={(e) => setMantraFormData({...mantraFormData, background_image: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                  {uploadingImage && (
                    <p className="text-sm text-blue-600">Uploading image...</p>
                  )}
                  {mantraFormData.background_image && (
                    <div className="mt-2">
                      <img 
                        src={mantraFormData.background_image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <textarea
                  placeholder="Verses Hindi (one per line)"
                  value={mantraFormData.verses_hindi}
                  onChange={(e) => setMantraFormData({...mantraFormData, verses_hindi: e.target.value})}
                  className="p-3 border rounded-lg h-32"
                  required
                />
                <textarea
                  placeholder="Verses English (one per line)"
                  value={mantraFormData.verses_english}
                  onChange={(e) => setMantraFormData({...mantraFormData, verses_english: e.target.value})}
                  className="p-3 border rounded-lg h-32"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 font-semibold"
                >
                  {editingMantra ? 'Update Mantra' : 'Add Mantra'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMantraForm(false);
                    setEditingMantra(null);
                    setMantraFormData({
                      title_hindi: "",
                      title_english: "",
                      subtitle_hindi: "",
                      subtitle_english: "",
                      description_hindi: "",
                      description_english: "",
                      verses_hindi: "",
                      verses_english: "",
                      category: "mantra",
                      color: "bg-orange-500",
                      icon: "🕉️",
                      background_image: ""
                    });
                  }}
                  className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}