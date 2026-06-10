"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type RecorderStatus =
  | "unallowed" // Permisos no solicitados o denegados
  | "idle" // Permisos concedidos, listo para configurar/grabar
  | "preparing" // Iniciando dispositivos
  | "recording" // Grabación activa
  | "paused" // Grabación en pausa
  | "stopped" // Grabación terminada, archivo listo
  | "error"; // Error de hardware/permisos

export interface MediaDeviceOption {
  id: string;
  label: string;
}

export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("unallowed");
  const [videoSource, setVideoSource] = useState<"camera" | "screen" | "none">("camera");
  const [audioSource, setAudioSource] = useState<"microphone" | "none">("microphone");

  const [videoDevices, setVideoDevices] = useState<MediaDeviceOption[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceOption[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Refs for background state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const streamTracksRef = useRef<MediaStreamTrack[]>([]);

  // Stop all active tracks helper
  const stopTracks = useCallback(() => {
    streamTracksRef.current.forEach((track) => track.stop());
    streamTracksRef.current = [];
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Enumerate active devices
  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const vDevs = devices
        .filter((d) => d.kind === "videoinput")
        .map((d) => ({ id: d.deviceId, label: d.label || `Camera ${d.deviceId.slice(0, 5)}` }));

      const aDevs = devices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({ id: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }));

      setVideoDevices(vDevs);
      setAudioDevices(aDevs);

      // Default selection if not already set
      if (vDevs.length > 0 && !selectedVideoId) setSelectedVideoId(vDevs[0].id);
      if (aDevs.length > 0 && !selectedAudioId) setSelectedAudioId(aDevs[0].id);
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  }, [selectedVideoId, selectedAudioId]);

  // Request base permissions to discover devices
  const requestPermissions = useCallback(async () => {
    setStatus("preparing");
    setErrorMsg(null);
    try {
      // Prompt for both audio and video to check access
      const tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Stop temporary stream immediately
      tempStream.getTracks().forEach((track) => track.stop());

      setStatus("idle");
      await enumerateDevices();
    } catch (err: any) {
      console.warn("Could not get both video/audio permission, trying individually...", err);
      // Try audio only as fallback
      try {
        const tempAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
        tempAudio.getTracks().forEach((track) => track.stop());
        setStatus("idle");
        await enumerateDevices();
      } catch (innerErr: any) {
        setStatus("unallowed");
        setErrorMsg("errorDevices");
      }
    }
  }, [enumerateDevices]);

  // Handle device change detection
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", enumerateDevices);
      return () => {
        navigator.mediaDevices.removeEventListener("devicechange", enumerateDevices);
      };
    }
  }, [enumerateDevices]);

  // Update preview stream when choices change (only in idle/preparing state)
  const updatePreviewStream = useCallback(async () => {
    if (status !== "idle" && status !== "preparing" && status !== "unallowed") return;

    stopTracks();
    setErrorMsg(null);

    // If both sources are none, do nothing
    if (videoSource === "none" && audioSource === "none") {
      setStream(null);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {};
      let localStream: MediaStream | null = null;

      if (videoSource === "camera") {
        constraints.video = selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true;
      } else if (videoSource === "screen") {
        // Handled differently via getDisplayMedia
      }

      if (audioSource === "microphone" && videoSource !== "screen") {
        constraints.audio = selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true;
      }

      if (videoSource === "screen") {
        // Screen capture
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: audioSource === "microphone", // Request display audio if needed
        });

        localStream = displayStream;
        streamTracksRef.current = [...displayStream.getTracks()];

        // If microphone audio is also requested, overlay it
        if (audioSource === "microphone") {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({
              audio: selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true,
            });
            streamTracksRef.current.push(...micStream.getAudioTracks());

            // Create merged stream
            const merged = new MediaStream([
              ...displayStream.getVideoTracks(),
              ...micStream.getAudioTracks(),
            ]);
            localStream = merged;
          } catch (micErr) {
            console.warn("Failed to get microphone stream for screen overlay", micErr);
          }
        }
      } else if (Object.keys(constraints).length > 0) {
        // Camera and/or mic capture
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamTracksRef.current = [...localStream.getTracks()];
      }

      setStream(localStream);
    } catch (err: any) {
      console.error("Error updating preview stream:", err);
      // Only set error if we are actively setting up
      if (status === "preparing") {
        setStatus("idle");
      }
      setErrorMsg("errorDevices");
    }
  }, [status, videoSource, audioSource, selectedVideoId, selectedAudioId, stopTracks]);

  // Trigger preview update on configuration change
  useEffect(() => {
    if (status === "idle") {
      updatePreviewStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSource, audioSource, selectedVideoId, selectedAudioId, status]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      streamTracksRef.current.forEach((track) => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start Recording
  const startRecording = useCallback(async () => {
    setErrorMsg(null);
    chunksRef.current = [];
    setRecordingTime(0);

    if (!stream) {
      setErrorMsg("errorDevices");
      return;
    }

    const tracks = stream.getTracks();
    if (tracks.length === 0) {
      setErrorMsg("errorDevices");
      return;
    }

    try {
      // Determine appropriate mime type
      let options = { mimeType: "video/webm;codecs=vp9,opus" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm;codecs=vp8,opus" };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm" };
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        // Fallback for Safari/iOS
        options = { mimeType: "video/mp4" };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder; // Store reference

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setStatus("stopped");
        stopTracks();
      };

      // 1-second timeslices to gather chunks and avoid OOM crash or lost data
      recorder.start(1000);
      setStatus("recording");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          // Auto-stop at 5 minutes to prevent OOM
          if (prev >= 300) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
              mediaRecorderRef.current.stop();
            }
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Failed to start MediaRecorder:", err);
      setStatus("error");
      setErrorMsg("errorDevices");
    }
  }, [stream, stopTracks]);

  // Pause Recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.pause();
      setStatus("paused");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [status]);

  // Resume Recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && status === "paused") {
      mediaRecorderRef.current.resume();
      setStatus("recording");
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 300) {
            mediaRecorderRef.current?.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  }, [status]);

  // Stop Recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && (status === "recording" || status === "paused")) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [status]);

  // Reset Recorder for new recording
  const resetRecorder = useCallback(() => {
    stopTracks();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    chunksRef.current = [];
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedUrl(null);
    setRecordingTime(0);
    setStatus("idle");
    setErrorMsg(null);
  }, [recordedUrl, stopTracks]);

  return {
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
  };
}
