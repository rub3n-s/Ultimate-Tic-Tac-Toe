import './GameMode.css';

const GameMode = () => {
  return (
    <div className="container">
      <div className="gameMode">
        <button id="pvcButton"><span>Player vs Computer</span></button>
        <button id="pvpButton"><span>Player vs Player</span></button>
      </div>
    </div>
  );
};

export default GameMode;
