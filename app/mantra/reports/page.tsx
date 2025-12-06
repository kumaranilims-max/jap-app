"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportsPage() {
  const [view, setView] = useState<"daily" | "weekly" | "monthly" | "custom">("daily");
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadAllSessions = async () => {
    const userId = localStorage.getItem('userId') || 'guest';
    const response = await fetch(`/api/mantra-sessions?userId=${userId}`);
    const data = await response.json();
    if (data.sessions) {
      setAllSessions(data.sessions.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    setIsLoading(false);
    loadAllSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl text-gray-600">लोड हो रहा है...</div>
        </div>
      </div>
    );
  }

  const getFilteredSessions = () => {
    const now = new Date();
    let filtered = allSessions;

    if (view === "daily") {
      const today = now.toISOString().split('T')[0];
      filtered = allSessions.filter(s => s.session_date === today);
    } else if (view === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      filtered = allSessions.filter(s => s.session_date >= weekAgo);
    } else if (view === "monthly") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      filtered = allSessions.filter(s => s.session_date >= monthAgo);
    } else if (view === "custom" && startDate && endDate) {
      filtered = allSessions.filter(s => s.session_date >= startDate && s.session_date <= endDate);
    }

    return filtered;
  };

  const sessions = getFilteredSessions();
  const totalCount = sessions.reduce((sum, s) => sum + s.count, 0);
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgPerSession = sessions.length > 0 ? Math.round(totalCount / sessions.length) : 0;

  const mantraStats = sessions.reduce((acc: any, s) => {
    if (!acc[s.mantra_name]) {
      acc[s.mantra_name] = { count: 0, sessions: 0 };
    }
    acc[s.mantra_name].count += s.count;
    acc[s.mantra_name].sessions += 1;
    return acc;
  }, {});

  const dailyStats = sessions.reduce((acc: any, s) => {
    const date = s.session_date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += s.count;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/mantra" className="text-orange-500 hover:text-orange-600 mb-4 inline-block">
            ← वापस जाएं
          </Link>
          <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            📊 जप रिपोर्ट
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            अपनी प्रगति देखें और विश्लेषण करें
          </p>
        </header>

        {/* View Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setView("daily")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                view === "daily"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              📅 दैनिक
            </button>
            <button
              onClick={() => setView("weekly")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                view === "weekly"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              📆 साप्ताहिक
            </button>
            <button
              onClick={() => setView("monthly")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                view === "monthly"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              📊 मासिक
            </button>
            <button
              onClick={() => setView("custom")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                view === "custom"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              🗓️ कस्टम
            </button>
          </div>

          {view === "custom" && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  शुरुआत तिथि
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  अंतिम तिथि
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">🔢</div>
            <div className="text-3xl font-bold mb-1">{totalCount}</div>
            <div className="text-orange-100">कुल जप</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold mb-1">{sessions.length}</div>
            <div className="text-blue-100">कुल सत्र</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold mb-1">{avgPerSession}</div>
            <div className="text-green-100">औसत प्रति सत्र</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl font-bold mb-1">{Math.floor(totalDuration / 60)}</div>
            <div className="text-purple-100">कुल मिनट</div>
          </div>
        </div>

        {/* Mantra-wise Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            मंत्र अनुसार आंकड़े
          </h3>
          <div className="space-y-4">
            {Object.entries(mantraStats).map(([name, stats]: [string, any]) => (
              <div key={name} className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white">{name}</h4>
                  <span className="text-2xl font-bold text-orange-600">{stats.count}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{stats.sessions} सत्र</span>
                  <span>औसत: {Math.round(stats.count / stats.sessions)} प्रति सत्र</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(stats.count / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            दिन अनुसार विवरण
          </h3>
          <div className="space-y-3">
            {Object.entries(dailyStats).map(([date, count]: [string, any]) => (
              <div key={date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium text-gray-800 dark:text-white">{date}</span>
                <span className="text-xl font-bold text-orange-600">{count} जप</span>
              </div>
            ))}
          </div>
        </div>

        {/* All Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            सभी सत्र
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {session.mantra_name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {session.session_date} {session.session_time}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {session.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')} मिनट
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}