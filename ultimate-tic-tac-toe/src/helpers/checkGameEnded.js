/*  =======================================================
                      Check Game Ended
    =======================================================
      -> Check if all the cells are filled or all the tables
          have a winner
*/
const checkGameEnded = (mainTable, player1Info, player2Info) => {
  // Get all tables with a winner
  const allTablesWon =
    Array.from(mainTable.current.children).filter((x) => x.classList.contains("winX") || x.classList.contains("winO"))
      .length === 9;

  // All tables have a winner
  if (allTablesWon) return true;

  // Check if all the cells are filled
  for (let table of mainTable.current.children) {
    if (!table.classList.contains("winX") && !table.classList.contains("winO")) {
      const tableIsFull =
        Array.from(table.children).filter(
          (x) => x.classList.contains(player1Info.symbol) || x.classList.contains(player2Info.symbol)
        ).length < 9;
      if (tableIsFull) return false;
    }
  }

  return true;
};

export default checkGameEnded;
