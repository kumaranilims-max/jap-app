"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/lib/translations";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const router = useRouter();
  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        alert(language === 'hi' ? '❌ यूजर नहीं मिला!' : '❌ User not found!');
        setLoading(false);
        return;
      }

      localStorage.setItem('userId', data.id);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.full_name || '');
      localStorage.setItem('userType', data.user_type || 'user');
      localStorage.setItem('language', language);
      
      alert(language === 'hi' ? '✅ लॉगिन सफल!' : '✅ Login successful!');
      router.push('/mantra');
    } catch (err) {
      alert(language === 'hi' ? '❌ लॉगिन में त्रुटि!' : '❌ Login error!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="flex bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${language === 'hi' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                हि
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${language === 'en' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                EN
              </button>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
            🕉️ {language === 'hi' ? 'लॉगिन करें' : 'Login'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {language === 'hi' ? 'मंत्र जप काउंटर में प्रवेश करें' : 'Enter Mantra Chanting Counter'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'ईमेल' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg disabled:opacity-50 text-base"
            >
              {loading ? (language === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging in...') : (language === 'hi' ? 'लॉगिन करें' : 'Login')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm sm:text-base text-orange-500 hover:text-orange-600">
              ← {language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs sm:text-sm text-blue-800">
            💡 <strong>{language === 'hi' ? 'टेस्ट के लिए:' : 'For testing:'}</strong> {language === 'hi' ? 'कोई भी ईमेल और पासवर्ड डालें' : 'Enter any email and password'}
          </p>
        </div>
      </div>
    </div>
  );
}
