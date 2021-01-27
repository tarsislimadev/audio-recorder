class Audio {
  stream;
  mediaRecorder;
  isPlaying = false;

  btnPlay;

  constructor() {
    this.setElements();
    this.setElementEvents();
    window.recordedBlobs = [];
  }

  setElements() {
    this.btnPlay = document.getElementById("btnPlay");
  }

  setElementEvents() {
    this.btnPlay.addEventListener("click", this.onPlayClick);
  }

  toggle = () => {
    this.isPlaying = !this.isPlaying;
    this.btnPlay.innerText = this.isPlaying ? "stop" : "play";
  };

  onMediaRecorderData = ({ data }) => {
    console.log("onMediaRecorderData", { data });

    if (data && data.size > 0) {
      const blob = new Blob(data, { type: "video/webm" });
      const url = window.URL.createObjectURL(blob);
      const name = Date.now() + ".webm";
      const a = document.createElement("a");
      a.href = url;
      a.innerText = name;
      a.download = name;
      document.body.appendChild(a);
    }
  };

  getAudio = async () => navigator.mediaDevices.getUserMedia({ audio: true });

  setStream = async () => (this.stream = await this.getAudio());

  clearRecorded = () => {
    while (window.recordedBlobs[0]) window.recordedBlobs.shift();
  };

  startRecorder = (stream) => {
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = this.onMediaRecorderData;
    this.mediaRecorder.start();
  };

  startRecord = async () => {
    this.clearRecorded();
    this.startRecorder(await this.setStream());
  };

  stopRecording = async () => {
    window.recordedBlobs = this.mediaRecorder.requestData();
    this.mediaRecorder.stop();
  };

  onPlayClick = async () => {
    await (this.isPlaying ? this.stopRecording : this.startRecord)();
    this.toggle();
  };
}

let audio = new Audio();
