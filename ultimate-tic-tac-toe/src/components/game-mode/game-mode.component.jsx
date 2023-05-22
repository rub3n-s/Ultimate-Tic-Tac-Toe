import React from "react";
import "./game-mode.css";
import { Modal } from "../index";
import { useEffect, useRef, useState } from "react";

const GameMode = ({ showGameMode, retrieveData }) => {
  const inputNick1 = useRef(null);
  const inputNick2 = useRef(null);
  const inputTimer = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  const insertNickNames = () => {
    console.log("Selected Game Mode: ", gameMode);
    switch (gameMode) {
      case "pvc":
        setModalInfo(
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
                  onChange={(e) => clearWarning([e.target])}
                />
              </div>
              <div>
                Timer
                <input
                  type="number"
                  id="inputTimer"
                  size="16"
                  placeholder="Min: 5s, Max: 600s"
                  defaultValue={30}
                  step={5}
                  min={5}
                  max={600}
                  ref={inputTimer}
                  onChange={(e) => clearWarning([e.target])}
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
        setModalInfo(
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
                  onChange={(e) => clearWarning([e.target])}
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
                  onChange={(e) => clearWarning([e.target])}
                />
              </div>
              <div>
                Timer
                <input
                  type="number"
                  id="inputTimer"
                  placeholder="Min: 5s, Max: 600s"
                  size="16"
                  defaultValue={30}
                  step={5}
                  min={5}
                  max={600}
                  ref={inputTimer}
                  onChange={(e) => clearWarning([e.target])}
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
    const input1 = document.getElementById("inputNick1");
    const inputTimer = document.getElementById("inputTimer");

    switch (gameMode) {
      case "pvc":
        // Verify inputs
        verifyEmptyInputs([input1, inputTimer]);
        verifyInputsLength([input1]);
        verifyTimerInput(inputTimer);

        if (existInvalidInputs([input1, inputTimer])) return;

        // Retrieve players names and timeout data
        retrieveData(true, gameMode, input1.value, "computer", inputTimer.value);
        break;
      case "pvp":
        const input2 = document.getElementById("inputNick2");

        // Verify inputs
        verifyEmptyInputs([input1, input2, inputTimer]);
        verifyInputsLength([input1, input2]);
        verifyTimerInput(inputTimer);
        verifyEqualNames(input1, input2);

        if (existInvalidInputs([input1, input2, inputTimer])) return;

        // Retrieve players names and timeout data
        retrieveData(true, gameMode, input1.value, input2.value, inputTimer.value);
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

  // Inputs validation
  const verifyEmptyInputs = (inputs) => inputs.map((x) => (x.value === "" ? invalidInput([x]) : clearWarning([x])));

  const verifyTimerInput = (input) => {
    if (input.value < 5 || input.value > 600) invalidInput([input]);
  };

  const verifyEqualNames = (input1, input2) => {
    if (input1.value === input2.value) invalidInput([input1, input2]);
  };

  const verifyInputsLength = (inputs) =>
    inputs.forEach((input) => {
      if (input.value.length > 8) invalidInput([input]);
    });

  const invalidInput = (inputs) => inputs.map((x) => x.classList.add("warning"));

  const clearWarning = (inputs) => inputs.map((x) => x.classList.remove("warning"));

  const existInvalidInputs = (inputs) => {
    return inputs.some((x) => x.classList.contains("warning"));
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
        info={modalInfo}
        nickNameValidation={nickNameValidation}
      />
    </>
  );
};

export default GameMode;
