import "./GamePanel.css";

const buildGrids = () => {
  let content = [];
  let outerGrid = 9;  // 3x3 grid
  for (let i = 0; i < outerGrid; i++) {
    content.push(
      <div className="box">
        {gameGrid()}
      </div>
    );
  }
  return content;
};

const gameGrid = () => {
  return (
    // TODO
    //criar listeners para o click de cada celula
    
    <div className="box">
      <div className="grid"></div>
      <div className="grid"></div>
      <div className="grid"></div>
      <div className="grid"></div>
      <div className="grid"></div>
      <div className="grid"></div>
      <div className="grid"></div>
      <div className="grid"></div>
      <div className="grid"></div>
    </div>
  );
};

const GamePanel = ({ showGrid }) => {
  return (
    <>
      {showGrid && (
        <div className="grid-wrapper">
          {buildGrids()}
        </div>
      )}
    </>
  );
};

export default GamePanel;
