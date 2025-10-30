import React,{useState, useEffect} from 'react';
import {oscillatorNode, playSound, stopSound, changeFrequency, getFrequencyFromPushedStatus} from './function.js';

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
  const [buttonSize, setButtonSize] = useState(100);
  const [buttonMargin, setButtonMargin] = useState(10);
  const [inLoop, setInLoop] = useState(false);

  function handleChangeVolume(e){
    const nextVolume = e.target.value;
    if(inLoop){
      playSound(nextVolume);
    }
    setVolume(nextVolume);
  }
  function handleChangeButtonSize(e){
    setButtonSize(e.target.value);
  }
  function handleChangeButtonMargin(e){
    setButtonMargin(e.target.value);
  }
  function handleChangeInLoop(e){
    const nextInLoop = !inLoop;
    if(nextInLoop){
      playSound(volume);
    }else{
      stopSound();
    }
    setInLoop(prev => !prev);
  }

  return (
    <div className="Player">
      <ConfigsTable
        volume={volume}
        buttonSize={buttonSize}
        buttonMargin={buttonMargin}
        inLoop={inLoop}
        onChangeVolume={handleChangeVolume}
        onChangeButtonSize={handleChangeButtonSize}
        onChangeButtonMargin={handleChangeButtonMargin}
        onChangeInLoop={handleChangeInLoop}
      />
      <SoundController
        inLoop={inLoop}
        volume={volume}/>
    </div>
  );
}

function ConfigsTable({
  volume,
  buttonSize,
  buttonMargin,
  inLoop,
  onChangeVolume,
  onChangeButtonSize,
  onChangeButtonMargin,
  onChangeInLoop
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
        {/*<ConfigRow {...BUTTON_SIZE_CONFIG} value={buttonSize} onChange={onChangeButtonSize}/>*/}
        {/*<ConfigRow {...BUTTON_MARGIN_CONFIG} value={buttonMargin} onChange={onChangeButtonMargin}/>*/}
        <LoopOnRow inLoop={inLoop} onChange={onChangeInLoop}/>
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

function LoopOnRow({ inLoop,onChange }) {
  return (
    <tr>
      <th>
        {LOOP_ON_TITLE}
      </th>
      <th>
        <input
          type="checkbox"
          checked={inLoop}
          onChange={onChange}/>
      </th>
    </tr>
  );
}

function SoundController({ inLoop, volume }) {

  return (
    <div className="SoundController">
      <PlaySound inLoop={inLoop} volume={volume} />
      <ChangeSoundButtons />
    </div>
  );
}

function PlaySound({ inLoop, volume }) {

  useEffect(() => {
    if(inLoop)return;
    function handleKeyEvent(e) {
      e.preventDefault();
      e.stopPropagation();

      if(e.key !== " ")return;
      if(e.repeat)return;
      console.log(e.key);
      if(e.type === "keydown"){
          playSound(volume);
        }else{
          stopSound();
        }
    }
    window.addEventListener('keydown', handleKeyEvent);
    window.addEventListener('keyup', handleKeyEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyEvent);
      window.removeEventListener('keyup', handleKeyEvent);
    }
  },[inLoop, volume]);

  function handleOnPlaySound(){
    playSound(volume);
  }
  function handleOnStopSound(){
    stopSound();
  }

  return (
    <div className="PlaySound">
      {inLoop ? (
          <button disabled={inLoop}>
            Play(Space)
          </button>
        ):(
          <button
            disabled={inLoop}
            onPointerDown={handleOnPlaySound}
            onPointerUp={handleOnStopSound}
            onPointerLeave={handleOnStopSound}
            >
            Play(Space)
          </button>
        )}
    </div>
  );
}

function ChangeSoundButtons() {
  const [buttonPushedSatus, setButtonPushedStatus] = useState({one:false, two:false, three:false});
  console.log("update buttons");
  console.log(buttonPushedSatus);
  useEffect(() => {
    function handleChangeFrequency(e) {
      e.preventDefault();
      e.stopPropagation();

      if(e.repeat)return;
      if(e.key !== "j" && e.key !== "k" && e.key !== "l")return;

      let nextStatus = {...buttonPushedSatus};
      const isPushed = e.type === "keydown";
      switch(e.key) {
        case "j" :
          nextStatus = {...nextStatus, one:isPushed};
          break;
        case "k" :
          nextStatus = {...nextStatus, two:isPushed};
          break;
        case "l" :
          nextStatus = {...nextStatus, three:isPushed};
          break;
      }
      changeFrequency(getFrequencyFromPushedStatus(nextStatus));
      setButtonPushedStatus(nextStatus);
    }

    window.addEventListener('keydown', handleChangeFrequency);
    window.addEventListener('keyup', handleChangeFrequency);

    return () => {
      window.removeEventListener('keydown', handleChangeFrequency);
      window.removeEventListener('keyup', handleChangeFrequency);
    }
  },[buttonPushedSatus]);

  function handleChangeFrequency(e) {
    let nextStatus = {...buttonPushedSatus};
    const isPushed = e.type === "pointerdown";
    switch(e.target.name) {
        case "one" :
          nextStatus = {...nextStatus, one:isPushed};
          break;
        case "two" :
          nextStatus = {...nextStatus, two:isPushed};
          break;
        case "three" :
          nextStatus = {...nextStatus, three:isPushed};
          break;
      }
      changeFrequency(getFrequencyFromPushedStatus(nextStatus));
      setButtonPushedStatus(nextStatus);
  }

  return (
    <div className="ChangeSoundButtons">
      <ChangeSoundButton name="three" keyName="l" onChangeFrequency={handleChangeFrequency}/>
      <ChangeSoundButton name="two" keyName="k" onChangeFrequency={handleChangeFrequency}/>
      <ChangeSoundButton name="one" keyName="j" onChangeFrequency={handleChangeFrequency}/>
    </div>
  );
}

function ChangeSoundButton({ name, keyName, onChangeFrequency }) {
  return (
    <div>
      <button
        className="ChangeSoundButton"
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