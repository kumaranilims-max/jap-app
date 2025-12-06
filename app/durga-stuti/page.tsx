"use client";
import { useState } from "react";
import Link from "next/link";

export default function DurgaStuti() {
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');

  const durgaVerses = [
    {
      hindi: "सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके।",
      english: "O Goddess, You are the auspicious one among all auspicious things",
      hindi2: "शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते।।",
      english2: "O three-eyed Gauri, refuge of all, salutations to You, O Narayani."
    },
    {
      hindi: "या देवी सर्वभूतेषु शक्ति रूपेण संस्थिता।",
      english: "The Goddess who resides in all beings in the form of power",
      hindi2: "नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः।।",
      english2: "Salutations to Her, salutations to Her, salutations to Her again and again."
    },
    {
      hindi: "या देवी सर्वभूतेषु माता रूपेण संस्थिता।",
      english: "The Goddess who resides in all beings in the form of mother",
      hindi2: "नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः।।",
      english2: "Salutations to Her, salutations to Her, salutations to Her again and again."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-pink-500 hover:text-pink-600 flex items-center">
            ← {language === 'hindi' ? 'वापस' : 'Back'}
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'hindi'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-4 py-2 rounded-md transition-all ${
                language === 'english'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <header className="text-center mb-12">
          <div className="text-6xl mb-4">🌺</div>
          <h1 className="text-4xl md:text-6xl font-bold text-pink-600 dark:text-pink-400 mb-4">
            {language === 'hindi' ? 'जय माँ दुर्गा' : 'Jai Ma Durga'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            {language === 'hindi' ? 'माँ दुर्गा की स्तुति' : 'Praise of Goddess Durga'}
          </p>
          <p className="text-lg text-pink-500 dark:text-pink-400 font-medium">
            सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके।
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
              {language === 'hindi' ? 'दुर्गा स्तुति' : 'Durga Stuti'}
            </h2>
            
            {durgaVerses.map((verse, index) => (
              <div key={index} className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <div className="text-center">
                  <p className="text-xl font-semibold text-pink-700 dark:text-pink-300 mb-2">
                    {verse.hindi}
                  </p>
                  <p className="text-xl font-semibold text-pink-700 dark:text-pink-300 mb-4">
                    {verse.hindi2}
                  </p>
                  {language === 'english' && (
                    <div className="border-t pt-4">
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                        {verse.english}
                      </p>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        {verse.english2}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'आरती सुनें' : 'Listen Aarti'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? 'माँ दुर्गा की आरती' : 'Durga Ma Aarti'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">🔥</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'नवरात्रि व्रत' : 'Navratri Vrat'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? '9 दिन का व्रत' : '9 days fasting'}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-3xl mb-3">🌸</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                {language === 'hindi' ? 'मंत्र जप' : 'Mantra Chanting'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'hindi' ? 'दुर्गा मंत्र का जप' : 'Chant Durga mantras'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}