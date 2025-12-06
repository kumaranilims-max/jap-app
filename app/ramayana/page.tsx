"use client";
import { useState } from "react";
import Link from "next/link";

export default function RamayanaPage() {
  const [selectedKand, setSelectedKand] = useState(1);
  
  const kands = [
    { number: 1, title: "बालकाण्ड", description: "राम का जन्म और बचपन" },
    { number: 2, title: "अयोध्याकाण्ड", description: "राम का वनवास" },
    { number: 3, title: "अरण्यकाण्ड", description: "वन में निवास" },
    { number: 4, title: "किष्किन्धाकाण्ड", description: "हनुमान से मिलन" },
    { number: 5, title: "सुन्दरकाण्ड", description: "हनुमान की लंका यात्रा" },
    { number: 6, title: "युद्धकाण्ड", description: "रावण से युद्ध" },
    { number: 7, title: "उत्तरकाण्ड", description: "राम राज्य" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
            ← वापस जाएं
          </Link>
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            🏹 श्रीमद् रामायण
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            महर्षि वाल्मीकि कृत • 7 काण्ड • 24,000 श्लोक
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Kand List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">काण्ड</h3>
            <div className="space-y-2">
              {kands.map((kand) => (
                <button
                  key={kand.number}
                  onClick={() => setSelectedKand(kand.number)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedKand === kand.number
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="font-medium">{kand.title}</div>
                  <div className="text-sm opacity-75">{kand.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {kands[selectedKand - 1]?.title}
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    🎵 सुनें
                  </button>
                  <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    📖 पढ़ें
                  </button>
                </div>
              </div>

              {/* Sample Content */}
              <div className="border-l-4 border-blue-500 pl-6 mb-6">
                <div className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {selectedKand === 1 && "तपस्वी नारद मुनि से वाल्मीकि का संवाद"}
                  {selectedKand === 2 && "राम का राज्याभिषेक और वनवास"}
                  {selectedKand === 3 && "सीता हरण और जटायु वध"}
                  {selectedKand === 4 && "सुग्रीव से मित्रता और बाली वध"}
                  {selectedKand === 5 && "हनुमान की लंका यात्रा और सीता दर्शन"}
                  {selectedKand === 6 && "लंका युद्ध और रावण वध"}
                  {selectedKand === 7 && "राम का राज्याभिषेक और शासन"}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedKand === 1 && "महर्षि वाल्मीकि ने नारद मुनि से पूछा कि इस संसार में कौन सा व्यक्ति गुणवान, वीर, धर्मज्ञ और सत्यवादी है? नारद जी ने राम के गुणों का वर्णन किया।"}
                    {selectedKand === 2 && "राजा दशरथ ने राम को युवराज बनाने का निर्णय लिया, परंतु कैकेयी के वरदान के कारण राम को चौदह वर्ष का वनवास मिला।"}
                    {selectedKand === 3 && "वन में निवास के दौरान रावण ने छल से सीता का हरण किया। जटायु ने सीता की रक्षा का प्रयास किया परंतु रावण से युद्ध में वीरगति को प्राप्त हुआ।"}
                    {selectedKand === 4 && "राम ने सुग्रीव से मित्रता की और बाली का वध करके सुग्रीव को किष्किंधा का राजा बनाया।"}
                    {selectedKand === 5 && "हनुमान जी ने समुद्र पार करके लंका में सीता माता को खोजा और उनसे भेंट की। अशोक वाटिका में सीता को राम का संदेश दिया।"}
                    {selectedKand === 6 && "राम की सेना ने लंका पर आक्रमण किया। भीषण युद्ध के बाद राम ने रावण का वध किया और सीता को मुक्त कराया।"}
                    {selectedKand === 7 && "अयोध्या वापसी पर राम का राज्याभिषेक हुआ। राम राज्य की स्थापना हुई जहाँ प्रजा सुखी और समृद्ध थी।"}
                  </p>
                </div>

                <div className="flex gap-4 text-sm">
                  <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
                    🎵 श्लोक सुनें
                  </button>
                  <button className="flex items-center gap-1 text-green-500 hover:text-green-600">
                    📖 पूरा काण्ड
                  </button>
                  <button className="flex items-center gap-1 text-purple-500 hover:text-purple-600">
                    💾 बुकमार्क
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}