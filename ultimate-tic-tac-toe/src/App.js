import "./App.css";
import "./components/GameMode.css";
import Footer from "./components/Footer";
import GameMode from "./components/GameMode";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import {useState} from 'react';

function App() {
  const [open, setOpen] = useState(false);
  const [gameMode, setGameMode] = useState(null);

  const pvcClickHandle = () => {
    setOpen(true);
    setGameMode('PVC');
  };
  
  const pvpClickHandle = () => {
    setOpen(true);
    setGameMode('PVP');
  };

  const handleClose = () => setOpen(false);

  const getNickNames = (nickName1,nickName2) => {
    console.log(`Player 1: ${nickName1}\nPlayer 2: ${nickName2}\n`)
    handleClose();
  }

  return (
    <>
    {/*===== Navigation Bar =====*/}
      <Navbar />
      
      {/*===== GameMode Buttons =====*/}
      <div className="container">
        <div className="gameMode">
          <button id="pvcButton" onClick={pvcClickHandle}>
            <span>Player vs Computer</span>
          </button>
          <button id="pvpButton" onClick={pvpClickHandle}>
            <span>Player vs Player</span>
          </button>
        </div>
      </div>

      <Modal open={open} onHide={handleClose} gameMode={gameMode} getNickNames={getNickNames}/>

      <Footer />
    </>
  );
}

export default App;
