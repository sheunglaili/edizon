import hark from "hark";
import AudioRecorder from 'recorder-js';

export default class Recorder {

    private speechEvent: hark.Harker
    private recorder: AudioRecorder
    private chucks: Blob[]
    private audio? : Blob

    constructor(stream: MediaStream , ctx : AudioContext , onStopSpeaking: (audio : Blob) => void) {
        this.speechEvent = hark(stream);
        this.chucks = [];
        this.recorder = new AudioRecorder(ctx)
        this.recorder.init(stream)
        // this.recorder = new MediaRecorder(stream, {
        //     mimeType: "audio/webm"
        // })
        // this.recorder.ondataavailable = (evt) => {
        //     this.chucks.push(evt.data)
        // }
        // this.recorder.onstop = () => {
        //     this.audio = new Blob(this.chucks,{
        //         type:'audio/webm'
        //     })
        //     onStopSpeaking(this.audio)
        // }
        this.speechEvent.on('stopped_speaking',()=>{
            this.recorder.stop().then(({blob}) => {
                onStopSpeaking(blob)
            })
            this.speechEvent.stop()
        })
    }

    start() {
        this.recorder.start();
    }
}