"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function HanumanChalisa() {
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [currentVerse, setCurrentVerse] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [chalisaVerses, setChalisaVerses] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('chalisa-read-count');
    if (saved) setReadCount(parseInt(saved));
    fetchVerses();
  }, []);

  const fetchVerses = async () => {
    const { data } = await supabase.from('chalisa_verses').select('*').order('verse_number');
    if (data) setChalisaVerses(data);
  };

  const nextVerse = () => {
    if (currentVerse < chalisaVerses.length - 1) {
      setCurrentVerse(prev => prev + 1);
    } else {
      const newCount = readCount + 1;
      setReadCount(newCount);
      localStorage.setItem('chalisa-read-count', newCount.toString());
      setCurrentVerse(0);
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 flex items-center">
            ← {language === 'hindi' ? 'वापस' : 'Back'}
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'hindi'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'english'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <header className="text-center mb-12">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-4xl md:text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
            {language === 'hindi' ? 'हनुमान चालीसा' : 'Hanuman Chalisa'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            {language === 'hindi' ? 'श्री हनुमान जी की स्तुति' : 'Praise of Lord Hanuman'}
          </p>
          <p className="text-lg text-red-500 dark:text-red-400 font-medium">
            श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Reading Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'hindi' ? 'पाठ की संख्या' : 'Reading Count'}
            </h3>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {readCount}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'hindi' ? 'बार पूरा पाठ किया' : 'times completed'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {language === 'hindi' ? `श्लोक ${currentVerse + 1}` : `Verse ${currentVerse + 1}`}
              </h2>
              <span className="text-sm text-gray-500">
                {currentVerse + 1} / {chalisaVerses.length}
              </span>
            </div>
            
            {chalisaVerses.length > 0 && (
              <div className="mb-8">
                {chalisaVerses[currentVerse].verse_image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={chalisaVerses[currentVerse].verse_image} 
                      alt={`Verse ${currentVerse + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-4 whitespace-pre-line">
                      {language === 'hindi' 
                        ? chalisaVerses[currentVerse].verse_text_hindi 
                        : chalisaVerses[currentVerse].verse_text_english}
                    </p>
                    <div className="border-t pt-4">
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {language === 'hindi' 
                          ? chalisaVerses[currentVerse].meaning_hindi 
                          : chalisaVerses[currentVerse].meaning_english}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentVerse + 1) / chalisaVerses.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={nextVerse}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                {currentVerse === chalisaVerses.length - 1 
                  ? (language === 'hindi' ? 'पूर्ण' : 'Complete')
                  : (language === 'hindi' ? 'अगला' : 'Next')
                }
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'ऑडियो प्ले' : 'Audio Play'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? 'चालीसा सुनें' : 'Listen to Chalisa'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'प्रगति' : 'Progress'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {Math.round(((currentVerse + 1) / chalisaVerses.length) * 100)}% {language === 'hindi' ? 'पूर्ण' : 'Complete'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">🔔</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'दैनिक रिमाइंडर' : 'Daily Reminder'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? 'नियमित जप के लिए' : 'For regular chanting'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}