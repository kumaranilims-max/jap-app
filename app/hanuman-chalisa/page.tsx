"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function HanumanChalisa() {
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [currentVerse, setCurrentVerse] = useState(0);
  const [readCount, setReadCount] = useState(0);

  const chalisaVerses = [
    {
      hindi: "श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।",
      english: "With the dust of Guru's Lotus feet, I clean the mirror of my mind",
      hindi2: "बरनऊं रघुबर बिमल जसु, जो दायकु फल चारि।।",
      english2: "And narrate the pure fame of Raghubar, which bestows the four fruits of life."
    },
    {
      hindi: "बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।",
      english: "Knowing myself to be ignorant, I urge you, O Hanuman",
      hindi2: "बल बुद्धि बिद्या देहु मोहिं, हरहु कलेस बिकार।।",
      english2: "Give me strength, wisdom and knowledge, removing all my sufferings and blemishes."
    },
    {
      hindi: "जय हनुमान ज्ञान गुन सागर।",
      english: "Victory to Hanuman, Ocean of wisdom and virtue",
      hindi2: "जय कपीस तिहुं लोक उजागर।।",
      english2: "Victory to the Monkey Lord, illuminator of the three worlds."
    },
    {
      hindi: "राम दूत अतुलित बल धामा।",
      english: "You are Ram's messenger, and the abode of matchless power",
      hindi2: "अंजनि-पुत्र पवनसुत नामा।।",
      english2: "You are known as the son of Anjani and Pavana (Wind-God)."
    },
    {
      hindi: "महाबीर बिक्रम बजरंगी।",
      english: "O great brave warrior, you are as strong as a thunderbolt",
      hindi2: "कुमति निवार सुमति के संगी।।",
      english2: "You remove evil thoughts and are the companion of good sense."
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('chalisa-read-count');
    if (saved) setReadCount(parseInt(saved));
  }, []);

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
            
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-2">
                  {chalisaVerses[currentVerse].hindi}
                </p>
                <p className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-4">
                  {chalisaVerses[currentVerse].hindi2}
                </p>
                {language === 'english' && (
                  <div className="border-t pt-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                      {chalisaVerses[currentVerse].english}
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {chalisaVerses[currentVerse].english2}
                    </p>
                  </div>
                )}
              </div>
            </div>

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