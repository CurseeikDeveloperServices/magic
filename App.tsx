
import React, { useState, useEffect, useRef } from 'react';
import { translations, professions, platformItems } from './translations';
import { Language } from './types';
import { generateAIPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [selectedProfession, setSelectedProfession] = useState(professions[0].id);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGeneratedPrompt('');
    
    try {
      const profName = professions.find(p => p.id === selectedProfession)?.names[lang] || '';
      const result = await generateAIPrompt(promptInput, profName, lang, attachedImage || undefined);
      setGeneratedPrompt(result);
      
      setTimeout(() => {
        document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(lang === 'ar' ? 'تم النسخ بنجاح!' : lang === 'fr' ? 'Copié !' : 'Copied!');
  };

  return (
    <div className={`min-h-screen bg-[#0b0f19] text-white selection:bg-primary/30 ${isRtl ? 'font-cairo' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/5 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[160px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-xl py-3 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-primary to-blue-700 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/20">C</div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">Curseeik</span>
          </div>
          
          <div className="hidden lg:flex gap-10 items-center text-xs font-bold uppercase tracking-widest">
            <a href="#about" className="hover:text-primary transition-all underline-offset-8 hover:underline">{t.navAbout}</a>
            <a href="#fields" className="hover:text-primary transition-all underline-offset-8 hover:underline">{t.navFields}</a>
            <a href="#features" className="hover:text-primary transition-all underline-offset-8 hover:underline">{t.navFeatures}</a>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            {(['en', 'ar', 'fr'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${lang === l ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-black tracking-widest uppercase mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
            {isRtl ? 'نظام هندسة الأوامر المطور' : 'Advanced Prompt Engineering System'}
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-white">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#ai" className="bg-primary hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-black transition-all transform hover:scale-105 shadow-2xl shadow-primary/40 flex items-center gap-3">
              <span>{t.heroBtn}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Main Tool: AI Playground */}
      <section id="ai" className="py-24 px-6 container mx-auto">
        <div className="max-w-4xl mx-auto bg-[#121a2c]/40 backdrop-blur-3xl p-8 md:p-16 rounded-[3.5rem] border border-white/5 shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">{t.aiTitle}</h2>
            <div className="flex justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/60">
              <span className="px-3 py-1 bg-primary/5 rounded-md border border-primary/10">8K Render</span>
              <span className="px-3 py-1 bg-primary/5 rounded-md border border-primary/10">Identity Safe</span>
              <span className="px-3 py-1 bg-primary/5 rounded-md border border-primary/10">Multi-Model</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{t.professionLabel}</label>
              <select 
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="w-full bg-[#0b0f19] border border-white/10 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-white font-bold transition-all hover:border-primary/50"
              >
                {professions.map((p) => (
                  <option key={p.id} value={p.id}>{p.names[lang]}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">{t.goalLabel}</label>
              <input 
                type="text" 
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={t.aiPlaceholder}
                className="w-full bg-[#0b0f19] border border-white/10 p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-white transition-all hover:border-primary/50"
              />
            </div>
          </div>

          {/* Identity Protection / Image Attachment */}
          <div className="mb-10">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            {attachedImage ? (
              <div className="relative w-40 h-40 mx-auto group">
                <img src={attachedImage} alt="Reference" className="w-full h-full object-cover rounded-[2rem] border-2 border-primary shadow-2xl shadow-primary/20" />
                <button 
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  ✕
                </button>
                <div className="absolute inset-0 bg-primary/20 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <span className="text-[10px] font-black uppercase text-white shadow-sm">Replace</span>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-white/10 p-12 rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-black text-lg text-white/80 group-hover:text-white transition-colors">
                    {isRtl ? 'أرفق الصورة المرجعية هنا' : 'Attach Reference Image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRtl ? 'للحفاظ على الملامح بنسبة 100%' : 'Required for 100% identity preservation'}
                  </p>
                </div>
              </button>
            )}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !promptInput}
            className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${isGenerating || !promptInput ? 'bg-gray-800/50 cursor-not-allowed text-gray-500' : 'bg-primary hover:bg-blue-600 shadow-primary/25 hover:-translate-y-1 active:scale-95'}`}
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="animate-pulse">{isRtl ? 'جاري التحليل الهندسي...' : 'Engineering Prompt...'}</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✨</span>
                <span>{t.aiGenerate}</span>
              </>
            )}
          </button>

          {generatedPrompt && (
            <div id="result-area" className="mt-14 animate-fade-in-up">
              <div className="flex justify-between items-center mb-5 px-3">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{t.aiResultTitle}</h3>
                <div className="flex gap-2">
                   <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">8K UHD</span>
                   <span className="text-[9px] font-black bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">ID PROTECTED</span>
                </div>
              </div>
              <div className="relative group">
                <div className="bg-[#0b0f19] p-10 rounded-[2.5rem] border border-white/5 text-blue-100 font-mono text-sm leading-relaxed max-h-[550px] overflow-y-auto shadow-inner custom-scrollbar">
                  {generatedPrompt}
                </div>
                <button 
                  onClick={() => copyToClipboard(generatedPrompt)}
                  className="absolute top-5 right-5 p-5 bg-primary/20 hover:bg-primary text-white rounded-2xl shadow-xl transition-all transform hover:scale-110 border border-primary/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Fields Explorer */}
      <section id="fields" className="py-32 bg-white/2 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black mb-6">{t.fieldsTitle}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{isRtl ? 'حلول هندسية متخصصة لكل قطاع مهني' : 'Specialized engineering solutions for every professional sector'}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {professions.map((prof) => (
              <div 
                key={prof.id} 
                className="bg-[#121a2c]/40 p-8 rounded-[2rem] border border-white/5 hover:border-primary/40 transition-all hover:-translate-y-3 hover:shadow-2xl group flex flex-col items-center justify-center text-center min-h-[160px]"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl mb-5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500">
                  <span className="text-xl">🛠️</span>
                </div>
                <span className="text-sm font-black group-hover:text-white transition-colors leading-tight px-2 text-gray-400">
                  {prof.names[lang]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="py-24 px-6 border-y border-white/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-black mb-16 text-gray-500 uppercase tracking-[0.4em]">{t.platformsTitle}</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {platformItems.map((item) => (
              <div key={item.id} className="text-center px-8 py-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
                <span className="text-lg font-black tracking-tighter">{item.names[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-24 px-6 border-t border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-16 mb-16">
            <div className="text-center lg:text-start">
              <h3 className="text-4xl font-black text-primary mb-6 tracking-tighter">CURSEEIK</h3>
              <p className="text-gray-500 max-w-sm text-lg leading-relaxed">
                {isRtl ? 'المنصة الاحترافية الأولى لهندسة الأوامر الذكية بدقة متناهية.' : 'The premium professional platform for high-precision smart prompt engineering.'}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 text-center min-w-[280px]">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">{isRtl ? 'التطوير التقني' : 'Technical Development'}</p>
                <p className="font-black text-white text-xl">{t.footerDev}</p>
              </div>
              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 text-center min-w-[280px]">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">{isRtl ? 'الإشراف والتدريب' : 'Supervision & Training'}</p>
                <p className="font-black text-white text-xl">{t.footerCoach}</p>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">© {new Date().getFullYear()} Curseeik AI Services. All rights reserved.</p>
            <div className="flex gap-8 text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/962778361269" 
        target="_blank" 
        rel="noopener noreferrer"
        title={t.whatsappTooltip}
        className="fixed bottom-10 left-10 w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-3xl shadow-green-500/40 transform transition-all hover:scale-110 active:scale-90 z-50 animate-bounce-slow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 448 512" fill="currentColor">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.7 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 446.3c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.4 0 101.7-82.8 184.5-184.5 184.5zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.1-8.5-44-27.1-16.2-14.5-27.2-32.3-30.4-37.8-3.2-5.5-.3-8.5 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.6-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--primary); }
      `}</style>
    </div>
  );
};

export default App;
