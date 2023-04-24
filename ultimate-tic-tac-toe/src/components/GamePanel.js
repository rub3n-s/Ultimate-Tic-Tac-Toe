import "./GamePanel.css";

const buildGrids = () => {
  let content = [];
  let outerGrid = 9; // 3x3 grid
  for (let i = 0; i < outerGrid; i++) {
    content.push(gameGrid(i));
  }
  return content;
};

const gameGrid = (i) => {
  // This function receives the grid index
  // Each cell has a click event, where the cell index is sent
  // to a separate function to handle click events
  return (
    <div className="box">
      <div className="cell" onClick={() => clickHandle(this, i, 1, 1)}></div>
      <div className="cell" onClick={() => clickHandle(i, 1, 2)}></div>
      <div className="cell" onClick={() => clickHandle(i, 1, 3)}></div>
      <div className="cell" onClick={() => clickHandle(i, 2, 1)}></div>
      <div className="cell" onClick={() => clickHandle(i, 2, 2)}></div>
      <div className="cell" onClick={() => clickHandle(i, 2, 3)}></div>
      <div className="cell" onClick={() => clickHandle(i, 3, 1)}></div>
      <div className="cell" onClick={() => clickHandle(i, 3, 2)}></div>
      <div className="cell" onClick={() => clickHandle(i, 3, 3)}></div>
    </div>
  );
};

const clickHandle = (element, grid, line, column) => {
  element.classList.add("clicked");
  console.log(`[Cell Click] grid:${grid}, cell(${line},${column})`);
};

const GamePanel = ({ showGrid }) => {
  return <>{showGrid && <div className="grid-wrapper">{buildGrids()}</div>}</>;
};

export default GamePanel;
