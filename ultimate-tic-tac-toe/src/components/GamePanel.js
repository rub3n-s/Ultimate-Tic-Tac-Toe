import { useState } from "react";
import "./GamePanel.css";

const GamePanel = ({ showGrid }) => {
  // const clickHandle = (event, grid, line, column) => {
  //   const style = {
  //     backgroundColor:'red',
  //     gridLine: `${line}`,
  //     gridColumn: `${column}`
  //   }
  //   const element = event.target;
  //   //element.classList
  //   console.log(`[Cell Click] grid:${grid}, cell(${line},${column})`);
  // };

  const clickHandle = (event, gridIndex, line, column) => {
    event.target.className = "cell clicked";
    console.log(`[Cell Click] grid:${gridIndex}, cell(${line},${column})`);
  };

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
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 0, 0)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 0, 1)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 0, 2)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 1, 0)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 1, 1)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 1, 2)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 2, 0)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 2, 1)}
        ></div>
        <div
          className="cell"
          onClick={(event) => clickHandle(event, i, 2, 2)}
        ></div>
      </div>
    );
  };
  return <>{showGrid && <div className="grid-wrapper">{buildGrids()}</div>}</>;
};

export default GamePanel;
