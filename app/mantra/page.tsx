"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MantraPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mantras, setMantras] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    setUserEmail(name || email || 'User');
    fetchMantras();
  }, []);

  const fetchMantras = async () => {
    const { data } = await supabase.from('mantras').select('*');
    console.log('Fetched mantras:', data);
    if (data) {
      data.forEach(m => {
        console.log(`${m.title_hindi} - background_image:`, m.background_image);
      });
      setMantras(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <div className="text-xl text-gray-600">लोड हो रहा है...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-orange-500 hover:text-orange-600">
              ← मुख्य पृष्ठ
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">
                👤 {userEmail}
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('userId');
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('userType');
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                🙏 मंत्र जप काउंटर
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                अपने दैनिक मंत्र जप को ट्रैक करें
              </p>
            </div>
            <Link 
              href="/mantra/reports"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              📊 रिपोर्ट देखें
            </Link>
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mantras.map((mantra) => (
            <Link
              key={mantra.id}
              href={`/mantra/counter?id=${mantra.id}&name=${encodeURIComponent(mantra.title_hindi)}`}
              className="group block rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-white"
            >
              {mantra.background_image && (
                <>
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{
                      backgroundImage: `url(${mantra.background_image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/50"></div>
                </>
              )}
              
              <div className={`${mantra.color} h-2 relative z-10`}></div>
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${mantra.color} rounded-full flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {mantra.icon || '🕉️'}
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/90 text-gray-800 shadow-sm">
                    {mantra.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {mantra.title_hindi}
                </h3>
                
                <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-gray-600">
                  {mantra.subtitle_hindi || mantra.description_hindi}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    जप शुरू करें
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform text-xl text-orange-500">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            📱 फीचर्स
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🔢</div>
              <h4 className="font-semibold text-gray-800 dark:text-white">काउंटर</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">टैप करके गिनें</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">💾</div>
              <h4 className="font-semibold text-gray-800 dark:text-white">ऑटो सेव</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">डेटाबेस में सेव</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-800 dark:text-white">रिपोर्ट</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">दैनिक/साप्ताहिक/मासिक</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-800 dark:text-white">लक्ष्य</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">108, 1008, कस्टम</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
