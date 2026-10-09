import { useState } from 'react';
import type { GameMode, GameScreen as ScreenType, QuizCategory } from './types/game';
import { useGameSettings } from './hooks/useGameSettings';
import { DesktopBackground } from './components/DesktopBackground';
import { GameFrame } from './components/GameFrame';
import { WorldMapBackground } from './components/WorldMapBackground';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { GirlHandCursor } from './components/GirlHandCursor';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('classic');
  const [activeQuizCategory, setActiveQuizCategory] = useState<QuizCategory>('country');
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { settings, updateSetting, resetSettings } = useGameSettings();

  const handleStartGame = (mode: GameMode, category: QuizCategory = 'country') => {
    setActiveGameMode(mode);
    setActiveQuizCategory(category);
    setCurrentScreen('game');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070913] font-sans">
      {/* Outer Desktop Colorful Ambient Environment */}
      <DesktopBackground />

      {/* Centered 9:16 Vertical Mobile Screen Application */}
      <GameFrame>
        {/* Clean World Design Map Background */}
        <WorldMapBackground />

        {/* Screen Switcher */}
        {currentScreen === 'home' ? (
          <HomeScreen
            onPlay={handleStartGame}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            soundEnabled={settings.soundEffects}
          />
        ) : (
          <GameScreen
            mode={activeGameMode}
            category={activeQuizCategory}
            onGoHome={handleGoHome}
            onOpenSettings={() => setIsSettingsOpen(true)}
            settings={settings}
            updateSetting={updateSetting}
          />
        )}

        {/* Global Modals */}
        <HowToPlayModal
          isOpen={isHowToPlayOpen}
          onClose={() => setIsHowToPlayOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          updateSetting={updateSetting}
          resetSettings={resetSettings}
        />
      </GameFrame>

      {/* Custom Big Girl Hand Mouse Cursor */}
      <GirlHandCursor />
    </div>
  );
}

export default App;
