import "./assets/styles/App.css";
import "./assets/styles/w3.css";
import { Navbar, GameMode, GamePanel, Footer } from "./components/index";
import { useState } from "react";

function App() {
  const [showGame, setShowGame] = useState(false);
  const [showGameMode, setShowGameMode] = useState(true);
  const [gameMode, setGameMode] = useState(null);
  const [player1Name, setPlayer1Name] = useState(null);
  const [player2Name, setPlayer2Name] = useState(null);
  const [timeOut, setTimeOut] = useState(null);

  const handleCloseGrid = () => {
    setShowGame(false);
    setShowGameMode(true);
    setGameMode(null);
    setPlayer1Name(null);
    setPlayer2Name(null);
    setTimeOut(null);
  };

  const handleGameMode = (showGame, gameMode, player1Name, player2Name, timeOut) => {
    setShowGame(showGame);
    setGameMode(gameMode);
    setPlayer1Name(player1Name);
    setPlayer2Name(player2Name);
    setTimeOut(timeOut);
    setShowGameMode(false);
  };

  return (
    <>
      <Navbar />

      <GameMode showGameMode={showGameMode} retrieveData={handleGameMode} />

      <GamePanel
        showGame={showGame}
        handleCloseGrid={handleCloseGrid}
        gameMode={gameMode}
        player1Name={player1Name}
        player2Name={player2Name}
        timeOut={timeOut}
      />

      <Footer />
    </>
  );
}

export default App;
