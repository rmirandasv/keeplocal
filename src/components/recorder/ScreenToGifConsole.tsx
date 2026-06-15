"use client";

import { useEffect, useRef, useState } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import {
  Monitor,
  Download,
  RotateCcw,
  Square,
  AlertTriangle,
  CheckCircle,
  FileImage,
  Loader2,
} from "lucide-react";
import type { Dictionary, Locale } from "@/utils/i18n";
import GitHubStarCta from "@/components/layout/GitHubStarCta";

interface ScreenToGifConsoleProps {
  lang: Locale;
  dict: Dictionary; // Localized full dictionary
}

export default function ScreenToGifConsole({ dict }: ScreenToGifConsoleProps) {
  const {
    status,
    stream,
    recordedUrl,
    recordingTime,
    errorMsg,
    setVideoSource,
    setAudioSource,
    requestPermissions,
    startRecording,
    stopRecording,
    resetRecorder,
  } = useRecorder();

  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // GIF-specific states
  const [gifWidth, setGifWidth] = useState<number>(640);
  const [fps, setFps] = useState<number>(10);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [generatedGifUrl, setGeneratedGifUrl] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(16 / 9);

  // Force screen-only configuration
  useEffect(() => {
    setVideoSource("screen");
    setAudioSource("none");
  }, [setVideoSource, setAudioSource]);

  // Sync preview stream to video element
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video) return;

    if (stream) {
      video.srcObject = stream;
      video.play().catch((err) => {
        console.warn("Screen preview play interrupted:", err);
      });
    } else {
      video.srcObject = null;
    }

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  // Detect video dimensions to maintain correct aspect ratio
  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.videoWidth && video.videoHeight) {
      setVideoAspectRatio(video.videoWidth / video.videoHeight);
    }
  };

  // Convert WebM recorded video to GIF using gifshot
  const handleGenerateGif = async () => {
    if (!recordedUrl) return;

    setIsConverting(true);
    setGeneratedGifUrl(null);

    try {
      // Dynamic import to prevent SSR compilation errors with window/canvas objects
      const gifshot = (await import("gifshot")).default;

      // Calculate total frames, cap at 150 frames to prevent OOM
      const calculatedFrames = Math.min(150, Math.round(recordingTime * fps));
      const frameInterval = 1 / fps;
      const calculatedHeight = Math.round(gifWidth / videoAspectRatio);

      gifshot.createGIF(
        {
          video: [recordedUrl],
          gifWidth: gifWidth,
          gifHeight: calculatedHeight,
          numFrames: calculatedFrames,
          interval: frameInterval,
          sampleInterval: 10, // Quality balance (lower = higher quality)
          numWorkers: typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 2 : 2,
        },
        (response) => {
          if (!response.error) {
            setGeneratedGifUrl(response.image); // Response image is base64 data URL
          } else {
            console.error("GIF conversion error:", response.errorMsg);
          }
          setIsConverting(false);
        },
      );
    } catch (err) {
      console.error("Failed to load gifshot or compile GIF:", err);
      setIsConverting(false);
    }
  };

  // Clean up URL object and state on reset
  const handleReset = () => {
    setGeneratedGifUrl(null);
    resetRecorder();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Trigger download of the compiled GIF
  const handleDownloadGif = () => {
    if (!generatedGifUrl) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `keeplocal-animation-${timestamp}.gif`;

    const a = document.createElement("a");
    a.href = generatedGifUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Render permission gate
  if (status === "unallowed") {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-16 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6">
          <Monitor className="w-8 h-8 text-teal-400 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-white mb-3">{dict.recorder.permissionGateTitle}</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-light">
          {dict.recorder.permissionGateDesc}
        </p>
        <button
          onClick={requestPermissions}
          className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold transition-all duration-200"
        >
          {dict.recorder.grantPermissions}
        </button>
        {errorMsg && (
          <div className="mt-6 flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{dict.recorder.errorDevices}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Viewfinder deck (2/3 columns) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="relative aspect-video rounded-2xl bg-black border border-zinc-800 overflow-hidden group shadow-2xl shadow-black/40">
          {generatedGifUrl ? (
            // Output GIF Viewport
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#07080a] p-4">
              <span className="text-xs font-mono text-zinc-500 mb-2">
                {dict.screenToGif.previewTitle} ({gifWidth}x
                {Math.round(gifWidth / videoAspectRatio)})
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedGifUrl}
                alt="Generated GIF Preview"
                className="max-w-full max-h-[85%] object-contain rounded-lg border border-zinc-800"
              />
            </div>
          ) : status === "stopped" && recordedUrl ? (
            // Recorded WebM preview viewport
            <video
              src={recordedUrl}
              autoPlay
              loop
              muted
              playsInline
              onLoadedMetadata={handleVideoLoadedMetadata}
              className="w-full h-full object-contain"
            />
          ) : (
            // Active share screen live preview
            <>
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#07080a]">
                  <span className="text-sm text-zinc-500 font-mono">{dict.recorder.idleState}</span>
                </div>
              )}
            </>
          )}

          {/* Status Badge */}
          {!generatedGifUrl && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-zinc-800/80 text-xs font-mono">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status === "recording" ? "bg-rose-500 animate-pulse" : "bg-teal-500"
                }`}
              />
              <span className="text-zinc-300">
                {status === "recording" ? dict.recorder.recordingState : dict.recorder.idleState}
              </span>
            </div>
          )}

          {/* Progress / Converting Overlay */}
          {isConverting && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
              <Loader2 className="w-10 h-10 text-teal-400 animate-spin mb-4" />
              <h3 className="text-sm font-bold text-white mb-2 font-mono">
                {dict.screenToGif.generatingGif}
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs font-light leading-relaxed">
                {dict.screenToGif.converting}
              </p>
            </div>
          )}

          {/* Capture Duration Telemetry */}
          {status === "recording" && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/70 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl font-mono text-xs text-zinc-300">
              <span>
                Record Time: <b className="text-white">{formatTime(recordingTime)}</b> / 05:00
              </span>
              <span>
                Est. Frames: <b className="text-white">{Math.min(150, recordingTime * fps)}</b> /
                150
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Settings & actions panel (1/3 column) */}
      <div className="flex flex-col gap-6">
        {/* Panel 1: Configure / Record / Discard */}
        {!generatedGifUrl ? (
          <div className="p-6 rounded-2xl bg-[#18191e] border border-zinc-800/60 flex flex-col gap-6">
            <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase font-mono border-b border-zinc-800/60 pb-3">
              {dict.screenToGif.configDeckTitle}
            </h2>

            {/* Config: Width */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400">
                {dict.screenToGif.widthLabel}
              </label>
              <select
                disabled={status === "recording"}
                value={gifWidth}
                onChange={(e) => setGifWidth(Number(e.target.value))}
                className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-teal-500/50 disabled:opacity-50"
              >
                <option value={480}>480 px (Compact)</option>
                <option value={640}>640 px (Standard)</option>
                <option value={800}>800 px (HD Detail)</option>
              </select>
            </div>

            {/* Config: FPS */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-400">{dict.screenToGif.fpsLabel}</label>
              <select
                disabled={status === "recording"}
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-teal-500/50 disabled:opacity-50"
              >
                <option value={5}>5 FPS (Optimized Size)</option>
                <option value={10}>10 FPS (Standard Fluidity)</option>
                <option value={15}>15 FPS (High Quality)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-6 mt-2">
              {status === "idle" && (
                <button
                  onClick={startRecording}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-sm transition-all duration-200 active:scale-98"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                  <span>{dict.recorder.startRecording}</span>
                </button>
              )}

              {status === "recording" && (
                <button
                  onClick={stopRecording}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition-all duration-200 active:scale-98"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>{dict.recorder.stopRecording}</span>
                </button>
              )}

              {status === "stopped" && recordedUrl && (
                <div className="flex flex-col gap-3 w-full">
                  <button
                    disabled={isConverting}
                    onClick={handleGenerateGif}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-all duration-200 active:scale-98 disabled:opacity-50"
                  >
                    <FileImage className="w-4 h-4" />
                    <span>{dict.screenToGif.createGif}</span>
                  </button>

                  <button
                    disabled={isConverting}
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-800/80 transition-all duration-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{dict.recorder.recordNew}</span>
                  </button>
                </div>
              )}
            </div>

            {/* RAM limitation warning banner */}
            <div className="bg-zinc-950/60 border border-zinc-900 p-3.5 rounded-xl flex gap-3 text-[11px] text-zinc-400 leading-normal">
              <AlertTriangle className="w-4 h-4 text-amber-500/90 shrink-0 mt-0.5" />
              <span>{dict.recorder.maxDurationWarning}</span>
            </div>
          </div>
        ) : (
          // Panel 2: GIF Generated successfully, Download / Discard
          <div className="p-6 rounded-2xl bg-[#18191e] border border-zinc-800/60 flex flex-col gap-6 animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-teal-400" />
              </div>
              <h2 className="text-sm font-bold text-white mb-2 font-mono">
                {dict.screenToGif.gifCreatedTitle}
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                {dict.screenToGif.gifCreatedDesc}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-6">
              <button
                onClick={handleDownloadGif}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-sm transition-all duration-200 active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>{dict.screenToGif.downloadGif}</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-xs border border-zinc-800/80 transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{dict.recorder.recordNew}</span>
              </button>

              <GitHubStarCta text={dict.common.starCta} className="mt-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
