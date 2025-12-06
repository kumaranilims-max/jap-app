"use client";
import { useState } from "react";
import Link from "next/link";

export default function MahabharataPage() {
  const [selectedParva, setSelectedParva] = useState(1);
  
  const parvas = [
    { number: 1, title: "आदिपर्व", description: "वंश की उत्पत्ति" },
    { number: 2, title: "सभापर्व", description: "राजसूय यज्ञ और द्यूत क्रीड़ा" },
    { number: 3, title: "वनपर्व", description: "पांडवों का वनवास" },
    { number: 4, title: "विराटपर्व", description: "अज्ञातवास" },
    { number: 5, title: "उद्योगपर्व", description: "युद्ध की तैयारी" },
    { number: 6, title: "भीष्मपर्व", description: "भीष्म पितामह का युद्ध" },
    { number: 7, title: "द्रोणपर्व", description: "गुरु द्रोण का युद्ध" },
    { number: 8, title: "कर्णपर्व", description: "कर्ण का युद्ध" },
    { number: 9, title: "शल्यपर्व", description: "शल्य का युद्ध" },
    { number: 10, title: "सौप्तिकपर्व", description: "रात्रि का आक्रमण" },
    { number: 11, title: "स्त्रीपर्व", description: "स्त्रियों का विलाप" },
    { number: 12, title: "शान्तिपर्व", description: "धर्म और राजनीति" },
    { number: 13, title: "अनुशासनपर्व", description: "भीष्म के उपदेश" },
    { number: 14, title: "आश्वमेधिकपर्व", description: "अश्वमेध यज्ञ" },
    { number: 15, title: "आश्रमवासिकपर्व", description: "वानप्रस्थ आश्रम" },
    { number: 16, title: "मौसलपर्व", description: "यादव वंश का नाश" },
    { number: 17, title: "महाप्रस्थानिकपर्व", description: "महाप्रस्थान" },
    { number: 18, title: "स्वर्गारोहणपर्व", description: "स्वर्गारोहण" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/" className="text-green-500 hover:text-green-600 mb-4 inline-block">
            ← वापस जाएं
          </Link>
          <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            ⚔️ महाभारत
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            महर्षि व्यास कृत • 18 पर्व • 1,00,000 श्लोक
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Parva List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">पर्व</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {parvas.map((parva) => (
                <button
                  key={parva.number}
                  onClick={() => setSelectedParva(parva.number)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedParva === parva.number
                      ? "bg-green-500 text-white"
                      : "bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium">{parva.title}</div>
                  <div className="text-sm opacity-75">{parva.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {parvas[selectedParva - 1]?.title}
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    🎵 सुनें
                  </button>
                  <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    📖 पढ़ें
                  </button>
                  {selectedParva === 6 && (
                    <Link href="/gita" className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                      🕉️ गीता
                    </Link>
                  )}
                </div>
              </div>

              {/* Sample Content */}
              <div className="border-l-4 border-green-500 pl-6 mb-6">
                <div className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {selectedParva === 1 && "कुरु वंश की उत्पत्ति और पांडवों का जन्म"}
                  {selectedParva === 2 && "युधिष्ठिर का राजसूय यज्ञ और द्यूत में पराजय"}
                  {selectedParva === 6 && "कुरुक्षेत्र युद्ध और भगवद्गीता"}
                  {selectedParva === 12 && "युधिष्ठिर को राजधर्म की शिक्षा"}
                  {selectedParva === 18 && "पांडवों का स्वर्गारोहण"}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedParva === 1 && "राजा शांतनु और गंगा से भीष्म का जन्म, धृतराष्ट्र और पांडु का जन्म, तथा कौरव और पांडव राजकुमारों की शिक्षा-दीक्षा का वर्णन।"}
                    {selectedParva === 2 && "युधिष्ठिर के राजसूय यज्ञ की तैयारी, शकुनि के साथ द्यूत क्रीड़ा में पांडवों की पराजय और द्रौपदी के चीरहरण का प्रसंग।"}
                    {selectedParva === 6 && "कुरुक्षेत्र के युद्ध की शुरुआत, अर्जुन का मोह और भगवान कृष्ण द्वारा दिया गया गीता का उपदेश। भीष्म पितामह का वीरगति को प्राप्त होना।"}
                    {selectedParva === 12 && "युद्ध के बाद युधिष्ठिर को राजधर्म, मोक्षधर्म और आपद्धर्म की शिक्षा। भीष्म पितामह के मुख से धर्म के सिद्धांतों का विस्तृत वर्णन।"}
                    {selectedParva === 18 && "पांडवों का राज्य त्याग, हिमालय की यात्रा और अंततः स्वर्गलोक में प्रवेश। धर्मराज युधिष्ठिर की अंतिम परीक्षा।"}
                  </p>
                </div>

                <div className="flex gap-4 text-sm">
                  <button className="flex items-center gap-1 text-green-500 hover:text-green-600">
                    🎵 श्लोक सुनें
                  </button>
                  <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                    📖 पूरा पर्व
                  </button>
                  <button className="flex items-center gap-1 text-purple-500 hover:text-purple-600">
                    💾 बुकमार्क
                  </button>
                </div>
              </div>

              {/* Special Features */}
              {selectedParva === 6 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    🕉️ विशेष: भगवद्गीता
                  </h4>
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    इस पर्व में भगवान कृष्ण द्वारा अर्जुन को दिया गया गीता का उपदेश है। यह हिंदू धर्म का सबसे महत्वपूर्ण ग्रंथ है।
                  </p>
                  <Link href="/gita" className="inline-block mt-2 text-orange-600 hover:text-orange-700 font-medium">
                    गीता पढ़ें →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}