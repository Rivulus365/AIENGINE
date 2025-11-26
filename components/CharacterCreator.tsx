
import React, { useState } from 'react';
import { BaseStats, Feat } from '../types';
import { CLASS_DEFINITIONS, FEAT_OPTIONS } from '../constants';
import { Sword, Shield, Brain, User, Check, Sparkles, Wind, Eye, Crown, ArrowRight, ArrowLeft, Star, BookOpen } from 'lucide-react';

interface CharacterCreatorProps {
  onComplete: (name: string, charClass: string, stats: BaseStats, feat: Feat) => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1: Identity, 2: Stats, 3: Feat
  
  const [name, setName] = useState('');
  const [charClass, setCharClass] = useState('Warrior');
  const [selectedFeat, setSelectedFeat] = useState<Feat>(FEAT_OPTIONS[0]);
  
  const [stats, setStats] = useState<BaseStats>({ 
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 
  });
  
  const POINTS_BUDGET = 12;

  // Calculate used points based on deviation from 10
  const usedPoints = Object.values(stats).reduce((a, b) => a + (b - 10), 0);
  const remainingPoints = POINTS_BUDGET - usedPoints;

  const currentClassDef = CLASS_DEFINITIONS[charClass];

  const increment = (stat: keyof BaseStats) => {
    if (remainingPoints > 0 && stats[stat] < 18) {
      setStats({ ...stats, [stat]: stats[stat] + 1 });
    }
  };

  const decrement = (stat: keyof BaseStats) => {
    if (stats[stat] > 10) {
      setStats({ ...stats, [stat]: stats[stat] - 1 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && remainingPoints === 0) {
      // Merge Base Stats with Class Bonuses
      const finalStats = { ...stats };
      if (currentClassDef.statBonuses) {
        (Object.keys(currentClassDef.statBonuses) as Array<keyof BaseStats>).forEach((key) => {
           finalStats[key] = (finalStats[key] || 0) + (currentClassDef.statBonuses[key] || 0);
        });
      }
      onComplete(name, charClass, finalStats, selectedFeat);
    }
  };

  const statConfig = [
    { key: 'str', label: 'Strength', icon: Sword, color: 'text-red-700', bg: 'bg-red-900/20', border: 'border-red-900/30' },
    { key: 'dex', label: 'Dexterity', icon: Wind, color: 'text-emerald-700', bg: 'bg-emerald-900/20', border: 'border-emerald-900/30' },
    { key: 'con', label: 'Constitution', icon: Shield, color: 'text-amber-700', bg: 'bg-amber-900/20', border: 'border-amber-900/30' },
    { key: 'int', label: 'Intelligence', icon: Brain, color: 'text-blue-700', bg: 'bg-blue-900/20', border: 'border-blue-900/30' },
    { key: 'wis', label: 'Wisdom', icon: Eye, color: 'text-violet-700', bg: 'bg-violet-900/20', border: 'border-violet-900/30' },
    { key: 'cha', label: 'Charisma', icon: Crown, color: 'text-rose-700', bg: 'bg-rose-900/20', border: 'border-rose-900/30' },
  ];

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-in fade-in duration-500">
      <div className="bg-[#1c1917] border border-[#44403c] p-1 rounded-lg shadow-[0_0_100px_rgba(251,191,36,0.1)] max-w-2xl w-full relative overflow-hidden flex flex-col h-[80vh] animate-float">
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-900/20 to-transparent pointer-events-none animate-torch" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-amber-900/20 to-transparent pointer-events-none animate-torch" aria-hidden="true" />
        
        <div className="p-8 border border-[#292524] rounded h-full relative z-10 flex flex-col">
            
            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex justify-center items-center gap-2 mb-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label="Creation Progress">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${step >= i ? 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]' : 'bg-[#292524]'}`} />
                    ))}
                </div>
                <h2 id="modal-title" className="text-3xl font-display text-shimmer">
                    {step === 1 && "Identity & Origin"}
                    {step === 2 && "Ability Scores"}
                    {step === 3 && "Feats & Talents"}
                </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                
                <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right fade-in duration-300">
                            <div>
                                <label htmlFor="char-name" className="block text-amber-500/80 mb-2 font-display tracking-widest text-xs uppercase">Name</label>
                                <div className="relative group">
                                <User className="absolute left-3 top-3 text-stone-600 w-5 h-5 group-focus-within:text-amber-500 transition-colors" aria-hidden="true" />
                                <input
                                    id="char-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#0c0a09] border border-[#292524] text-stone-200 rounded p-2 pl-10 focus:outline-none focus:border-amber-700/50 transition-all font-serif text-lg placeholder-stone-700 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                                    placeholder="Enter thy name..."
                                    required
                                    autoFocus
                                />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="char-class" className="block text-amber-500/80 mb-2 font-display tracking-widest text-xs uppercase">Class</label>
                                    <div className="relative">
                                        <select
                                            id="char-class"
                                            value={charClass}
                                            onChange={(e) => setCharClass(e.target.value)}
                                            className="w-full bg-[#0c0a09] border border-[#292524] text-stone-200 rounded p-3 focus:outline-none focus:border-amber-700/50 transition-all font-serif appearance-none cursor-pointer hover:border-amber-900/50"
                                        >
                                            {Object.keys(CLASS_DEFINITIONS).map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none text-stone-500" aria-hidden="true">▼</div>
                                    </div>
                                </div>
                                
                                <div className="bg-[#0c0a09]/50 p-4 rounded border border-[#292524] text-sm animate-in zoom-in-95 duration-300">
                                    <h4 className="text-amber-500 font-display mb-2 border-b border-[#292524] pb-1">{currentClassDef.name}</h4>
                                    <p className="text-stone-400 italic mb-3">{currentClassDef.description}</p>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-stone-500 uppercase">Hit Die:</span>
                                            <span className="text-stone-300 font-mono">d{currentClassDef.hitDie}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-stone-500 uppercase">Bonuses:</span>
                                            <span className="text-emerald-500 font-mono">
                                                {Object.entries(currentClassDef.statBonuses).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: STATS */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                             <div className="bg-amber-900/10 p-3 rounded border border-amber-900/30 text-center mb-2 animate-pulse-amber">
                                <span className={`font-mono text-xl font-bold ${remainingPoints === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {remainingPoints}
                                </span>
                                <span className="text-stone-500 text-xs uppercase tracking-widest block">Points Remaining</span>
                            </div>

                            <div className="space-y-2">
                                {statConfig.map((stat) => {
                                    // Calculate if this stat gets a class bonus
                                    const classBonus = currentClassDef.statBonuses[stat.key as keyof BaseStats] || 0;
                                    const total = stats[stat.key as keyof BaseStats] + classBonus;

                                    return (
                                    <div key={stat.key} className="flex items-center justify-between p-2 rounded hover:bg-[#292524]/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`${stat.bg} p-1.5 rounded border ${stat.border}`}>
                                                <stat.icon className={`w-4 h-4 ${stat.color}`} aria-hidden="true" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-stone-300 font-serif" id={`label-${stat.key}`}>{stat.label}</span>
                                                {classBonus > 0 && <span className="text-[10px] text-emerald-500">+{classBonus} Class Bonus</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                type="button" 
                                                onClick={() => decrement(stat.key as keyof BaseStats)} 
                                                className="w-8 h-8 rounded hover:bg-[#292524] text-stone-500 hover:text-stone-300 flex items-center justify-center border border-transparent hover:border-[#292524] transition-all disabled:opacity-20" 
                                                disabled={stats[stat.key as keyof BaseStats] <= 10}
                                                aria-label={`Decrease ${stat.label}`}
                                            >
                                                -
                                            </button>
                                            <div className="flex flex-col items-center w-8">
                                                <span className="text-stone-100 font-mono text-lg" aria-labelledby={`label-${stat.key}`}>{total}</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => increment(stat.key as keyof BaseStats)} 
                                                className="w-8 h-8 rounded hover:bg-[#292524] text-stone-500 hover:text-stone-300 flex items-center justify-center border border-transparent hover:border-[#292524] transition-all disabled:opacity-20" 
                                                disabled={remainingPoints <= 0 || stats[stat.key as keyof BaseStats] >= 18}
                                                aria-label={`Increase ${stat.label}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: FEATS */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right fade-in duration-300">
                             <div className="text-center text-stone-400 text-sm mb-4">
                                Choose a special feat to distinguish your hero.
                             </div>
                             <div role="radiogroup" aria-label="Select a Feat" className="grid grid-cols-1 gap-3 max-h-[400px]">
                                {FEAT_OPTIONS.map((feat) => (
                                    <div 
                                        key={feat.name}
                                        role="radio"
                                        aria-checked={selectedFeat.name === feat.name}
                                        tabIndex={0}
                                        onClick={() => setSelectedFeat(feat)}
                                        onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSelectedFeat(feat) }}
                                        className={`p-3 rounded cursor-pointer border transition-all duration-200 flex items-start gap-3 outline-none focus:ring-1 focus:ring-amber-500
                                            ${selectedFeat.name === feat.name 
                                                ? 'bg-amber-900/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                                                : 'bg-[#0c0a09] border-[#292524] hover:border-stone-600'}
                                        `}
                                    >
                                        <div className={`mt-1 p-1 rounded-full ${selectedFeat.name === feat.name ? 'text-amber-500' : 'text-stone-600'}`}>
                                            {selectedFeat.name === feat.name ? <Check className="w-4 h-4" aria-hidden="true" /> : <Star className="w-4 h-4" aria-hidden="true" />}
                                        </div>
                                        <div>
                                            <h4 className={`font-display font-bold ${selectedFeat.name === feat.name ? 'text-amber-100' : 'text-stone-300'}`}>{feat.name}</h4>
                                            <p className="text-xs text-stone-400 italic mb-1">{feat.description}</p>
                                            <p className="text-[10px] text-emerald-500/80 uppercase tracking-wider">{feat.effect}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="mt-6 pt-4 border-t border-[#292524] flex justify-between gap-4">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2 rounded text-stone-400 hover:text-stone-200 border border-transparent hover:border-[#292524] flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
                        </button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (step === 1 && name) setStep(2);
                                if (step === 2 && remainingPoints === 0) setStep(3);
                            }}
                            disabled={(step === 1 && !name) || (step === 2 && remainingPoints !== 0)}
                            className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-8 py-2 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-stone-100 font-display font-bold rounded shadow-lg flex items-center gap-2 transition-all hover:scale-105 animate-pulse-amber"
                        >
                            <BookOpen className="w-4 h-4" aria-hidden="true" /> Begin Adventure
                        </button>
                    )}
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
