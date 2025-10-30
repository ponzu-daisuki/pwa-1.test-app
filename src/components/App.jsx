import React,{useState, useEffect, useRef} from 'react';
import {oscillatorNode, playSound, stopSound, changeFrequency, getFrequencyFromPushedStatus} from './audioControl.js';

//定数
const VOLUME_CONFIG = {
  title : "volume",
  min : 0,
  max : 1,
  step : 0.01
}
const BUTTON_SIZE_CONFIG = {
  title : "size",
  min : 50,
  max : 500,
  step : 5
}
const BUTTON_MARGIN_CONFIG = {
  title : "margin",
  min : 0,
  max : 100,
  step : 10
}
const LOOP_ON_TITLE = "Keep";

//コンポーネント
function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  function handleChangeIsPlaying(){
    oscillatorNode.start();
    setIsPlaying(prev => !prev);
  }

  return (
    <>
      <button disabled={isPlaying} onClick={handleChangeIsPlaying}>
        {isPlaying ? "NOW PLAYING" : "START"}
      </button>
      {isPlaying ? (
      <Player isPlaying={isPlaying}/>
      ):(
      <p>STARTを押すと開始します</p>
      )}
    </>
  );
}

function Player(){
  const [volume, setVolume] = useState(0.1);

  function handleChangeVolume(e){
    const nextVolume = e.target.value;
    setVolume(nextVolume);
  }

  return (
    <div className="Player">
      <ConfigsTable
        volume={volume}
        onChangeVolume={handleChangeVolume}
      />
      <SoundController
        volume={volume}/>
    </div>
  );
}

function ConfigsTable({
  volume,
  onChangeVolume,
}) {
  return (
    <table className="ConfigsTable">
      <thead>
        <tr>
          <th colSpan="2">Config</th>
        </tr>
      </thead>
      <tbody>
        <ConfigRow {...VOLUME_CONFIG} value={volume} onChange={onChangeVolume}/>
      </tbody>
    </table>
  );
}

function ConfigRow({ title, value, min, max, step, onChange }) {
  return (
    <tr>
      <th>
        {title}
      </th>
      <th>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}/>
      </th>
    </tr>
  );
}

function SoundController({ volume }) {

  return (
    <div className="SoundController">
      <ChangeSoundButtons volume={volume}/>
    </div>
  );
}

function ChangeSoundButtons({ volume }) {
  const buttonPushedStatus = useRef({one:false, two:false, three:false});

  function isPlaySound(buttonPushedStatus) {
    for(const value of Object.values(buttonPushedStatus.current)) {
      if(value) return true;
    }
    return false;
  }

  useEffect(() => {
    function handleKeyChangeFrequency(e) {
      e.preventDefault();
      e.stopPropagation();

      if(e.repeat)return;
      if(e.key !== "j" && e.key !== "k" && e.key !== "l")return;

      let nowPlaySound = isPlaySound(buttonPushedStatus);
      const isPushed = e.type === "keydown";
      switch(e.key) {
        case "j" :
          buttonPushedStatus.current.one = isPushed;
          break;
        case "k" :
          buttonPushedStatus.current.two = isPushed;
          break;
        case "l" :
          buttonPushedStatus.current.three = isPushed;
          break;
      }
      let nextPlaySound = isPlaySound(buttonPushedStatus);
      if(nowPlaySound && nextPlaySound) {
        changeFrequency(getFrequencyFromPushedStatus(buttonPushedStatus.current));
      } else if (!nowPlaySound && nextPlaySound) {
        changeFrequency(getFrequencyFromPushedStatus(buttonPushedStatus.current));
        playSound(volume);
      } else if (nowPlaySound && !nextPlaySound) {
        stopSound();
      }
    }

    window.addEventListener('keydown', handleKeyChangeFrequency);
    window.addEventListener('keyup', handleKeyChangeFrequency);

    return () => {
      window.removeEventListener('keydown', handleKeyChangeFrequency);
      window.removeEventListener('keyup', handleKeyChangeFrequency);
    }
  },[volume]);


  function handleTouchChangeFrequency(e) {
    let nowPlaySound = isPlaySound(buttonPushedStatus);
    const isPushed = e.type === "pointerdown";
    switch(e.target.name) {
      case "one" :
        buttonPushedStatus.current.one = isPushed;
        break;
      case "two" :
        buttonPushedStatus.current.two = isPushed;
        break;
      case "three" :
        buttonPushedStatus.current.three = isPushed;
        break;
    }
    changeFrequency(getFrequencyFromPushedStatus(buttonPushedStatus.current));
    let nextPlaySound = isPlaySound(buttonPushedStatus);
    if(!nowPlaySound && nextPlaySound) {
      playSound(volume);
    } else if (nowPlaySound && !nextPlaySound) {
      stopSound();
    }
  }

  return (
    <div className="ChangeSoundButtons">
      <ChangeSoundButton name="three" keyName="l" onChangeFrequency={handleTouchChangeFrequency}/>
      <ChangeSoundButton name="two" keyName="k" onChangeFrequency={handleTouchChangeFrequency}/>
      <ChangeSoundButton name="one" keyName="j" onChangeFrequency={handleTouchChangeFrequency}/>
    </div>
  );
}

function ChangeSoundButton({ name, keyName, onChangeFrequency }) {
  return (
    <div>
      <button
        name={name}
        onPointerDown={onChangeFrequency}
        onPointerUp={onChangeFrequency}
        onPointerLeave={onChangeFrequency}>
        {keyName}
      </button>
    </div>
  );
}

export default App;