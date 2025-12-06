"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase, type Mantra } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export default function MantraPage() {
  const params = useParams();
  const [mantra, setMantra] = useState<Mantra | null>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [japCount, setJapCount] = useState(0);
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      checkUser();
      fetchMantra(params.id as string);
    }
  }, [params.id]);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser && params.id) {
      loadJapProgress(params.id as string, currentUser.id);
    } else {
      loadJapCount(params.id as string);
    }
  };

  const fetchMantra = async (id: string) => {
    const { data } = await supabase
      .from('mantras')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) setMantra(data);
  };

  const loadJapCount = (id: string) => {
    const saved = localStorage.getItem(`mantra-${id}-count`);
    if (saved) setJapCount(parseInt(saved));
  };

  const loadJapProgress = async (mantraId: string, userId: string) => {
    const { data } = await supabase
      .from('user_jap_progress')
      .select('total_count')
      .eq('user_id', userId)
      .eq('mantra_id', mantraId)
      .single();
    
    if (data) {
      setJapCount(data.total_count);
    }
  };

  const incrementJap = async () => {
    const newCount = japCount + 1;
    setJapCount(newCount);
    
    if (user) {
      // Save to database for logged-in users
      await supabase
        .from('user_jap_progress')
        .upsert({
          user_id: user.id,
          mantra_id: parseInt(params.id as string),
          total_count: newCount,
          last_chanted: new Date().toISOString()
        });
    } else {
      // Save to localStorage for guests
      localStorage.setItem(`mantra-${params.id}-count`, newCount.toString());
    }
  };

  const nextVerse = async () => {
    const verses = language === 'hindi' ? mantra?.verses_hindi : mantra?.verses_english;
    if (mantra && verses && currentVerse < verses.length - 1) {
      setCurrentVerse(prev => prev + 1);
    } else {
      await incrementJap();
      setCurrentVerse(0);
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(prev => prev - 1);
    }
  };

  if (!mantra) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 relative"
      style={{
        backgroundImage: mantra?.background_image ? `url(${mantra.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {mantra?.background_image && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 flex items-center">
            ← {language === 'hindi' ? 'वापस' : 'Back'}
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'hindi'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'english'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <header className="text-center mb-12">
          <div className="text-6xl mb-4">{mantra.icon}</div>
          <h1 className="text-4xl md:text-6xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            {language === 'hindi' ? mantra.title_hindi : mantra.title_english}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            {language === 'hindi' ? mantra.description_hindi : mantra.description_english}
          </p>
          <p className="text-lg text-orange-500 dark:text-orange-400 font-medium">
            {language === 'hindi' ? mantra.subtitle_hindi : mantra.subtitle_english}
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Jap Counter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'hindi' ? 'जप संख्या' : 'Jap Count'}
            </h3>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {japCount}
            </div>
            {user ? (
              <p className="text-sm text-green-600 mb-4">
                ✓ {language === 'hindi' ? 'आपका प्रोग्रेस सेव हो रहा है' : 'Your progress is being saved'}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-4">
                {language === 'hindi' ? 'लॉगिन करें प्रोग्रेस सेव करने के लिए' : 'Login to save progress'}
              </p>
            )}
            <button
              onClick={incrementJap}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {language === 'hindi' ? 'जप करें' : 'Chant'}
            </button>
          </div>

          {/* Current Verse */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {language === 'hindi' ? `श्लोक ${currentVerse + 1}` : `Verse ${currentVerse + 1}`}
              </h2>
              <span className="text-sm text-gray-500">
                {currentVerse + 1} / {(language === 'hindi' ? mantra.verses_hindi : mantra.verses_english)?.length || 0}
              </span>
            </div>
            
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-semibold text-orange-700 dark:text-orange-300 mb-4">
                  {language === 'hindi' 
                    ? mantra.verses_hindi?.[currentVerse] 
                    : mantra.verses_english?.[currentVerse] || mantra.verses_hindi?.[currentVerse]
                  }
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevVerse}
                disabled={currentVerse === 0}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all"
              >
                {language === 'hindi' ? 'पिछला' : 'Previous'}
              </button>
              
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentVerse + 1) / ((language === 'hindi' ? mantra.verses_hindi : mantra.verses_english)?.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={nextVerse}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              >
                {currentVerse === ((language === 'hindi' ? mantra.verses_hindi : mantra.verses_english)?.length || 1) - 1 
                  ? (language === 'hindi' ? 'पूर्ण' : 'Complete')
                  : (language === 'hindi' ? 'अगला' : 'Next')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}