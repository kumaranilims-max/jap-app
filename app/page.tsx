"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { translations, Language } from "@/lib/translations";

export default function Home() {
  const [mantras, setMantras] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [todayStats, setTodayStats] = useState({ sessions: 0, totalCount: 0 });
  const [language, setLanguage] = useState<Language>('hi');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const savedLang = localStorage.getItem('language') as Language;
    
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    
    if (savedLang) setLanguage(savedLang);
    setUserName(name || email || 'User');
    fetchMantras();
    fetchTodayStats(userId);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language];

  const fetchMantras = async () => {
    const { data } = await supabase.from('mantras').select('*');
    if (data) setMantras(data);
  };

  const fetchTodayStats = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('mantra_sessions')
      .select('count')
      .eq('user_id', userId)
      .eq('session_date', today);
    
    if (data) {
      const sessions = data.length;
      const totalCount = data.reduce((sum, s) => sum + s.count, 0);
      setTodayStats({ sessions, totalCount });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl">
                🕉️
              </div>
              <div>
                <h2 className="text-xl font-bold">{t.appTitle}</h2>
                <p className="text-xs text-white/80">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-full p-1">
                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    language === 'hi' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  हि
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    language === 'en' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  EN
                </button>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-full">
                <div className="text-center">
                  <div className="text-2xl font-bold">{todayStats.totalCount}</div>
                  <div className="text-xs text-white/80">{t.todayChants} ({todayStats.sessions} {t.sessions})</div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-medium">👤 {userName}</span>
              </div>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 py-8">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-4 animate-pulse">🙏</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
            {t.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{t.heroSubtitle}</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{mantras.length} {t.mantrasAvailable}</span>
            </div>
          </div>
        </div>

        {/* Mantras Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mantras.map((mantra, index) => (
            <Link
              key={mantra.id}
              href={`/mantra/counter?id=${mantra.id}&name=${encodeURIComponent(language === 'hi' ? mantra.title_hindi : mantra.title_english)}`}
              className="group block rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {mantra.background_image ? (
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={mantra.background_image} 
                    alt={mantra.title_hindi} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className={`absolute bottom-4 left-4 w-16 h-16 ${mantra.color} rounded-2xl flex items-center justify-center text-3xl shadow-2xl group-hover:scale-110 transition-transform`}>
                    {mantra.icon}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {mantra.category}
                  </div>
                </div>
              ) : (
                <div className={`relative h-56 ${mantra.color} flex items-center justify-center overflow-hidden`}>
                  <div className="text-7xl group-hover:scale-125 transition-transform duration-500">{mantra.icon}</div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {mantra.category}
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors">
                  {language === 'hi' ? mantra.title_hindi : mantra.title_english}
                </h3>
                <p className="text-sm font-semibold text-purple-600 mb-3">
                  {language === 'hi' ? mantra.subtitle_hindi : mantra.subtitle_english}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {language === 'hi' ? mantra.description_hindi : mantra.description_english}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">{t.startChanting}</span>
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🔢</div>
            <h4 className="font-bold text-gray-800 mb-2">{t.counter}</h4>
            <p className="text-sm text-gray-600">{t.counterDesc}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">💾</div>
            <h4 className="font-bold text-gray-800 mb-2">{t.autoSave}</h4>
            <p className="text-sm text-gray-600">{t.autoSaveDesc}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="font-bold text-gray-800 mb-2">{t.reports}</h4>
            <p className="text-sm text-gray-600">{t.reportsDesc}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold text-gray-800 mb-2">{t.goal}</h4>
            <p className="text-sm text-gray-600">{t.goalDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
