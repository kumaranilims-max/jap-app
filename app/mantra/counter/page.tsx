"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { translations, Language } from "@/lib/translations";

function CounterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mantraName = searchParams.get("name") || "मंत्र";
  const mantraId = searchParams.get("id") || "1";

  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(108);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState<any>(null);
  const [analyser, setAnalyser] = useState<any>(null);
  const [mediaStream, setMediaStream] = useState<any>(null);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [chalisaVerses, setChalisaVerses] = useState<any[]>([]);
  
  const loadChalisaVerses = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('chalisa_verses')
        .select('*')
        .eq('mantra_id', mantraId)
        .order('verse_number', { ascending: true });
      
      if (error) {
        console.error('Load verses error:', error);
      } else if (data && data.length > 0) {
        setChalisaVerses(data.map(v => ({
          verse: v.verse_text_hindi || v.verse_text,
          meaning: v.meaning_hindi,
          image: v.verse_image
        })));
      }
    } catch (err) {
      console.error('Load verses error:', err);
    }
  };

  const loadTodaySessions = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const today = new Date().toISOString().split('T')[0];
      
      // Direct Supabase query
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('mantra_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('mantra_id', mantraId)
        .eq('session_date', today)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Load sessions error:', error);
      } else if (data) {
        setSessions(data);
      }
    } catch (err) {
      console.error('Load sessions error:', err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const savedLang = localStorage.getItem('language') as Language;
    if (!userId) {
      window.location.href = '/login';
      return;
    }
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      localStorage.setItem('language', 'en');
    }
    setIsLoading(false);
    setSessionStart(new Date());
    loadTodaySessions();
    loadChalisaVerses();
  }, []);
  
  const toggleVoiceCounting = async () => {
    if (isListening) {
      // Stop listening
      if (mediaStream) {
        mediaStream.getTracks().forEach((track: any) => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
      setIsListening(false);
      setMediaStream(null);
      setAudioContext(null);
      setAnalyser(null);
    } else {
      // Start listening
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = context.createMediaStreamSource(stream);
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        
        setMediaStream(stream);
        setAudioContext(context);
        setAnalyser(analyserNode);
        setIsListening(true);
        
        // Start monitoring volume
        let lastSoundTime = 0;
        const checkVolume = () => {
          if (!analyserNode) return;
          
          const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
          analyserNode.getByteFrequencyData(dataArray);
          
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          const now = Date.now();
          
          // Detect sound above threshold with 500ms cooldown
          if (average > 30 && now - lastSoundTime > 500) {
            lastSoundTime = now;
            setCount(prev => {
              const newCount = prev + 1;
              if (newCount % goal === 0 && newCount > 0) {
                setShowCelebration(true);
                playCompletionSound();
                setTimeout(() => setShowCelebration(false), 3000);
              }
              return newCount;
            });
          }
          
          if (isListening) {
            requestAnimationFrame(checkVolume);
          }
        };
        
        checkVolume();
      } catch (err) {
        console.error('Microphone error:', err);
        alert(t.micPermission);
      }
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <div className="text-xl text-gray-600">लोड हो रहा है...</div>
        </div>
      </div>
    );
  }

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount % goal === 0 && newCount > 0) {
      setShowCelebration(true);
      playCompletionSound();
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleReset = () => {
    if (count > 0 && confirm("क्या आप काउंट रीसेट करना चाहते हैं?")) {
      setCount(0);
    }
  };

  const saveSession = async () => {
    if (count === 0) {
      alert("कृपया पहले जप करें!");
      return;
    }

    try {
      const userId = localStorage.getItem('userId') || 'guest';
      const now = new Date();
      const session = {
        user_id: userId,
        mantra_id: mantraId,
        mantra_name: mantraName,
        count,
        goal,
        session_date: now.toISOString().split('T')[0],
        session_time: now.toTimeString().split(' ')[0],
        duration: sessionStart ? Math.floor((now.getTime() - sessionStart.getTime()) / 1000) : 0
      };

      // Direct Supabase insert
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('mantra_sessions')
        .insert([session])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        alert(`❌ सेव करने में त्रुटि!\n${error.message}`);
      } else {
        console.log('Session saved:', data);
        alert(`✅ सत्र सेव हो गया!\n${count} जप रिकॉर्ड किया गया।`);
        setCount(0);
        setSessionStart(new Date());
        loadTodaySessions();
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`❌ सेव करने में त्रुटि!\n${err.message}`);
    }
  };

  const playCompletionSound = () => {
    // Vibration for mobile
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const todayTotal = sessions.reduce((sum, s) => sum + s.count, 0);
  const progress = (count / goal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-3 text-sm md:text-base">
            <span>←</span> <span>{t.back}</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-1">{mantraName}</h1>
              <p className="text-white/80 text-sm md:text-base">{t.todayTotal}: {todayTotal}</p>
            </div>
            <div className="text-4xl md:text-5xl">🙏</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6 max-w-2xl">
        {/* Main Counter */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 mb-4 md:mb-6 border-2 md:border-4 border-orange-100">
          {/* Progress Bar */}
          <div className="mb-4 md:mb-8">
            <div className="flex justify-between text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">
              <span>📈 {t.progress}</span>
              <span className="text-orange-600">{Math.round(((count % goal) / goal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 h-3 md:h-4 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((count % goal) / goal) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Counter Display */}
          <div className="text-center mb-4 md:mb-8">
            <div className="relative inline-block">
              {/* Circular Progress */}
              <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90" viewBox="0 0 256 256">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#f3f4f6"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="url(#gradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 110}`}
                  strokeDashoffset={`${2 * Math.PI * 110 * (1 - (count % goal) / goal)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {count % goal}
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-500 mb-1 md:mb-2">/ {goal}</div>
                <div className="text-xs md:text-sm text-gray-400 font-semibold">{t.total}: {todayTotal + count}</div>
              </div>
            </div>
            
          </div>
          
          {/* Celebration Animation */}
          {showCelebration && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="text-center animate-bounce">
                <div className="text-9xl mb-4">🎉</div>
                <div className="text-5xl font-bold text-green-600 drop-shadow-2xl mb-3">
                  {t.goalCompleted}
                </div>
                <div className="text-3xl font-bold text-orange-600 drop-shadow-xl">
                  {mantraName}
                </div>
                <div className="text-2xl text-gray-700 mt-2">
                  {goal} {t.chantsCompleted}
                </div>
              </div>
              {/* Confetti */}
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10%',
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'][Math.floor(Math.random() * 6)]
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Hanuman Chalisa Verses */}
          {mantraName.toLowerCase().includes('hanuman') && chalisaVerses.length > 0 && (
            <div className="mb-6">
              <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-red-200">
                {/* Verse Image */}
                {chalisaVerses[currentVerse]?.image && (
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img 
                      src={chalisaVerses[currentVerse].image} 
                      alt={`Verse ${currentVerse + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        📜 श्लोक #{currentVerse + 1}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Verse Number Badge (if no image) */}
                {!chalisaVerses[currentVerse]?.image && (
                  <div className="text-center pt-6">
                    <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg mb-4">
                      📜 श्लोक #{currentVerse + 1}
                    </div>
                  </div>
                )}

                {/* Verse Text */}
                <div className="p-4 md:p-8">
                  <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl mb-4 md:mb-6 border-2 border-orange-100">
                    <div className="text-center">
                      <div className="text-lg md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2 leading-relaxed">
                        {chalisaVerses[currentVerse]?.verse?.split('\n').map((line: string, i: number) => (
                          <div key={i} className="mb-1 md:mb-2">{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Meaning */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 md:p-8 shadow-lg border-2 border-purple-200">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-xl md:text-2xl">📚</span>
                      <div className="text-lg md:text-xl font-bold text-purple-700">अर्थ</div>
                    </div>
                    <div className="text-sm md:text-lg text-gray-800 leading-relaxed">
                      {chalisaVerses[currentVerse]?.meaning}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-3 justify-center items-center p-6 bg-gradient-to-r from-orange-100 to-red-100">
                  <button
                    onClick={() => setCurrentVerse(prev => Math.max(0, prev - 1))}
                    disabled={currentVerse === 0}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    ← पिछला
                  </button>
                  <div className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-lg">
                    {currentVerse + 1} / {chalisaVerses.length}
                  </div>
                  <button
                    onClick={() => setCurrentVerse(prev => Math.min(chalisaVerses.length - 1, prev + 1))}
                    disabled={currentVerse === chalisaVerses.length - 1}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    अगला →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tap Button */}
          <button
            onClick={handleIncrement}
            className="w-full h-48 md:h-72 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-2xl md:rounded-3xl text-2xl md:text-4xl font-bold shadow-2xl active:scale-95 transition-all duration-150 mb-4 md:mb-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl md:text-6xl mb-2">🙏</div>
              <div>{t.tapToCount}</div>
            </div>
          </button>

          {/* Voice Counter Button */}
          <button
            onClick={toggleVoiceCounting}
            className={`w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-bold transition-all shadow-lg mb-4 ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                : 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
            } text-white`}
          >
            <div className="text-3xl md:text-4xl mb-2">{isListening ? '🎤' : '🎙️'}</div>
            <div className="text-sm md:text-base">{isListening ? t.voiceActive : t.voiceCount}</div>
            {isListening && <div className="text-xs mt-1 opacity-75">{t.voiceHint}</div>}
          </button>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <button
              onClick={() => setShowGoalModal(true)}
              className="py-3 md:py-5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl md:rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="text-xl md:text-2xl mb-1">🎯</div>
              <div className="text-xs">{t.goal}</div>
            </button>
            <button
              onClick={handleReset}
              className="py-3 md:py-5 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl md:rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="text-xl md:text-2xl mb-1">🔄</div>
              <div className="text-xs">{t.reset}</div>
            </button>
            <button
              onClick={saveSession}
              className="py-3 md:py-5 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl md:rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="text-xl md:text-2xl mb-1">💾</div>
              <div className="text-xs">{t.save}</div>
            </button>
          </div>
        </div>

        {/* Today's Sessions */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border-2 border-orange-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📅</span> {t.todaySessions}
            </h3>
            <div className="space-y-3">
              {sessions.map((session, idx) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">
                        {session.count} जप
                      </div>
                      <div className="text-sm text-gray-600">
                        ⏰ {session.session_time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600">
                      {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')} मिनट
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-scaleIn">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎯</div>
              <h3 className="text-3xl font-bold text-gray-800">
                {t.selectGoal}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[108, 216, 324, 540, 1008, 10000].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGoal(g);
                    setShowGoalModal(false);
                  }}
                  className={`py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                    goal === g
                      ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                🖊️ {t.customGoal}
              </label>
              <input
                type="number"
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold"
                placeholder={t.enterGoal}
                onChange={(e) => setGoal(parseInt(e.target.value) || 108)}
              />
            </div>
            <button
              onClick={() => setShowGoalModal(false)}
              className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl font-bold transition-all shadow-lg"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CounterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <div className="text-xl text-gray-600">लोड हो रहा है...</div>
        </div>
      </div>
    }>
      <CounterContent />
    </Suspense>
  );
}