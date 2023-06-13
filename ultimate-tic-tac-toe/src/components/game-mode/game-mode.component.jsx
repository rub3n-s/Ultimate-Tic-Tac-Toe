import React from "react";
import "./game-mode.css";
import { Modal } from "../index";
import { useEffect, useRef, useState } from "react";

const GameMode = ({ showGameMode, retrieveData }) => {
  const inputNick1 = useRef(null);
  const inputNick2 = useRef(null);
  const inputTimer = useRef(null);
  const spanMessage = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [message, setMessage] = useState("");

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
                  onChange={() => clearWarning([inputNick1])}
                />
              </div>
              <div>
                Timer
                <input
                  type="number"
                  id="inputTimer"
                  size="16"
                  placeholder="Min: 5s, Max: 600s"
                  step={5}
                  min={5}
                  max={600}
                  ref={inputTimer}
                  onChange={() => clearWarning([inputTimer])}
                />
              </div>
              <span id="message" ref={spanMessage}></span>
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
                  onChange={() => clearWarning([inputNick1])}
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
                  onChange={() => clearWarning([inputNick2])}
                />
              </div>
              <div>
                Timer
                <input
                  type="number"
                  id="inputTimer"
                  placeholder="Min: 5s, Max: 600s"
                  size="16"
                  step={5}
                  min={5}
                  max={600}
                  ref={inputTimer}
                  onChange={() => clearWarning([inputTimer])}
                />
              </div>
              <span id="message" ref={spanMessage}></span>
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
    switch (gameMode) {
      case "pvc":
        // Verify input values
        verifyInputs([inputNick1, inputTimer]);

        if (existInvalidInputs([inputNick1, inputTimer])) return;

        // Retrieve players names and timeout data
        retrieveData(true, gameMode, inputNick1.current.value, "computer", inputTimer.current.value);
        break;
      case "pvp":
        // Verify inputs
        verifyInputs([inputNick1, inputNick2, inputTimer]);

        if (existInvalidInputs([inputNick1, inputNick2, inputTimer])) return;

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

  // Inputs validation
  const verifyInputs = (inputs) => {
    let message = "";

    // Clear previous warnings
    clearWarning(inputs);

    // Verify if inputs are empty
    let empty = false;
    inputs.forEach((input) => {
      if (input.current.value === "") {
        invalidInput([input.current]);
        empty = true;
      }
    });

    if (empty) {
      message += "<p>Inputs cannot be empty</p>";
      setMessage(message);
      return;
    }

    // Verify input length
    inputs.forEach((input) => {
      if (input.current.value.length > 8) {
        invalidInput([input.current]);
        message += "<p>Name maximum length is 8 characters</p>";
      }
    });

    // Verify same name
    switch (gameMode) {
      case "pvc":
        if (inputNick1.current.value.toLowerCase() === "computer") {
          invalidInput([inputNick1.current]);
          message += "<p>Player and computer need different names</p>";
        }
        break;
      case "pvp":
        if (inputNick1.current.value === inputNick2.current.value) {
          invalidInput([inputNick1.current, inputNick2.current]);
          message += "<p>Names cannot be the same</p>";
        }
        break;
      default:
    }

    // Verify min and max time
    if (inputTimer.current.value < 5 || inputTimer.current.value > 600) {
      invalidInput([inputTimer.current]);
      message += "<p>Timer needs to be between 5 and 600 (inclusive)</p>";
    }

    // Set the built message
    setMessage(message);
  };

  const invalidInput = (inputs) => inputs.map((x) => x.classList.add("warning"));

  const clearWarning = (inputs) => {
    inputs.map((x) => x.current.classList.remove("warning"));
    setMessage("");
  };

  const existInvalidInputs = (inputs) => {
    return inputs.some((x) => x.current.classList.contains("warning"));
  };

  // Create an action on the update of gameMode
  // Calls the function to open
  useEffect(() => {
    if (gameMode === null || !showGameMode) return;

    // On game mode change, request player's nick name
    insertNickNames();

    // eslint-disable-next-line
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === null || !showGameMode) return;

    spanMessage.current.innerHTML = message;
    // eslint-disable-next-line
  }, [message]);

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
