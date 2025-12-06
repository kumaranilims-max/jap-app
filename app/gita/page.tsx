"use client";
import { useState } from "react";
import Link from "next/link";

export default function GitaPage() {
  const [selectedChapter, setSelectedChapter] = useState(1);
  
  const chapters = Array.from({length: 18}, (_, i) => ({
    number: i + 1,
    title: `अध्याय ${i + 1}`,
    verses: i === 0 ? 47 : i === 1 ? 72 : 43 // Sample verse counts
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 mb-4 inline-block">
            ← वापस जाएं
          </Link>
          <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            🕉️ श्रीमद् भगवद्गीता
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            कृष्ण और अर्जुन का संवाद • 18 अध्याय • 700 श्लोक
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chapter List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">अध्याय</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chapters.map((chapter) => (
                <button
                  key={chapter.number}
                  onClick={() => setSelectedChapter(chapter.number)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedChapter === chapter.number
                      ? "bg-orange-500 text-white"
                      : "bg-white dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium">{chapter.title}</div>
                  <div className="text-sm opacity-75">{chapter.verses} श्लोक</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  अध्याय {selectedChapter}
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                    🎵 सुनें
                  </button>
                  <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    📝 नोट्स
                  </button>
                </div>
              </div>

              {/* Sample Verse */}
              <div className="border-l-4 border-orange-500 pl-6 mb-6">
                <div className="text-2xl font-bold text-gray-800 dark:text-white mb-4 leading-relaxed">
                  धृतराष्ट्र उवाच।<br/>
                  धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।<br/>
                  मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥१॥
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">अनुवाद:</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    धृतराष्ट्र ने कहा: हे संजय! धर्मभूमि कुरुक्षेत्र में एकत्रित होकर युद्ध की इच्छा वाले मेरे और पांडु के पुत्रों ने क्या किया?
                  </p>
                </div>

                <div className="flex gap-4 text-sm">
                  <button className="flex items-center gap-1 text-orange-500 hover:text-orange-600">
                    🎵 श्लोक सुनें
                  </button>
                  <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                    📖 व्याख्या
                  </button>
                  <button className="flex items-center gap-1 text-green-500 hover:text-green-600">
                    💾 सेव करें
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t">
                <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                  ← पिछला श्लोक
                </button>
                <span className="text-gray-600 dark:text-gray-400">श्लोक 1 / 47</span>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  अगला श्लोक →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}