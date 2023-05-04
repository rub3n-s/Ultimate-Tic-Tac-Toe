import "./GameMode.css";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

const GameMode = ({ showGameMode, retrieveData }) => {
  const inputNick1 = useRef(null);
  const inputNick2 = useRef(null);
  const inputTimer = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [info, setInfo] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  const insertNickNames = () => {
    console.log("Selected Game Mode: ", gameMode);
    switch (gameMode) {
      case "pvc":
        setInfo(
          <>
            <div className="info">
              <div>
                Player 1
                <input
                  type="text"
                  id="inputNick1"
                  size="16"
                  placeholder="Insert Player's 1 NickName"
                  ref={inputNick1}
                />
              </div>
              <div>
                Timer
                <input
                  type="number"
                  id="inputTimer"
                  size="16"
                  defaultValue={120}
                  step={5}
                  min={1}
                  max={600}
                  ref={inputTimer}
                />
              </div>
            </div>
            <div className="info-button">
              <button onClick={nickNameValidation}>Ok</button>
            </div>
          </>
        );
        setOpenModal(true);
        break;
      case "pvp":
        setInfo(
          <>
            <div className="info">
              <div>
                Player 1
                <input
                  type="text"
                  id="inputNick1"
                  size="16"
                  placeholder="Insert Player's 1 NickName"
                  ref={inputNick1}
                />
              </div>
              <div>
                Player 2
                <input
                  type="text"
                  id="inputNick2"
                  size="16"
                  placeholder="Insert Player's 2 NickName"
                  ref={inputNick2}
                />
              </div>
              <div>
                Timer
                <input
                  type="number"
                  id="inputTimer"
                  size="16"
                  defaultValue={120}
                  step={5}
                  min={120}
                  max={600}
                  ref={inputTimer}
                />
              </div>
            </div>
            <div className="info-button">
              <button onClick={nickNameValidation}>Ok</button>
            </div>
          </>
        );
        setOpenModal(true);
        break;
      default:
        console.log("Error receiving game mode...");
    }
  };

  const nickNameValidation = () => {
    console.log(`Game Mode: ${gameMode}`);

    const emptyInputPlayer1 = inputNick1.current.value === "";
    const emptyInputTimer = inputTimer.current.value === "";

    switch (gameMode) {
      case "pvc":
        if (emptyInputPlayer1) {
          // Change input background-color
          inputNick1.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid player 1 nickname");
          return;
        } else if (emptyInputTimer) {
          // Change input background-color
          inputTimer.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid timer value");
          return;
        }
        // Reset the background property
        inputNick1.current.style.backgroundColor = "white";

        // Retrieve players names and timeout data
        retrieveData(true, gameMode, inputNick1.current.value, "computer", inputTimer.current.value);

        // Display player 1 and player 2 nick names
        console.log(`Player 1: ${inputNick1.current.value} vs Player 2: computer`);
        break;
      case "pvp":
        const emptyInputPlayer2 = inputNick2.current.value === "";
        const sameName = inputNick1.current.value === inputNick2.current.value;

        if (emptyInputPlayer1) {
          // Change input background-color
          inputNick1.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid player 1 nickname");
          return;
        } else if (emptyInputPlayer2) {
          // Change input background-color
          inputNick2.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid player 2 nickname");
          return;
        } else if (sameName) {
          // Change input background-color
          inputNick1.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          inputNick2.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Player 1 and Player 2 can't have the same nickname");
          return;
        } else if (emptyInputTimer) {
          // Change input background-color
          inputTimer.current.style.backgroundColor = "rgba(219,0,0,0.5)";
          console.log("Invalid timer value");
          return;
        }

        // Reset the background property
        inputNick1.current.style.backgroundColor = "white";
        inputNick2.current.style.backgroundColor = "white";

        // Display player 1 and player 2 nick names
        console.log(`Player 1: ${inputNick1.current.value} vs Player 2: ${inputNick2.current.value}`);

        // Retrieve players names and timeout data
        retrieveData(true, gameMode, inputNick1.current.value, inputNick2.current.value, inputTimer.current.value);
        break;
      default:
    }

    // Change states to replace the components visibility
    handleCloseModal();
  };

  // If the modal gets close, reset gameMode and openModal states
  const handleCloseModal = () => {
    setOpenModal(false);
    setGameMode(null);
  };

  // Create an action on the update of gameMode
  // Calls the function to open
  useEffect(() => {
    if (gameMode == null || !showGameMode) return;

    // On game mode change, request player's nick name
    insertNickNames();

    // eslint-disable-next-line
  }, [gameMode]);

  return (
    <>
      {showGameMode && (
        <main>
          <div className="gameMode">
            <button id="pvcButton" onClick={() => setGameMode("pvc")}>
              <span>Player vs Computer</span>
            </button>
            <button id="pvpButton" onClick={() => setGameMode("pvp")}>
              <span>Player vs Player</span>
            </button>
          </div>
        </main>
      )}

      <Modal
        openModal={openModal}
        gameMode={gameMode}
        onHide={handleCloseModal}
        title={"What's your name"}
        info={info}
        nickNameValidation={nickNameValidation}
      />
    </>
  );
};

export default GameMode;
