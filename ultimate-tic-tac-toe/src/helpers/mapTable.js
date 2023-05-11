/*  =======================================================
                            Map Table
      =======================================================
      -> Get a table in form of a bidimensional array
*/
const mapTable = (table) => {
  let mappedTable = [];
  let cellIndex = 0;
  for (let line = 0; line < 3; line++) {
    // Push an empty array for columns in line x
    mappedTable.push([]);
    for (let column = 0; column < 3; column++) {
      mappedTable[line].push(table.children[cellIndex]);
      cellIndex++;
    }
  }
  return mappedTable;
};

export default mapTable;
