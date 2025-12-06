"use client";
import { useState } from "react";
import Link from "next/link";

export default function RadhaJap() {
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [japCount, setJapCount] = useState(0);

  const radhaMantra = [
    {
      hindi: "राधे राधे राधे श्याम",
      english: "Radhe Radhe Radhe Shyam",
      meaning: language === 'hindi' ? 'राधा और कृष्ण का नाम स्मरण' : 'Remembrance of Radha and Krishna'
    },
    {
      hindi: "राधे कृष्ण राधे कृष्ण",
      english: "Radhe Krishna Radhe Krishna", 
      meaning: language === 'hindi' ? 'दिव्य युगल का जप' : 'Chanting of divine couple'
    },
    {
      hindi: "हरे राधे हरे कृष्ण",
      english: "Hare Radhe Hare Krishna",
      meaning: language === 'hindi' ? 'राधा कृष्ण महामंत्र' : 'Radha Krishna Mahamantra'
    }
  ];

  const incrementJap = () => {
    setJapCount(prev => prev + 1);
  };

  const resetJap = () => {
    setJapCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-purple-500 hover:text-purple-600 flex items-center">
            ← {language === 'hindi' ? 'वापस' : 'Back'}
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'hindi'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'english'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <header className="text-center mb-12">
          <div className="text-6xl mb-4">💖</div>
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            {language === 'hindi' ? 'राधा जप' : 'Radha Jap'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            {language === 'hindi' ? 'राधा रानी का नाम स्मरण' : 'Remembrance of Radha Rani'}
          </p>
          <p className="text-lg text-purple-500 dark:text-purple-400 font-medium">
            राधे राधे राधे श्याम, राधे राधे राधे श्याम।
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Jap Counter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'hindi' ? 'जप काउंटर' : 'Jap Counter'}
            </h2>
            <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-6">
              {japCount}
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={incrementJap}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {language === 'hindi' ? 'जप करें' : 'Chant'}
              </button>
              <button
                onClick={resetJap}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                {language === 'hindi' ? 'रीसेट' : 'Reset'}
              </button>
            </div>
          </div>

          {/* Mantras */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
              {language === 'hindi' ? 'राधा मंत्र' : 'Radha Mantras'}
            </h2>
            
            {radhaMantra.map((mantra, index) => (
              <div key={index} className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    {mantra.hindi}
                  </p>
                  {language === 'english' && (
                    <p className="text-xl text-purple-600 dark:text-purple-400 mb-2">
                      {mantra.english}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {mantra.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">📿</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'माला जप' : 'Mala Chanting'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? '108 बार जप करें' : 'Chant 108 times'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'भजन सुनें' : 'Listen Bhajans'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? 'राधा कृष्ण भजन' : 'Radha Krishna bhajans'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">🌅</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'प्रातः स्मरण' : 'Morning Prayer'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? 'सुबह का जप' : 'Morning chanting'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}