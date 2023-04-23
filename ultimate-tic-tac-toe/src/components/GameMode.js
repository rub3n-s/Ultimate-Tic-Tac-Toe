import "./GameMode.css";

const GameMode = ({ showGameMode, handleGameMode }) => {
  return (
    <>
      {showGameMode && (
        <div className="container">
          <div className="gameMode">
            <button id="pvcButton" onClick={() => handleGameMode('pvc')}>
              <span>Player vs Computer</span>
            </button>
            <button id="pvpButton" onClick={() => handleGameMode('pvp')}>
              <span>Player vs Player</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GameMode;
