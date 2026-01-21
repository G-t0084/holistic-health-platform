
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Dosha, PrakritiScore, UserProfile, HealthVital, GuidanceMode, Message, LifestylePlanItem, SkinAnalysisResult, AssessmentRecord } from './types';
import { PRAKRITI_QUESTIONS, APP_THEME } from './constants';
import { getPrakritiReport, getQuickSuggestions, getComparativeAnalysis } from './services/geminiService';
import { authService, UserAccount } from './services/authService';
import PrakritiQuiz from './components/PrakritiQuiz';
import VitalChart from './components/VitalChart';
import LifestylePlanner from './components/LifestylePlanner';
import SkinCapture from './components/SkinCapture';
import AuthModal from './components/AuthModal';
import ActivityGraph from './components/ActivityGraph';
import ComparativeChart from './components/ComparativeChart';
import AyurChat from './components/AyurChat';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';

const Navbar = ({ account, onAuthClick, onLogout }: { account: UserAccount | null, onAuthClick: () => void, onLogout: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 py-3 px-6 flex justify-between items-center no-print">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
        <span className="text-xl font-bold tracking-tight text-teal-900">AyurAI</span>
      </Link>
      <div className="flex gap-6 text-sm font-medium text-slate-600 items-center">
        <Link to="/how-it-works" className="hover:text-teal-600 transition hidden sm:block">How It Works</Link>
        {account?.profile && (
          <Link to="/report" className="text-teal-600 hover:text-teal-700 font-bold transition">Health Report</Link>
        )}
        <Link to="/dashboard" className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition shadow-lg shadow-teal-100">Dashboard</Link>
        {account ? (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-100 hover:border-teal-500 transition">
              {account.picture ? <img src={account.picture} className="w-full h-full object-cover" /> : '👤'}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 animate-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="px-5 py-3 border-b border-slate-50 mb-2">
                  <p className="text-xs font-black text-slate-900 truncate">{account.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{account.email}</p>
                </div>
                <div className="px-2">
                  <button onClick={() => { onLogout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 text-xs text-red-500 font-bold hover:bg-red-50 rounded-xl transition">Log Out</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onAuthClick} className="bg-slate-100 text-teal-700 px-5 py-2 rounded-full font-bold text-xs hover:bg-teal-50 transition border border-teal-100">Sign In</button>
        )}
      </div>
    </nav>
  );
};

const HowItWorks = () => (
  <div className="max-w-5xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black text-slate-900 mb-4">How AyurAI Works</h2>
      <p className="text-slate-500 max-w-xl mx-auto">Bridging the gap between modern diagnostics and traditional wisdom.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        { step: '01', title: 'Data Synthesis', desc: 'We capture your current vitals like BP and Blood Sugar, alongside your age and environment.', icon: '🌡️' },
        { step: '02', title: 'Dual Analysis', desc: 'Our simultaneous Prakriti (Baseline) and Vikriti (Current) analysis identifies health excavations.', icon: '⚖️' },
        { step: '03', title: 'Holistic Guidance', desc: 'Receive integrated advice that respects modern safety rules and ancient balance rituals.', icon: '✨' }
      ].map((item, i) => (
        <div key={i} className="relative p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl shadow-teal-100">{item.step}</div>
          <div className="text-4xl mb-6">{item.icon}</div>
          <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const Home = ({ onAuthClick, account }: { onAuthClick: () => void, account: UserAccount | null }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <div className="inline-block py-2 px-4 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
        Modern Ayurveda powered by AI
      </div>
      <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
        Discover Your <span className="text-teal-600">Prakriti</span>.<br />
        Master Your Health.
      </h1>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
        AyurAI combines 5,000 years of Ayurvedic wisdom with advanced Gemini AI to help you find balance in the modern world.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {account ? (
          <Link to="/dashboard" className="bg-teal-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-teal-700 transition">Go to Dashboard</Link>
        ) : (
          <>
            <button onClick={onAuthClick} className="bg-teal-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-teal-700 transition">Take the Quiz</button>
            <button onClick={onAuthClick} className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:border-teal-500 transition">Sign In</button>
          </>
        )}
      </div>
    </div>
  );
};

const ReportView = ({ user }: { user: UserProfile }) => {
  const [activeTab, setActiveTab] = useState<'clinical' | 'comparative'>('clinical');
  const [prakritiText, setPrakritiText] = useState<string>('');
  const [comparativeText, setComparativeText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const baseline = user.assessmentHistory.find(h => h.type === 'Baseline');
      const latestCurrent = [...user.assessmentHistory].reverse().find(h => h.type === 'Current');
      
      const pText = await getPrakritiReport(user);
      setPrakritiText(pText);

      if (baseline && latestCurrent) {
        const cText = await getComparativeAnalysis(user, baseline, latestCurrent);
        setComparativeText(cText);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`AyurAI_Report_${user.name}.pdf`);
    setExporting(false);
  };

  if (loading) return <div className="py-40 text-center text-slate-900 font-bold">Generating Deep Analysis...</div>;

  const baseline = user.assessmentHistory.find(h => h.type === 'Baseline');
  const latestCurrent = [...user.assessmentHistory].reverse().find(h => h.type === 'Current');

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 no-print">
        <div className="flex border-b border-slate-200">
          <button onClick={() => setActiveTab('clinical')} className={`px-8 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'clinical' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-400'}`}>Baseline Report</button>
          {latestCurrent && (
            <button onClick={() => setActiveTab('comparative')} className={`px-8 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'comparative' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-400'}`}>Comparative Analysis</button>
          )}
        </div>
        <button 
          onClick={exportPDF} 
          disabled={exporting}
          className="bg-teal-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-950 transition flex items-center gap-2"
        >
          {exporting ? 'Generating...' : '📥 Export PDF'}
        </button>
      </div>

      <div ref={reportRef} className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl border border-slate-100">
        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-50 pb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Type: <span className="text-teal-600">{user.prakriti}</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Report Date</p>
            <p className="text-xs font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Numeric Scores Table */}
        <div className="mb-12 grid grid-cols-3 gap-4">
          {[Dosha.VATA, Dosha.PITTA, Dosha.KAPHA].map(dosha => (
            <div key={dosha} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{dosha}</p>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-teal-900">{latestCurrent?.scores[dosha] || 0}</span>
                <span className="text-[9px] font-bold text-slate-400">Current</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500">{baseline?.scores[dosha] || 0}</span>
                <span className="text-[9px] ml-1 font-bold text-slate-300">Baseline</span>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'comparative' && baseline && latestCurrent && (
          <div className="mb-12 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
            <h4 className="text-center font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Dosha Balance Shift Visualization</h4>
            <ComparativeChart baseline={baseline.scores} current={latestCurrent.scores} />
            <div className="mt-8 prose prose-teal max-w-none report-content" dangerouslySetInnerHTML={{ __html: marked.parse(comparativeText) }} />
          </div>
        )}

        {activeTab === 'clinical' && (
          <div className="prose prose-teal max-w-none report-content" dangerouslySetInnerHTML={{ __html: marked.parse(prakritiText) }} />
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ account, onAddVital, onUpdatePlan, onAuthClick }: { account: UserAccount | null, onAddVital: (v: HealthVital) => void, onUpdatePlan: (plan: LifestylePlanItem[]) => void, onAuthClick: () => void }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState<'BP' | 'Sugar' | 'Weight' | 'Height'>('BP');
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [newTodo, setNewTodo] = useState('');

  const user = account?.profile;
  const vitals = account?.vitals || [];
  const fullPlan = account?.lifestylePlan || [];
  
  // Filtering: Only show items marked as planned for the sidebar tracker
  const activePlan = fullPlan.filter(p => p.isPlanned);
  
  const latestAssessment = user?.assessmentHistory.slice().reverse().find(h => h.type === 'Current');

  const handleAddTodo = (title: string, category: string = 'Routine') => {
    if (!title.trim()) return;
    const newItem: LifestylePlanItem = {
      id: `manual-${Date.now()}`,
      category: category as any,
      title: title,
      description: 'Manually added daily ritual',
      benefits: 'Personal routine',
      isPlanned: true
    };
    onUpdatePlan([...fullPlan, newItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    const newPlan = fullPlan.map(item => 
      item.id === id ? { ...item, completedAt: item.completedAt ? undefined : new Date().toISOString() } : item
    );
    onUpdatePlan(newPlan);
  };

  const completedCount = activePlan.filter(p => !!p.completedAt).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* 1. Assessment Shortcut - TOP */}
      <div className="bg-teal-900 p-8 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-teal-100/20 relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 bg-lime-400 rounded-[32px] flex items-center justify-center text-4xl shadow-2xl">⚖️</div>
          <div>
            <h3 className="text-white font-black text-3xl tracking-tight">Recalibrate Balance</h3>
            <p className="text-teal-300 text-sm font-black uppercase tracking-[0.2em] mt-1">Check current state (Vikriti)</p>
          </div>
        </div>
        <Link to="/prakriti" className="relative z-10 bg-white text-teal-900 px-12 py-6 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-lime-400 hover:text-teal-950 transition-all hover:scale-105 shadow-2xl">
          Start Dual Analysis
        </Link>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Your Health Dashboard - HERO (Moved below shortcut) */}
      <div className="bg-white p-16 rounded-[60px] shadow-sm border border-slate-200 text-center relative overflow-hidden">
        <h2 className="text-6xl font-black text-slate-900 mb-8 tracking-tighter">Your Health Dashboard</h2>
        <p className="text-xl text-slate-500 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
          The art of Ayurvedic living is consistency. Track your <span className="text-teal-600 font-bold">Rituals</span>, 
          monitor <span className="text-teal-600 font-bold">Vitals</span>, and receive wisdom from AyurAI.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {user ? (
            <>
              <Link to="/report" className="bg-teal-600 text-white px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-teal-100 hover:bg-teal-700 transition">Clinical Analysis</Link>
              <Link to="/planner" className="bg-slate-100 text-slate-800 px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Adjust Rituals</Link>
            </>
          ) : (
            <button onClick={onAuthClick} className="bg-teal-600 text-white px-12 py-6 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-teal-100 hover:bg-teal-700 transition">Unlock Your Health Profile</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-10">
          <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-[40px] flex items-center justify-center overflow-hidden border-2 border-teal-100 shadow-sm">
                {account?.picture ? <img src={account.picture} className="w-full h-full object-cover" /> : <span className="text-5xl">👤</span>}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">{user?.name || 'Guest User'}</h2>
                <div className="mt-2 px-4 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block">
                  {user?.prakriti || 'Unknown'} Nature
                </div>
              </div>
            </div>

            {latestAssessment && (
               <div className="mb-12 grid grid-cols-3 gap-4">
                  {[Dosha.VATA, Dosha.PITTA, Dosha.KAPHA].map(dosha => (
                    <div key={dosha} className="text-center p-5 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-[0.2em]">{dosha}</p>
                      <p className="text-2xl font-black text-teal-900">{latestAssessment.scores[dosha]}</p>
                    </div>
                  ))}
               </div>
            )}
          </div>

          <div className="bg-teal-900 p-12 rounded-[60px] shadow-3xl shadow-teal-100/20 text-white border border-teal-800">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-2xl tracking-tight">Ritual Tracker</h3>
              {user && <span className="bg-lime-400/20 px-4 py-2 rounded-2xl text-[10px] font-black text-lime-400 uppercase tracking-widest border border-lime-400/20">{completedCount} / {activePlan.length}</span>}
            </div>
            {user ? (
              <>
                <div className="w-full bg-white/5 h-3 rounded-full mb-12 overflow-hidden shadow-inner">
                  <div className="bg-lime-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(163,230,53,0.5)]" style={{ width: activePlan.length > 0 ? `${(completedCount / activePlan.length) * 100}%` : '0%' }} />
                </div>
                <div className="space-y-4 mb-12 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                  {activePlan.map(p => (
                    <div key={p.id} onClick={() => toggleTodo(p.id)} className={`group flex items-center gap-6 p-6 rounded-[32px] border transition-all cursor-pointer ${p.completedAt ? 'bg-white/5 border-transparent opacity-40 scale-[0.98]' : 'bg-white/10 border-white/5 hover:bg-white/15'}`}>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 ${p.completedAt ? 'bg-lime-400 border-lime-400 text-teal-900' : 'border-teal-700 group-hover:border-lime-400'}`}>
                        {p.completedAt && <span className="text-lg font-black">✓</span>}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-bold block leading-tight ${p.completedAt ? 'line-through text-teal-300' : 'text-slate-100'}`}>{p.title}</span>
                        {(p as any).timeOfDay && <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest">{(p as any).timeOfDay}</span>}
                      </div>
                    </div>
                  ))}
                  {activePlan.length === 0 && (
                    <div className="text-center py-16 opacity-30">
                      <p className="text-[10px] font-black uppercase tracking-widest">Your rituals are empty.</p>
                      <Link to="/planner" className="text-xs text-lime-400 underline mt-2 block">Set rituals in Planner</Link>
                    </div>
                  )}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleAddTodo(newTodo); }} className="flex gap-4">
                  <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Add quick ritual..." className="flex-1 bg-white/10 border border-white/10 rounded-3xl px-8 py-5 text-sm text-white outline-none focus:border-lime-400/50 focus:bg-white/15 transition-all" />
                  <button type="submit" className="bg-lime-400 text-teal-950 w-16 h-16 rounded-3xl font-black text-3xl hover:scale-105 transition active:scale-95 shadow-xl shadow-lime-400/30">+</button>
                </form>
              </>
            ) : (
              <div className="py-24 text-center opacity-30">
                <p className="text-sm font-black uppercase tracking-[0.3em]">Login Required</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          {user && <AyurChat user={user} vitals={vitals} />}
          <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vital Biometrics</h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Personal health data tracking</p>
              </div>
              <button onClick={() => setShowAdd(true)} className="bg-teal-600 text-white font-black text-xs px-10 py-5 rounded-[24px] shadow-2xl shadow-teal-100/50 hover:bg-teal-700 transition active:scale-[0.98]">Update Vitals</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <VitalChart data={vitals} type="BP" />
              <VitalChart data={vitals} type="Sugar" />
              <VitalChart data={vitals} type="Weight" />
              <VitalChart data={vitals} type="Height" />
            </div>
          </div>
          {account && <ActivityGraph plan={fullPlan} />}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[60px] p-16 w-full max-w-xl shadow-3xl border border-slate-100 animate-in zoom-in-95 duration-200 relative">
             <button onClick={() => setShowAdd(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-500 text-2xl font-black">✕</button>
            <h3 className="text-4xl font-black mb-12 text-slate-900 tracking-tighter text-center">Log Vitals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-2 rounded-[32px] mb-12">
              <button onClick={() => setType('BP')} className={`py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${type === 'BP' ? 'bg-white text-teal-600 shadow-xl' : 'text-slate-400'}`}>BP</button>
              <button onClick={() => setType('Sugar')} className={`py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${type === 'Sugar' ? 'bg-white text-teal-600 shadow-xl' : 'text-slate-400'}`}>Sugar</button>
              <button onClick={() => setType('Weight')} className={`py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${type === 'Weight' ? 'bg-white text-teal-600 shadow-xl' : 'text-slate-400'}`}>Weight</button>
              <button onClick={() => setType('Height')} className={`py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${type === 'Height' ? 'bg-white text-teal-600 shadow-xl' : 'text-slate-400'}`}>Height</button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">
                  {type === 'BP' ? 'Systolic' : type === 'Weight' ? 'Weight (kg)' : type === 'Height' ? 'Height (cm)' : 'Value'}
                </label>
                <input type="number" placeholder="0" value={val1} onChange={e => setVal1(e.target.value)} className="w-full px-10 py-6 bg-slate-50 border border-slate-200 rounded-[32px] outline-none focus:border-teal-500 focus:bg-white text-2xl font-black transition-all" />
              </div>
              {type === 'BP' && (
                <div className="space-y-3 animate-in slide-in-from-top-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-6">Diastolic</label>
                  <input type="number" placeholder="0" value={val2} onChange={e => setVal2(e.target.value)} className="w-full px-10 py-6 bg-slate-50 border border-slate-200 rounded-[32px] outline-none focus:border-teal-500 focus:bg-white text-2xl font-black transition-all" />
                </div>
              )}
            </div>
            <div className="flex gap-8 mt-16">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-6 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600">Cancel</button>
              <button 
                onClick={() => { 
                  if (val1) {
                    onAddVital({ 
                      id: `v-${Date.now()}`, 
                      type, 
                      value: parseFloat(val1), 
                      secondary: type === 'BP' ? parseFloat(val2) : undefined, 
                      timestamp: new Date().toISOString() 
                    }); 
                    setShowAdd(false); 
                    setVal1(''); setVal2('');
                  }
                }} 
                className="flex-2 py-6 bg-teal-600 text-white rounded-[32px] font-black uppercase text-xs tracking-widest shadow-2xl shadow-teal-100 hover:bg-teal-700 transition active:scale-95"
              >
                Log Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ... Remaining App component (ProtectedRoute, Routes, etc.) stays the same ...
const ProtectedRoute: React.FC<{ children: React.ReactNode, account: UserAccount | null, onAuthClick: () => void }> = ({ children, account, onAuthClick }) => {
  if (!account) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-[40px] flex items-center justify-center text-5xl mx-auto mb-10 shadow-sm">🔐</div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Profile Locked</h2>
          <p className="text-slate-500 mb-12 font-medium leading-relaxed">Sign in to track your Prakriti, Vitals, and receive personalized Ayurvedic rituals.</p>
          <button onClick={onAuthClick} className="w-full bg-teal-600 text-white py-6 rounded-[30px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-teal-100 hover:bg-teal-700 transition">Join AyurAI Now</button>
          <Link to="/" className="block mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-teal-600 transition-colors">Return to Home</Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

const App = () => {
  const [account, setAccount] = useState<UserAccount | null>(authService.getActiveSession());
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handlePrakritiComplete = (
    baselineData: { scores: PrakritiScore; dominant: Dosha; answers: Record<string, Dosha> },
    currentData: { scores: PrakritiScore; dominant: Dosha; answers: Record<string, Dosha> },
    bioData: any
  ) => {
    if (!account) { setShowAuth(true); return; }
    
    const baselineRecord: AssessmentRecord = {
      id: 'b-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type: 'Baseline',
      scores: baselineData.scores,
      answers: baselineData.answers,
      dominant: baselineData.dominant
    };

    const currentRecord: AssessmentRecord = {
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type: 'Current',
      scores: currentData.scores,
      answers: currentData.answers,
      dominant: currentData.dominant
    };

    const currentProfile = account.profile || {
      ...bioData,
      assessmentHistory: [],
      lastUpdated: new Date().toISOString(),
      prakriti: baselineData.dominant,
      prakritiScores: baselineData.scores
    };

    const updatedProfile = {
      ...currentProfile,
      assessmentHistory: [...(currentProfile.assessmentHistory || []), baselineRecord, currentRecord],
      lastUpdated: new Date().toISOString(),
      prakriti: baselineData.dominant,
      prakritiScores: baselineData.scores
    };

    const newAccount = { ...account, profile: updatedProfile };
    setAccount(newAccount);
    authService.syncUserData(newAccount);
    navigate('/dashboard');
  };

  const handleUpdatePlan = (p: LifestylePlanItem[]) => {
    if (account) { 
      const acc = { ...account, lifestylePlan: p }; 
      setAccount(acc); 
      authService.syncUserData(acc); 
    }
  };

  const handleAddVital = (v: HealthVital) => {
    if (account) { 
      const acc = { ...account, vitals: [v, ...account.vitals] }; 
      setAccount(acc); 
      authService.syncUserData(acc); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar account={account} onAuthClick={() => setShowAuth(true)} onLogout={() => { authService.logout(); setAccount(null); }} />
      <main className="pb-32">
        <Routes>
          <Route path="/" element={<Home onAuthClick={() => setShowAuth(true)} account={account} />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          
          <Route path="/prakriti" element={
            <ProtectedRoute account={account} onAuthClick={() => setShowAuth(true)}>
              <div className="py-12 px-6"><PrakritiQuiz onComplete={handlePrakritiComplete} /></div>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute account={account} onAuthClick={() => setShowAuth(true)}>
              <Dashboard account={account} onAddVital={handleAddVital} onUpdatePlan={handleUpdatePlan} onAuthClick={() => setShowAuth(true)} />
            </ProtectedRoute>
          } />
          
          <Route path="/planner" element={
            <ProtectedRoute account={account} onAuthClick={() => setShowAuth(true)}>
              <div className="max-w-7xl mx-auto px-6 py-12">
                {account?.profile ? (
                  <LifestylePlanner 
                    user={account.profile} 
                    vitals={account.vitals}
                    onUpdatePlan={handleUpdatePlan} 
                    savedPlan={account.lifestylePlan} 
                  />
                ) : (
                  <div className="text-center py-20">
                    <p className="text-slate-500 font-bold mb-4">Complete your assessment first.</p>
                    <Link to="/prakriti" className="text-teal-600 font-black uppercase tracking-widest underline">Start Analysis</Link>
                  </div>
                )}
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/report" element={
            <ProtectedRoute account={account} onAuthClick={() => setShowAuth(true)}>
              {account?.profile ? <ReportView user={account.profile} /> : <div className="p-40 text-center">No profile found.</div>}
            </ProtectedRoute>
          } />
          
          <Route path="/skin" element={
            <ProtectedRoute account={account} onAuthClick={() => setShowAuth(true)}>
              <div className="py-12 px-6">
                {account?.profile ? (
                  <SkinCapture userPrakriti={account.profile.prakriti} onAnalysisComplete={(res) => {
                    const updatedProfile = { ...account.profile!, skinAnalysis: res };
                    const acc = { ...account, profile: updatedProfile };
                    setAccount(acc);
                    authService.syncUserData(acc);
                  }} />
                ) : (
                  <div className="text-center py-20">Please complete analysis first.</div>
                )}
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {showAuth && <AuthModal onSuccess={(acc) => { setAccount(acc); setShowAuth(false); }} onClose={() => setShowAuth(false)} />}
    </div>
  );
};

const Root = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default Root;
