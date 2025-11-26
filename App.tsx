
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { ImageSize, Feat, BaseStats } from './types';
import { audioService, AmbientType } from './services/audio';
import { authService } from './services/auth';
import CharacterCreator from './components/CharacterCreator';
import ChatInterface from './components/ChatInterface';
import GameStateSidebar from './components/GameStateSidebar';
import LevelUpModal from './components/LevelUpModal';
import SettingsModal from './components/SettingsModal';
import GameOverModal from './components/GameOverModal';
import LandingPage from './components/LandingPage';
import { Menu, X, Settings, AlertOctagon, LogOut } from 'lucide-react';
import { useGameEngine } from './hooks/useGameEngine';

const App: React.FC = () => {
  // --- Auth & Init ---
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
      // Subscribe to Firebase Auth state
      const unsubscribe = authService.onAuthStateChange((currentUser) => {
          setUser(currentUser);
          setLoadingAuth(false);
      });
      return () => unsubscribe();
  }, []);

  // --- Game Engine Hook ---
  // Now handles async loading via the user object
  const {
      gameState,
      messages,
      isCharacterCreated,
      isLoading,
      processTurn,
      handleCharacterComplete,
      handleLevelUpComplete,
      handleRespawn,
      handleManualSave,
      handleResetCampaign,
      addMessage
  } = useGameEngine(user);

  // --- UI State ---
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // --- User Preferences ---
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [imageGenEnabled, setImageGenEnabled] = useState(true);
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.Size_1K);
  const [textSpeed, setTextSpeed] = useState<'normal' | 'fast' | 'instant'>('normal');

  const isDead = gameState.player.hp.current <= 0 && isCharacterCreated;

  // --- Audio Logic ---
  useEffect(() => {
    if (!user || !isCharacterCreated) {
        audioService.setMute(true);
        return;
    }
    
    const loc = gameState.worldState.location.toLowerCase();
    let ambient: AmbientType = 'none';
    if (loc.includes('dungeon') || loc.includes('cave') || loc.includes('crypt')) ambient = 'dungeon';
    else if (loc.includes('forest') || loc.includes('woods') || loc.includes('wild')) ambient = 'forest';
    else if (loc.includes('town') || loc.includes('city') || loc.includes('tavern')) ambient = 'town';

    audioService.setMute(!soundEnabled);
    if (soundEnabled) audioService.playAmbient(ambient);
  }, [gameState.worldState.location, soundEnabled, isCharacterCreated, user]);

  // --- Handlers ---
  const onCharacterComplete = async (name: string, charClass: string, stats: BaseStats, feat: Feat) => {
      const result = await handleCharacterComplete(name, charClass, stats, feat);
      if (result) await processTurn(result.startPrompt, result.newGameState, [], { imageGenEnabled, imageSize });
  };

  const onRespawnConfirm = async () => {
      const result = await handleRespawn();
      if (result) await processTurn(result.prompt, result.revivedState, messages, { imageGenEnabled, imageSize });
  };

  const handleSendMessage = (text: string) => {
    addMessage('user', text);
    processTurn(text, gameState, messages, { imageGenEnabled, imageSize });
  };

  const handleLogout = () => {
      authService.logout();
      audioService.setMute(true);
  };

  // --- Render ---
  if (loadingAuth) return <div className="h-screen bg-[#0c0a09] flex items-center justify-center text-stone-500 animate-pulse font-serif">Loading Realm...</div>;
  if (!user) return <LandingPage />;

  return (
    <div className="flex h-[100dvh] w-full bg-[#0c0a09] overflow-hidden text-[#e7e5e4]">
      {/* 1. System Alerts */}
      {!process.env.API_KEY && (
          <div className="fixed top-0 left-0 right-0 z-[100] bg-red-900/90 text-white text-center p-2 text-sm font-bold flex items-center justify-center gap-2" role="alert">
              <AlertOctagon className="w-4 h-4" /> CRITICAL ERROR: No Gemini API Key Found.
          </div>
      )}

      {/* 2. Controls & Menus */}
      <div className="md:hidden fixed top-4 left-4 z-50 flex gap-2">
        <button onClick={() => setShowSidebar(!showSidebar)} className="bg-[#292524] p-2 rounded text-amber-500 shadow-lg border border-[#44403c]" aria-label="Menu">
            {showSidebar ? <X /> : <Menu />}
        </button>
        <button onClick={() => setShowSettings(true)} className="bg-[#292524] p-2 rounded text-stone-400 shadow-lg border border-[#44403c]" aria-label="Settings">
            <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="hidden md:flex absolute top-4 right-4 z-50 gap-2">
        <div className="flex items-center gap-2 bg-[#1c1917]/80 px-3 rounded-full border border-[#292524] text-xs text-stone-500 mr-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            {user.email}
        </div>
        <button onClick={() => setShowSettings(true)} className="bg-[#1c1917]/90 p-2 rounded-full text-stone-500 hover:text-amber-500 hover:rotate-90 transition-all shadow-lg border border-[#292524]" title="Settings">
            <Settings className="w-5 h-5" />
        </button>
        <button onClick={handleLogout} className="bg-[#1c1917]/90 p-2 rounded-full text-stone-500 hover:text-red-500 transition-all shadow-lg border border-[#292524]" title="Logout">
            <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Modals */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onSave={handleManualSave}
        onReset={handleResetCampaign}
        soundEnabled={soundEnabled}
        toggleSound={() => setSoundEnabled(!soundEnabled)}
        imageGenEnabled={imageGenEnabled}
        toggleImageGen={() => setImageGenEnabled(!imageGenEnabled)}
        imageQuality={imageSize}
        setImageQuality={setImageSize}
        textSpeed={textSpeed}
        setTextSpeed={setTextSpeed}
      />
      
      <GameOverModal isOpen={isDead} onRespawn={onRespawnConfirm} onRestart={handleResetCampaign} />
      
      {!isCharacterCreated && <CharacterCreator onComplete={onCharacterComplete} />}
      
      {isCharacterCreated && gameState.player.unspentStatPoints > 0 && (
          <LevelUpModal currentStats={gameState.player.stats} pointsToSpend={gameState.player.unspentStatPoints} onComplete={handleLevelUpComplete} />
      )}

      {/* 4. Main Game Layout */}
      <div className="flex-1 h-full relative flex">
        <div className="flex-1 h-full w-full">
            <ChatInterface 
                messages={messages} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage}
                imageSize={imageSize}
                onImageSizeChange={setImageSize}
                gameState={gameState}
            />
        </div>

        <aside 
            className={`fixed inset-y-0 right-0 w-80 bg-[#1c1917] transform transition-transform duration-300 ease-in-out z-40 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l border-[#292524] md:relative md:transform-none md:translate-x-0 ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
            aria-hidden={!showSidebar && window.innerWidth < 768}
        >
            <GameStateSidebar gameState={gameState} isLoading={isLoading} onAction={handleSendMessage} soundEnabled={soundEnabled} />
        </aside>

        {showSidebar && <div className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-sm" onClick={() => setShowSidebar(false)} />}
      </div>
    </div>
  );
};

export default App;
