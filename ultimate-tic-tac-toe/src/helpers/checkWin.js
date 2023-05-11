import mapTable from "./mapTable";

/*  =======================================================
                           Check Win
    =======================================================
      -> Check if the player won the current played table
*/
const checkWin = (table, player) => {
    // Map table for easier data access
    const mappedTable = mapTable(table);
    console.log("[Check Win] Mapped Table", mappedTable);

    /* ================================
                      LINES 
      ================================
    */
    for (let i = 0; i < mappedTable.length; i++) {
      // Get the an array of cells on line i
      const line = mappedTable[i];

      // Check if the player won line i
      const win = line.filter((x) => x.classList.contains(player.symbol)).length === 3;
      if (win) return true;
    }

    /* ================================
                      COLUMNS 
      ================================
    */
    for (let i = 0; i < mappedTable.length; i++) {
      let column = [];
      for (let j = 0; j < mappedTable.length; j++)
        // Get the an array of cells on column i and line j
        column.push(mappedTable[j][i]);

      // Check if the player won line i
      const win = column.filter((x) => x.classList.contains(player.symbol)).length === 3;
      if (win) return true;
    }

    /* ================================
                      DIAGONALS 
      ================================
    */
    // Up left to Down right / Up right to Down left
    const diagonals = [
      [mappedTable[0][0], mappedTable[1][1], mappedTable[2][2]],
      [mappedTable[0][2], mappedTable[1][1], mappedTable[2][0]],
    ];

    for (let i = 0; i < diagonals.length; i++) {
      const diagonal = diagonals[i];

      const win = diagonal.filter((x) => x.classList.contains(player.symbol)).length === 3;
      if (win) return true;
    }

    return false;
  };

  export default checkWin;