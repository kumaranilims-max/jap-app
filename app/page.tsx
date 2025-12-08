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
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const savedLang = localStorage.getItem('language') as Language;
    
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      localStorage.setItem('language', 'en');
    }
    setUserName(name || email || 'User');
    fetchMantras();
    fetchTodayStats(userId);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language] || translations['en'];

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl md:text-2xl">
                🕉️
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">{t.appTitle}</h2>
                <p className="text-xs text-white/80 hidden md:block">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
              {/* Language Selector */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-full p-1">
                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-all ${
                    language === 'hi' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  हि
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-all ${
                    language === 'en' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/20'
                  }`}
                >
                  EN
                </button>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 md:py-3 rounded-full">
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold">{todayStats.totalCount}</div>
                  <div className="text-xs text-white/80">{todayStats.sessions} {t.sessions}</div>
                </div>
              </div>
              <Link
                href="/reports"
                className="px-3 md:px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all text-xs md:text-sm flex items-center gap-1"
              >
                📊 {language === 'hi' ? 'रिपोर्ट' : 'Reports'}
              </Link>
              <Link
                href="/login"
                onClick={() => localStorage.clear()}
                className="px-3 md:px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all text-xs md:text-sm"
              >
                {t.logout}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12 py-4 md:py-8">
          <div className="inline-block mb-4">
            <div className="text-5xl md:text-6xl mb-4 animate-pulse">🙏</div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 px-4">
            {t.heroTitle}
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-6 px-4">{t.heroSubtitle}</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>{mantras.length} {t.mantrasAvailable}</span>
            </div>
          </div>
        </div>

        {/* Mantras Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mantras.map((mantra, index) => (
            <Link
              key={mantra.id}
              href={`/mantra/counter?id=${mantra.id}&name=${encodeURIComponent(language === 'hi' ? mantra.title_hindi : mantra.title_english)}`}
              className="group block rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white transform hover:-translate-y-1"
            >
              {mantra.background_image ? (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={mantra.background_image} 
                    alt={mantra.title_hindi} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className={`absolute bottom-3 left-3 w-12 h-12 ${mantra.color || 'bg-white'} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {mantra.icon}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {mantra.category}
                  </div>
                </div>
              ) : (
                <div className={`relative h-48 ${mantra.color || 'bg-gradient-to-br from-orange-400 to-red-400'} flex items-center justify-center`}>
                  <div className="text-6xl">{mantra.icon}</div>
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {mantra.category}
                  </div>
                </div>
              )}
              
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors">
                  {language === 'hi' ? mantra.title_hindi : mantra.title_english}
                </h3>
                
                <p className="text-sm font-medium text-purple-600 mb-2">
                  {language === 'hi' ? mantra.subtitle_hindi : mantra.subtitle_english}
                </p>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {language === 'hi' ? mantra.description_hindi : mantra.description_english}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{t.startChanting}</span>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm">
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Simple Stats */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
            <div className="text-3xl mb-2">🙏</div>
            <div className="text-2xl font-bold text-gray-800">
              {mantras.length} {language === 'hi' ? 'मंत्र उपलब्ध' : 'Mantras Available'}
            </div>
            <div className="text-sm text-gray-600">
              {language === 'hi' ? 'आज' : 'Today'}: {todayStats.totalCount} {language === 'hi' ? 'जप पूर्ण' : 'Chants Completed'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}