// Type definitions for bumblebee-hotword 0.0.6
// Project: https://github.com/jaxcore/bumblebee-hotword
// Definitions by: sheunglaili <https://github.com/sheunglaili>
// Definitions: https://github.com/DefinitelyTyped/

export = Bumblebee;

interface VoiceEngine { 
    processFrame( data : any ) : void;
}

interface VoiceProcessor {
    start (
        engines : VoiceEngine[],
        volume : number , 
        downsamplerScript : string ,
        errorCallback : (e:Error) => {} ,  
        audioProcessCallback: (data : any) => void,
        audioContextCallback: (analyzer : AnalyserNode , gainNode : GainNode) => void
    ) : void
    stop () : void
}

declare class Bumblebee {
    constructor();

    setVoiceProcessor(Proc : VoiceProcessor) : void;
    addHotword(name : string , data? : Uint8Array , sensitivity? : number) : void
    setHotword(w : string) : void
    setSensitivity(s: number): void
    stop() : void
    setWorkersPath(path : string) : void
    detectionCallback(keyword: string) : void
    errorCallback(e : Error ): void
    audioProcessCallback(data : any , sampleRate : any) : void
    audioAnalyserCallback(audioAnalyser: AnalyserNode , gainNode : GainNode): void
    start() : void
    setMuted(muted: boolean) : void
    setMicVolume(vol : number) : void
}