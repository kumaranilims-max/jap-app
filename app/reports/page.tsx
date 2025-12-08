"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/lib/translations";

export default function ReportsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [language, setLanguage] = useState<Language>('hi');
  const [stats, setStats] = useState({ totalSessions: 0, totalCount: 0, totalDuration: 0 });
  const [lifetimeStats, setLifetimeStats] = useState<any>({});
  const [mantrasMap, setMantrasMap] = useState<any>({});

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const savedLang = localStorage.getItem('language') as Language;
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    if (savedLang) setLanguage(savedLang);
    loadMantras();
    loadSessions();
    loadLifetimeStats();
  }, [filter, startDate, endDate]);

  const t = translations[language];

  const loadMantras = async () => {
    const { data } = await supabase.from('mantras').select('*');
    if (data) {
      const map: any = {};
      data.forEach(m => {
        map[m.id] = m;
      });
      setMantrasMap(map);
    }
  };

  const loadLifetimeStats = async () => {
    const userId = localStorage.getItem('userId');
    const { data } = await supabase
      .from('mantra_sessions')
      .select('*')
      .eq('user_id', userId);

    if (data) {
      const grouped: any = {};
      data.forEach(s => {
        const key = s.mantra_id || s.mantra_name;
        if (!grouped[key]) {
          grouped[key] = { count: 0, sessions: 0, name: s.mantra_name };
        }
        grouped[key].count += s.count;
        grouped[key].sessions += 1;
      });
      setLifetimeStats(grouped);
    }
  };

  const getDateRange = () => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (filter === 'today') {
      start = today;
      end = today;
    } else if (filter === 'week') {
      start.setDate(today.getDate() - 7);
    } else if (filter === 'month') {
      start.setDate(today.getDate() - 30);
    } else if (filter === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const loadSessions = async () => {
    const userId = localStorage.getItem('userId');
    const { start, end } = getDateRange();

    const { data } = await supabase
      .from('mantra_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', start)
      .lte('session_date', end)
      .order('session_date', { ascending: false });

    if (data) {
      setSessions(data);
      const totalSessions = data.length;
      const totalCount = data.reduce((sum, s) => sum + s.count, 0);
      const totalDuration = data.reduce((sum, s) => sum + s.duration, 0);
      setStats({ totalSessions, totalCount, totalDuration });
    }
  };

  const groupByMantra = () => {
    const grouped: any = {};
    sessions.forEach(s => {
      const key = s.mantra_id || s.mantra_name;
      if (!grouped[key]) {
        grouped[key] = { count: 0, sessions: 0, duration: 0, name: s.mantra_name };
      }
      grouped[key].count += s.count;
      grouped[key].sessions += 1;
      grouped[key].duration += s.duration;
    });
    return grouped;
  };

  const mantraStats = groupByMantra();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-3 text-sm md:text-base">
            <span>←</span> <span>{language === 'hi' ? 'वापस जाएं' : 'Back'}</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-1">📊 {language === 'hi' ? 'रिपोर्ट' : 'Reports'}</h1>
              <p className="text-white/80 text-sm md:text-base">{language === 'hi' ? 'अपनी जप यात्रा देखें' : 'View Your Chanting Journey'}</p>
            </div>
            <div className="text-4xl md:text-5xl">📈</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Lifetime Stats */}
        {Object.keys(lifetimeStats).length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 border-2 border-orange-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>{language === 'hi' ? 'कुल जीवनकाल आंकड़े' : 'Lifetime Total'}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(lifetimeStats).map(([id, data]: [string, any]) => {
                const mantra = mantrasMap[id];
                const displayName = mantra ? (language === 'hi' ? mantra.title_hindi : mantra.title_english) : data.name;
                return (
                <div key={id} className="bg-white p-4 rounded-xl border-2 border-orange-300 shadow-md">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">{displayName}</h3>
                  <div className="text-3xl font-black text-orange-600 mb-1">{data.count.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">{data.sessions} {language === 'hi' ? 'सत्र' : 'sessions'}</div>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">{language === 'hi' ? 'समय अवधि चुनें' : 'Select Time Period'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => setFilter('today')}
              className={`py-2 md:py-3 px-3 md:px-4 rounded-xl font-semibold transition-all text-sm md:text-base ${
                filter === 'today'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 {language === 'hi' ? 'आज' : 'Today'}
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`py-2 md:py-3 px-3 md:px-4 rounded-xl font-semibold transition-all text-sm md:text-base ${
                filter === 'week'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📆 {language === 'hi' ? 'सप्ताह' : 'Week'}
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`py-2 md:py-3 px-3 md:px-4 rounded-xl font-semibold transition-all text-sm md:text-base ${
                filter === 'month'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🗓️ {language === 'hi' ? 'महीना' : 'Month'}
            </button>
            <button
              onClick={() => setFilter('custom')}
              className={`py-2 md:py-3 px-3 md:px-4 rounded-xl font-semibold transition-all text-sm md:text-base ${
                filter === 'custom'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔍 {language === 'hi' ? 'कस्टम' : 'Custom'}
            </button>
          </div>

          {filter === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{language === 'hi' ? 'शुरुआत तिथि' : 'Start Date'}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{language === 'hi' ? 'अंतिम तिथि' : 'End Date'}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm md:text-base"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg p-5 md:p-6 text-center border border-orange-100">
            <div className="text-4xl mb-2">🔢</div>
            <div className="text-3xl font-black text-orange-600">{stats.totalCount}</div>
            <div className="text-xs font-semibold text-gray-600 mt-1">{language === 'hi' ? 'जप' : 'Jap'}</div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-5 md:p-6 text-center border border-purple-100">
            <div className="text-4xl mb-2">📿</div>
            <div className="text-3xl font-black text-purple-600">{Math.floor(stats.totalCount / 108)}</div>
            <div className="text-xs font-semibold text-gray-600 mt-1">{language === 'hi' ? 'माला' : 'Malas'}</div>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-5 md:p-6 text-center border border-blue-100">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-black text-blue-600">{stats.totalSessions}</div>
            <div className="text-xs font-semibold text-gray-600 mt-1">{language === 'hi' ? 'सत्र' : 'Sessions'}</div>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-5 md:p-6 text-center border border-green-100">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl font-black text-green-600">{Math.floor(stats.totalDuration / 60)}</div>
            <div className="text-xs font-semibold text-gray-600 mt-1">{language === 'hi' ? 'मिनट' : 'Min'}</div>
          </div>
        </div>

        {/* Mantra-wise Stats */}
        {Object.keys(mantraStats).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📊 {language === 'hi' ? 'मंत्र अनुसार आंकड़े' : 'Mantra-wise Statistics'}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(mantraStats).map(([id, data]: [string, any]) => {
                const mantra = mantrasMap[id];
                const displayName = mantra ? (language === 'hi' ? mantra.title_hindi : mantra.title_english) : data.name;
                return (
                <div key={id} className="p-5 rounded-2xl border-2 shadow-md" style={{background: 'linear-gradient(to bottom right, #FAFA33, #F5F520)', borderColor: '#F0F010'}}>
                  <h3 className="font-bold text-gray-800 text-base mb-4">{displayName}</h3>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center bg-white rounded-xl p-3 shadow-sm">
                      <div className="text-2xl font-black text-orange-600">{data.count}</div>
                      <div className="text-xs font-semibold text-gray-600 mt-1">{language === 'hi' ? 'जप' : 'Jap'}</div>
                    </div>
                    <div className="text-center bg-white rounded-xl p-3 shadow-sm">
                      <div className="text-2xl font-black text-purple-600">{Math.floor(data.count / 108)}</div>
                      <div className="text-xs font-semibold text-gray-600 mt-1">{language === 'hi' ? 'माला' : 'Malas'}</div>
                    </div>
                    <div className="text-center bg-white rounded-xl p-3 shadow-sm">
                      <div className="text-2xl font-black text-blue-600">{data.sessions}</div>
                      <div className="text-xs font-semibold text-gray-600 mt-1">{language === 'hi' ? 'सत्र' : 'Sessions'}</div>
                    </div>
                  </div>
                  <div className="text-center text-sm font-semibold text-gray-700 bg-white rounded-xl p-3 shadow-sm">
                    ⏱️ {Math.floor(data.duration / 60)} {language === 'hi' ? 'मिनट' : 'min'}
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* All Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">{language === 'hi' ? 'सभी सत्र' : 'All Sessions'}</h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-2">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{session.mantra_name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{session.session_date} • {session.session_time}</p>
                  </div>
                  <div className="bg-orange-100 px-3 py-1 rounded-full">
                    <span className="text-xl font-black text-orange-600">{session.count}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-600 bg-white px-3 py-2 rounded-lg inline-block">
                  ⏱️ {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
