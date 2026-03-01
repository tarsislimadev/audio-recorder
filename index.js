import { HTML, nH2, nButton, nLink } from './libs/afrontend/index.js'

class TitleComponent extends nH2 {
  constructor() {
    super()
    this.setText('Recorder')
  }
}

class RecorderButton extends nButton {
  onclick = null

  constructor({ onclick = () => console.log('not implemented') } = {}) {
    super()
    this.onclick = () => onclick?.()
  }

  onCreate() {
    super.onCreate()
    this.setText('REC')
    this.setStyle('background-color', 'red')
    this.setStyle('border-radius', '50%')
    this.setStyle('color', 'white')
    this.setStyle('padding', '1rem')
    this.addEventListener('click', () => this.onclick?.())
  }
}

export class Page extends HTML {
  recorder_button = new RecorderButton({ onclick: () => this.onRecorderButtonClick() })
  recordings = new HTML()

  isPlaying = false
  mediaRecorder = null

  constructor() {
    super()
    window.recordedBlobs = [];
  }

  onCreate() {
    super.onCreate()
    this.append(new TitleComponent())
    this.append(this.recorder_button)
    this.append(this.recordings)
  }

  toggle(isPlaying = !this.isPlaying) {
    this.isPlaying = isPlaying
    this.recorder_button.setText(this.isPlaying ? 'stop' : 'play')
  }

  onMediaRecorderData = ({ data } = {}) => {
    console.log('onMediaRecorderData', { data });

    if (data && data.size > 0) {
      // const blob = new Blob(data, { type: "video/webm" });
      const url = window.URL.createObjectURL(data /* blob */);
      const name = Date.now() + '.webm';
      const a = document.createElement('a');
      a.href = url;
      a.innerText = name;
      a.download = name;
      this.recordings.append(nLink.fromElement(a))
    }
  };

  startRecord() {
    // clear recordings
    while (window.recordedBlobs[0]) window.recordedBlobs.shift()
    // record
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => this.mediaRecorder = new MediaRecorder(stream))
      .then(() => this.mediaRecorder.addEventListener('dataavailable', (e) => this.onMediaRecorderData(e)))
      .then(() => this.mediaRecorder.start())
      .catch((err) => console.error(err))
  }

  stopRecording() {
    window.recordedBlobs = this.mediaRecorder.requestData()
    this.mediaRecorder.stop()
  }

  onRecorderButtonClick() {
    if (this.isPlaying) {
      this.stopRecording()
    } else {
      this.startRecord()
    }

    this.toggle()
  }
}
