import React, {
  useState,
  useCallback,
  useEffect,
  MouseEvent,
  useRef,
} from "react";
import Spectrum from "./Spectrum";
import { useBumbleBee } from "../lib/bumblebee-provider";
import MicIcon from "@material-ui/icons/Mic";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import AudioRecorder from "recorder-js";
import {
  useSetRecoilState,
  useRecoilValue,
  useRecoilStateLoadable,
} from "recoil";
import { userSpeechState, intentState } from "../state/nlp";
import { Fab, Typography, Grid, makeStyles, Link } from "@material-ui/core";
import { processing } from "src/state/canvas";
import Spinner from "src/component/Spinner";
import hark from "hark";

const useStyles = makeStyles((theme: any) => ({
  caption: {
    paddingTop: "1rem",
    maxWidth: "100%",
  },
  bold: {
    fontWeight: 700,
  },
  button: {
    color: theme.palette.primary.contrastText,
    textTransform: "none",
    fontWeight: theme.typography.fontWeightBold,
  },
  spinner: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Analyser() {
  const { bumblebee } = useBumbleBee();
  const styles = useStyles();

  const [analyserNode, setAnalyserNode] = useState<AnalyserNode>();
  const [initialized, setIntialized] = useState(false);
  const [called, setCalled] = useState(false);
  const [isAllowedRecord, setAllowedRecord] = useState(true);

  const setSpeech = useSetRecoilState(userSpeechState);
  const [{ state }, setIntent] = useRecoilStateLoadable(intentState);
  const loading = useRecoilValue(processing);

  const getContext = useCallback(() => {
    let ContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    const context = new ContextClass();
    return context;
  }, []);

  const InitAudioRecorder = useCallback<
    () => Promise<[AnalyserNode, AudioRecorder, hark.Harker]>
  >(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const ctx = getContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    source.connect(analyser);
    // setAnalyserNode(analyser);
    const recorder = new AudioRecorder(ctx);
    recorder.init(stream);

    const speechEvent = hark(stream, {
      interval: 10,
      threshold: 0,
    });
    return [analyser, recorder, speechEvent];
  }, [getContext]);

  const speakingTime = useRef<number>(0);

  const sliceBuffer = useCallback(
    (
      audioBuffer: AudioBuffer,
      start: number = 0,
      end: number = audioBuffer.length
    ) => {
      const ctx = getContext();
      const newBuffer = ctx.createBuffer(
        audioBuffer.numberOfChannels,
        end - start,
        audioBuffer.sampleRate
      );
      for (var i = 0; i < audioBuffer.numberOfChannels; i++) {
        newBuffer.copyToChannel(
          audioBuffer.getChannelData(i).slice(start, end),
          i
        );
      }
      return newBuffer;
    },
    [getContext]
  );

  const toArrayBuffer = useCallback<(blob: Blob) => Promise<ArrayBuffer>>(
    async (blob: Blob) => {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = (evt) => {
          const arrayBuffer = evt.target?.result;
          arrayBuffer ? resolve(arrayBuffer as ArrayBuffer) : reject();
        };
        reader.onerror = (err) => {
          reject(err);
        };
        reader.readAsArrayBuffer(blob);
      });
    },
    []
  );

  useEffect(() => {
    (async () => {
      const componentLoading = loading || state === "loading";
      if (initialized && !componentLoading) {
        setCalled(true);
        // stop injest audio input after 5s
        try {
          const [node, recorder, speechEvent] = await InitAudioRecorder();
          setAnalyserNode(node);
          recorder.start();
          const startTime = Date.now() / 1000;
          speechEvent.on("speaking", () => {
            clearTimeout(timeoutId);
            speakingTime.current = Date.now() / 1000;
            console.log("start recording");
          });
          speechEvent.on("stopped_speaking", async () => {
            speechEvent.stop();
            //delay a bit for more complete recording
            setTimeout(async () => {
              const endTime = Date.now() / 1000;
              console.log("Stop");
              const { blob } = await recorder.stop();
              const ctx = getContext();
              const arrayBuffer = await toArrayBuffer(blob);
              // for handling safari
              console.log(ctx);
              console.log(ctx.decodeAudioData);
              const audioBuffer = await new Promise<AudioBuffer>(
                (resolve, reject) => {
                  ctx.decodeAudioData(
                    arrayBuffer,
                    function success(result) {
                      resolve(result);
                    },
                    function failed(err) {
                      reject(err);
                    }
                  );
                }
              );
              // calculate the speaking point
              const duration = endTime - startTime;
              const speaking = speakingTime.current - startTime - 1;
              //slice the audio just before the user speak for clearance of voice
              const start = ((speaking || 0) / duration) * audioBuffer.length;
              const buffer = sliceBuffer(audioBuffer, start);
              const worker = new Worker("recordWorker.js");

              // callback for `exportWAV`
              worker.onmessage = function (e) {
                var blob = e.data;
                // this is would be your WAV blob
                setSpeech(blob);
                setCalled(false);
                worker.terminate();
              };

              // initialize the new worker
              worker.postMessage({
                command: "init",
                config: { sampleRate: 44100, numChannels: 2 },
              });

              worker.postMessage({
                command: "record",
                buffer: [buffer.getChannelData(0), buffer.getChannelData(1)],
              });

              worker.postMessage({
                command: "exportWAV",
                type: "audio/wav",
              });
            }, 500)
          });
          const timeoutId = setTimeout(() => {
            setIntialized(false);
            setCalled(false);
            speechEvent.stop();
            console.log("Stop");
          }, 5000);

          return () => {
            speechEvent.stop();
            recorder.stop();
            clearTimeout(timeoutId);
          };
        } catch (err) {
          setAllowedRecord(false);
        }
      }
    })();
  }, [
    initialized,
    InitAudioRecorder,
    loading,
    setSpeech,
    state,
    called,
    getContext,
    sliceBuffer,
    toArrayBuffer,
  ]);

  const onHotWord = useCallback(async (hotword: string | MouseEvent) => {
    setIntialized(true);
  }, []);

  useEffect(() => {
    if (bumblebee) {
      console.log("start bumblebee");
      bumblebee.on("hotword", onHotWord);
      bumblebee.on("error", () => {
        setAllowedRecord(false);
      });
      bumblebee.start();
    }
    return () => {
      console.log("stop bumblebee");
      bumblebee?.stop();
    };
  }, [bumblebee, onHotWord]);

  const NonRecordingState = useCallback(
    ({ allowRecording }: { allowRecording: boolean }) => (
      <Grid alignItems="center" container direction="column">
        {allowRecording ? (
          <>
            <Fab onClick={onHotWord}>
              <MicIcon />
            </Fab>
            <Grid
              className={styles.caption}
              container
              alignItems="center"
              direction="column"
            >
              <Typography variant="caption">
                Say <span className={styles.bold}>Hey Edison</span> then
                <span className={styles.bold}> What can I do </span>
              </Typography>
              <Typography variant="caption">or</Typography>
              <Link
                onClick={(evt: MouseEvent<HTMLAnchorElement>) => {
                  evt.preventDefault();
                  setIntent({
                    intent: "ask_for_help",
                    entities: {},
                  });
                }}
                className={styles.button}
                variant="caption"
              >
                click here
              </Link>
            </Grid>
          </>
        ) : (
            <>
              <SentimentVeryDissatisfiedIcon />
              <Typography variant="caption">
                We couldn't access to your microphone ..
            </Typography>
              <Typography variant="caption">
                <Link
                  onClick={(evt: MouseEvent<HTMLAnchorElement>) => {
                    evt.preventDefault();
                    setIntent({
                      intent: "ask_for_help",
                      entities: {},
                    });
                  }}
                  className={styles.button}
                  variant="caption"
                >
                  click here
              </Link>{" "}
              to enjoy our services
            </Typography>
            </>
          )}
      </Grid>
    ),
    [onHotWord, setIntent, styles]
  );

  if (loading || state === "loading")
    return (
      <div className={styles.spinner}>
        <Spinner />
      </div>
    );

  if (!initialized)
    return <NonRecordingState allowRecording={isAllowedRecord} />;

  if (called) return <Spectrum analyserNode={analyserNode} />;

  return <NonRecordingState allowRecording={isAllowedRecord} />;
}
