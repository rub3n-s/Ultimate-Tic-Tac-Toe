/*  =======================================================
              Play Validation
    =======================================================
    -> Check if the cell is available
*/
const containsClass = (element) => {
  return (
    element.classList.contains("X") || element.classList.contains("O") || element.classList.contains("disabled-cell")
  );
};

export default containsClass;