//定数
const FREQUENCY_DO_L = 261.626;
const FREQUENCY_RE = 293.665;
const FREQUENCY_MI = 329.628;
const FREQUENCY_FA = 349.228;
const FREQUENCY_SO = 391.995;
const FREQUENCY_RA = 440.000;
const FREQUENCY_SI = 493.883;
const FREQUENCY_DO_U = 523.251;
//初期処理
const audioCtx = new  AudioContext();
const oscillatorNode = new OscillatorNode(audioCtx, {
  frequency : FREQUENCY_DO_L
});
const gainNode = new GainNode(audioCtx)
gainNode.gain.value = 0;
oscillatorNode.connect(gainNode)
gainNode.connect(audioCtx.destination)
//関数
function playSound(volume) {
  gainNode.gain.setTargetAtTime(volume,0,0.005)
}

function stopSound() {
  gainNode.gain.setTargetAtTime(0,0,0.005)
}

function changeFrequency(frequencyValue) {
  if(!frequencyValue)return;
  oscillatorNode.frequency.value = frequencyValue;
}

function getFrequencyFromPushedStatus({one, two, three}) {
  // console.log(`one:${one},two:${two},three:${three}`);
  // if(!one && !two && !three)return FREQUENCY_DO_L;
  if( one && !two && !three)return FREQUENCY_DO_L;
  if(!one &&  two && !three)return FREQUENCY_RE;
  if( one &&  two && !three)return FREQUENCY_MI;
  if(!one && !two &&  three)return FREQUENCY_FA;
  if( one && !two &&  three)return FREQUENCY_SO;
  if(!one &&  two &&  three)return FREQUENCY_RA;
  if( one &&  two &&  three)return FREQUENCY_SI;
  // if( one &&  two &&  three)return FREQUENCY_DO_U;
  return null;
}

export {oscillatorNode, playSound, stopSound, changeFrequency, getFrequencyFromPushedStatus};