"use client";

import { useEffect, useRef, useState } from "react";
import { useRecorder, RecorderStatus } from "@/hooks/useRecorder";
import {
  Video,
  Monitor,
  Mic,
  Volume2,
  Download,
  RotateCcw,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Camera,
  CheckCircle,
} from "lucide-react";

interface RecorderConsoleProps {
  lang: string;
  dict: any; // Localized dictionary for recorder
}

export default function RecorderConsole({ lang, dict }: RecorderConsoleProps) {
  const {
    status,
    videoSource,
    audioSource,
    videoDevices,
    audioDevices,
    selectedVideoId,
    selectedAudioId,
    stream,
    recordedUrl,
    recordingTime,
    errorMsg,
    setVideoSource,
    setAudioSource,
    setSelectedVideoId,
    setSelectedAudioId,
    requestPermissions,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecorder,
  } = useRecorder();

  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Sync preview stream to video element
  useEffect(() => {
    const video = previewVideoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch((err) => {
        console.warn("Video preview play interrupted:", err);
      });
    }
  }, [stream]);

  // Real-time Audio Level Analyzer using Web Audio API
  useEffect(() => {
    if (!stream || audioSource === "none" || status === "stopped") {
      setAudioLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setAudioLevel(0);
      return;
    }

    let audioContext: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let animationFrameId: number;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; // Small size for responsive volume level
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // Map average (0-255) to a scale of 0-100
        setAudioLevel(Math.min(100, Math.round((average / 255) * 100)));
        animationFrameId = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (e) {
      console.warn("Could not initialize audio visualizer", e);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContext) {
        audioContext.close().catch(() => {});
      }
    };
  }, [stream, audioSource, status]);

  // Helper: Format recording timer (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Helper: Estimate file size in RAM buffer
  const getEstimatedSize = (seconds: number) => {
    if (videoSource === "none") {
      // Audio-only: ~16 KB/sec
      return `${((seconds * 16) / 1024).toFixed(1)} MB`;
    }
    // Video: ~180 KB/sec
    return `${((seconds * 180) / 1024).toFixed(1)} MB`;
  };

  // Trigger file download
  const handleDownload = () => {
    if (!recordedUrl) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = videoSource === "none" ? "webm" : "webm";
    const filename = `keeplocal-recording-${timestamp}.${extension}`;

    const a = document.createElement("a");
    a.href = recordedUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Rendering state screens
  if (status === "unallowed") {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-16 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6">
          <Camera className="w-8 h-8 text-teal-400 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white mb-3">
          {dict.permissionGateTitle}
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-light">
          {dict.permissionGateDesc}
        </p>
        <button
          onClick={requestPermissions}
          className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold transition-all duration-200"
        >
          {dict.grantPermissions}
        </button>
        {errorMsg && (
          <div className="mt-6 flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{dict.errorDevices}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Viewfinder and playback controls (2/3 columns) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="relative aspect-video rounded-2xl bg-black border border-zinc-800 overflow-hidden group shadow-2xl shadow-black/40">
          {/* Main Display screen */}
          {status === "stopped" && recordedUrl ? (
            <video
              src={recordedUrl}
              controls
              className="w-full h-full object-contain"
            />
          ) : videoSource === "none" ? (
            // Audio-only layout
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#07080a] p-6 text-center">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-teal-500/5 border border-teal-500/10 mb-6">
                {/* Visualizer ring */}
                <div
                  className="absolute inset-0 rounded-full border border-teal-500/40 transition-all duration-75"
                  style={{ transform: `scale(${1 + audioLevel / 100})`, opacity: audioSource !== "none" ? 0.3 : 0.1 }}
                />
                <Mic className="w-12 h-12 text-teal-400" />
              </div>
              <span className="text-sm font-mono text-zinc-500">
                {audioSource === "none" ? dict.noAudio : dict.microphone}
              </span>
            </div>
          ) : (
            // Camera or Screen capture screen
            <>
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] flip" // Mirror webcam
                style={videoSource === "screen" ? { transform: "none" } : {}} // Don't mirror screen
              />
              {/* If no stream detected */}
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#07080a]">
                  <span className="text-sm text-zinc-500 font-mono">
                    {dict.idleState}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Glowing Recording/Status Badge */}
          {status !== "stopped" && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-zinc-800/80 text-xs font-mono">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status === "recording"
                    ? "bg-rose-500 animate-pulse"
                    : status === "paused"
                    ? "bg-amber-500"
                    : "bg-teal-500"
                }`}
              />
              <span className="text-zinc-300">
                {status === "recording"
                  ? dict.recordingState
                  : status === "paused"
                  ? dict.pausedState
                  : dict.idleState}
              </span>
            </div>
          )}

          {/* Time & Size telemetry details */}
          {status !== "stopped" && (status === "recording" || status === "paused") && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/70 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl font-mono text-xs text-zinc-300">
              <div className="flex gap-4">
                <span>
                  Time: <b className="text-white">{formatTime(recordingTime)}</b> / 05:00
                </span>
                <span className="hidden sm:inline text-zinc-500">|</span>
                <span className="hidden sm:inline">
                  Buffer: <b className="text-white">{getEstimatedSize(recordingTime)}</b>
                </span>
              </div>

              {/* Warnings when approaching the 5-min limit */}
              {recordingTime >= 240 && (
                <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Max RAM limit near</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Live Audio Level Meter */}
        {audioSource !== "none" && status !== "stopped" && (
          <div className="flex items-center gap-3 bg-zinc-900/30 border border-zinc-800/60 p-4 rounded-xl">
            <Volume2 className="w-4 h-4 text-zinc-400" />
            <div className="flex-1 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-75 rounded-full"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">
              {audioLevel}%
            </span>
          </div>
        )}
      </div>

      {/* Tactile Sidebar Controls Panel (1/3 columns) */}
      <div className="flex flex-col gap-6">
        {/* State 1: Configure / Record / Pause */}
        {status !== "stopped" ? (
          <div className="p-6 rounded-2xl bg-[#18191e] border border-zinc-800/60 flex flex-col gap-6">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase font-mono border-b border-zinc-800/60 pb-3">
              Studio Controls
            </h2>

            {/* Video Source selectors */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400">
                {dict.videoSource}
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                <button
                  disabled={status === "recording" || status === "paused"}
                  onClick={() => setVideoSource("camera")}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all ${
                    videoSource === "camera"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
                  }`}
                >
                  <Video className="w-4 h-4 mb-1" />
                  <span>Camera</span>
                </button>
                <button
                  disabled={status === "recording" || status === "paused"}
                  onClick={() => setVideoSource("screen")}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all ${
                    videoSource === "screen"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
                  }`}
                >
                  <Monitor className="w-4 h-4 mb-1" />
                  <span>Screen</span>
                </button>
                <button
                  disabled={status === "recording" || status === "paused"}
                  onClick={() => setVideoSource("none")}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all ${
                    videoSource === "none"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
                  }`}
                >
                  <span className="font-mono text-base font-bold mb-1 leading-none">-</span>
                  <span>{dict.noVideo}</span>
                </button>
              </div>
            </div>

            {/* Audio Source selectors */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400">
                {dict.audioSource}
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                <button
                  disabled={status === "recording" || status === "paused"}
                  onClick={() => setAudioSource("microphone")}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all ${
                    audioSource === "microphone"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
                  }`}
                >
                  <Mic className="w-4 h-4 mb-1" />
                  <span>{dict.microphone}</span>
                </button>
                <button
                  disabled={status === "recording" || status === "paused"}
                  onClick={() => setAudioSource("none")}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg text-xs font-medium transition-all ${
                    audioSource === "none"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
                  }`}
                >
                  <span className="font-mono text-base font-bold mb-1 leading-none">-</span>
                  <span>{dict.noAudio}</span>
                </button>
              </div>
            </div>

            {/* Device Hardware Selectors */}
            {status === "idle" && (
              <div className="flex flex-col gap-4 border-t border-zinc-800/60 pt-4">
                {/* Camera Hardware dropdown */}
                {videoSource === "camera" && videoDevices.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-zinc-500">Camera Device</span>
                    <select
                      value={selectedVideoId}
                      onChange={(e) => setSelectedVideoId(e.target.value)}
                      className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-teal-500/50"
                    >
                      {videoDevices.map((dev) => (
                        <option key={dev.id} value={dev.id}>
                          {dev.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Microphone Hardware dropdown */}
                {audioSource === "microphone" && audioDevices.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-zinc-500">Audio Input Device</span>
                    <select
                      value={selectedAudioId}
                      onChange={(e) => setSelectedAudioId(e.target.value)}
                      className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-teal-500/50"
                    >
                      {audioDevices.map((dev) => (
                        <option key={dev.id} value={dev.id}>
                          {dev.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Main Center Action Deck */}
            <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-6 mt-2">
              <div className="flex justify-center items-center gap-4">
                {/* Auxiliary Discard/Reset button */}
                {(status === "recording" || status === "paused") && (
                  <button
                    onClick={resetRecorder}
                    className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white flex items-center justify-center text-zinc-400 transition-colors"
                    title="Discard recording"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}

                {/* Main Action Trigger */}
                {status === "idle" && (
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10 hover:shadow-rose-500/25 active:scale-95 transition-all duration-200"
                    title={dict.startRecording}
                  >
                    <span className="w-6 h-6 rounded-full bg-white" />
                  </button>
                )}

                {status === "recording" && (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center shadow-lg active:scale-95 transition-all duration-200"
                    title={dict.stopRecording}
                  >
                    <Square className="w-6 h-6 text-zinc-950 fill-current" />
                  </button>
                )}

                {status === "paused" && (
                  <button
                    onClick={resumeRecording}
                    className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-400 flex items-center justify-center shadow-lg active:scale-95 transition-all duration-200"
                    title={dict.resumeRecording}
                  >
                    <Play className="w-6 h-6 text-white fill-current ml-1" />
                  </button>
                )}

                {/* Auxiliary Pause button */}
                {status === "recording" && (
                  <button
                    onClick={pauseRecording}
                    className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white flex items-center justify-center text-zinc-400 transition-colors"
                    title={dict.pauseRecording}
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* RAM limitation warning banner */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-3.5 rounded-xl flex gap-3 text-[11px] text-zinc-400 leading-normal">
              <AlertTriangle className="w-4 h-4 text-amber-500/90 shrink-0 mt-0.5" />
              <span>{dict.maxDurationWarning}</span>
            </div>
          </div>
        ) : (
          /* State 2: Save / Download / Review */
          <div className="p-6 rounded-2xl bg-[#18191e] border border-zinc-800/60 flex flex-col gap-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-sm font-bold text-white mb-2 font-mono">
                Capture Complete
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {dict.downloadReady}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-6">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>{dict.downloadRecording}</span>
              </button>

              <button
                onClick={resetRecorder}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-800/80 transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{dict.recordNew}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
