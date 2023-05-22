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
                  step={5}
                  min={5}
                  max={600}
                  ref={inputTimer}
                  onChange={(e) => clearWarning([e.target])}
                />
              </div>
              <span id="message"></span>
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
                  step={5}
                  min={5}
                  max={600}
                  ref={inputTimer}
                  onChange={(e) => clearWarning([e.target])}
                />
              </div>
              <span id="message"></span>
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
        // Verify input values
        verifyInputs([input1, inputTimer]);

        if (existInvalidInputs([input1, inputTimer])) return;

        // Retrieve players names and timeout data
        retrieveData(true, gameMode, input1.value, "computer", inputTimer.value);
        break;
      case "pvp":
        const input2 = document.getElementById("inputNick2");

        // Verify inputs
        verifyInputs([input1, input2, inputTimer]);

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
  const verifyInputs = (inputs) => {
    let message = "";

    // Clear previous warnings
    clearWarning(inputs);

    // Verify if inputs are empty
    let empty = false;
    inputs.forEach((input) => {
      if (input.value === "") {
        invalidInput([input]);
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
      if (input.value.length > 8) {
        invalidInput([input]);
        message += "<p>Name maximum length is 8 characters</p>";
      }
    });

    // Verify same name
    switch (gameMode) {
      case "pvc":
        if (inputs[0].value.toLowerCase() === "computer") {
          invalidInput([inputs[0]]);
          message += "<p>Player and computer need different names</p>";
        }
        break;
      case "pvp":
        if (inputs[0].value === inputs[1].value) {
          invalidInput([inputs[0], inputs[1]]);
          message += "<p>Names cannot be the same</p>";
        }
        break;
      default:
    }

    // Verify min and max time
    const timer = inputs[inputs.length - 1];
    if (timer.value < 5 || timer.value > 600) {
      invalidInput([timer]);
      message += "<p>Timer needs to be between 5 and 600 (inclusive)</p>";
    }

    // Set the built message
    setMessage(message);
  };

  const invalidInput = (inputs) => inputs.map((x) => x.classList.add("warning"));

  const clearWarning = (inputs) => {
    inputs.map((x) => x.classList.remove("warning"));
    setMessage("");
  };

  const existInvalidInputs = (inputs) => {
    return inputs.some((x) => x.classList.contains("warning"));
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

    document.getElementById("message").innerHTML = message;
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
