import hark from "hark";

export default class Recorder {

    private speechEvent: hark.Harker
    private recorder: MediaRecorder
    private chucks: Blob[]
    private audio? : Blob

    constructor(stream: MediaStream , onStopSpeaking: (audio : Blob) => void) {
        this.speechEvent = hark(stream);
        this.chucks = [];
        this.recorder = new MediaRecorder(stream, {
            mimeType: "audio/webm"
        })
        this.recorder.ondataavailable = (evt) => {
            this.chucks.push(evt.data)
        }
        this.recorder.onstop = () => {
            this.audio = new Blob(this.chucks,{
                type:'audio/webm'
            })
            onStopSpeaking(this.audio)
        }
        this.speechEvent.on('stopped_speaking',()=>{
            this.recorder.stop()
            this.speechEvent.stop()
        })
    }

    start() {
        this.recorder.start();
    }
}