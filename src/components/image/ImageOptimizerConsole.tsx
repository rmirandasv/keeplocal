"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Zap,
  Loader2,
  X,
  ImageIcon,
} from "lucide-react";
import type { Dictionary } from "@/utils/i18n";
import {
  buildOptimizedFilename,
  compressImage,
  detectAvifSupport,
  formatFileSize,
  isOptimizerInputType,
  MAX_IMAGE_FILE_SIZE,
  type CompressImageResult,
  type OutputFormat,
} from "@/utils/compressImage";
import GitHubStarCta from "@/components/layout/GitHubStarCta";

type ConsoleStatus = "idle" | "loaded" | "compressing" | "success";

const MAX_WIDTH_OPTIONS = [
  { value: null, labelKey: "original" as const },
  { value: 800, labelKey: "w800" as const },
  { value: 1280, labelKey: "w1280" as const },
  { value: 1920, labelKey: "w1920" as const },
];

const FORMAT_OPTIONS: OutputFormat[] = ["webp", "jpeg", "png", "avif"];

interface ImageOptimizerConsoleProps {
  dict: Dictionary;
}

export default function ImageOptimizerConsole({ dict }: ImageOptimizerConsoleProps) {
  const t = dict.imageOptimizer;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<ConsoleStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [optimizedPreviewUrl, setOptimizedPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CompressImageResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);

  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<number | null>(1920);
  const [format, setFormat] = useState<OutputFormat>("webp");
  const [preserveExif, setPreserveExif] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);

  useEffect(() => {
    void detectAvifSupport().then(setAvifSupported);
  }, []);

  const resetState = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (optimizedPreviewUrl) URL.revokeObjectURL(optimizedPreviewUrl);

    setStatus("idle");
    setSelectedFile(null);
    setPreviewUrl(null);
    setOptimizedPreviewUrl(null);
    setResult(null);
    setErrorMsg(null);
    setShowSizeWarning(false);
    setIsDragOver(false);
    setProgress(0);
    setShowOptimized(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, optimizedPreviewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (optimizedPreviewUrl) URL.revokeObjectURL(optimizedPreviewUrl);
    };
  }, [previewUrl, optimizedPreviewUrl]);

  const processFile = (file: File) => {
    setErrorMsg(null);
    setResult(null);
    setShowOptimized(false);

    if (!isOptimizerInputType(file.type)) {
      setErrorMsg(t.errors.unsupportedFormat);
      return;
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      setErrorMsg(t.errors.fileTooLarge);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (optimizedPreviewUrl) URL.revokeObjectURL(optimizedPreviewUrl);

    setOptimizedPreviewUrl(null);
    setShowSizeWarning(file.size > MAX_IMAGE_FILE_SIZE * 0.5);

    const nextPreviewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    setStatus("loaded");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleOptimize = async () => {
    if (!selectedFile) return;

    setStatus("compressing");
    setErrorMsg(null);
    setProgress(0);

    try {
      const compressResult = await compressImage(selectedFile, {
        format,
        quality: quality / 100,
        maxWidth,
        preserveExif,
        onProgress: setProgress,
      });

      if (optimizedPreviewUrl) URL.revokeObjectURL(optimizedPreviewUrl);

      const nextOptimizedUrl = URL.createObjectURL(compressResult.blob);
      setOptimizedPreviewUrl(nextOptimizedUrl);
      setResult(compressResult);
      setShowOptimized(true);
      setStatus("success");
    } catch {
      setErrorMsg(t.errors.processingFailed);
      setStatus("loaded");
    }
  };

  const handleDownload = () => {
    if (!result || !selectedFile) return;

    const filename = buildOptimizedFilename(selectedFile.name, result.outputFormat);
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const displayUrl = showOptimized && optimizedPreviewUrl ? optimizedPreviewUrl : previewUrl;
  const previewLabel = showOptimized ? t.previewOptimized : t.previewOriginal;

  const dimensionsText = result
    ? `${result.originalDimensions.width}×${result.originalDimensions.height} → ${result.outputDimensions.width}×${result.outputDimensions.height}`
    : null;

  const savingsText = result
    ? t.statsSavings
        .replace("{original}", formatFileSize(result.originalSize))
        .replace("{compressed}", formatFileSize(result.compressedSize))
        .replace("{percent}", String(Math.max(0, result.savingsPercent)))
    : null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-black/40">
          {status === "idle" ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`flex h-full cursor-pointer flex-col items-center justify-center gap-4 p-8 text-center transition-colors ${
                isDragOver ? "bg-teal-500/5" : "bg-[#07080a]"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-teal-500/20 bg-teal-500/10">
                <Upload className="h-7 w-7 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.dropzoneTitle}</p>
                <p className="mt-2 text-xs font-light text-zinc-400">{t.dropzoneHint}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-[#07080a] p-4">
              <span className="mb-2 font-mono text-xs text-zinc-500">{previewLabel}</span>
              {displayUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={displayUrl}
                  alt="Image preview"
                  className="max-h-[85%] max-w-full rounded-lg border border-zinc-800 object-contain"
                />
              )}
            </div>
          )}

          {status === "compressing" && (
            <div className="absolute inset-0 flex animate-fadeIn flex-col items-center justify-center bg-black/80 p-6 text-center backdrop-blur-sm">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-teal-400" />
              <h3 className="mb-2 font-mono text-sm font-bold text-white">{t.compressing}</h3>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-xs text-zinc-400">{progress}%</p>
            </div>
          )}

          {selectedFile && status !== "idle" && (
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-black/60 px-3 py-1 font-mono text-xs backdrop-blur-md">
              <span className="max-w-[220px] truncate text-zinc-300">{selectedFile.name}</span>
              {status !== "compressing" && (
                <button
                  type="button"
                  onClick={resetState}
                  className="text-zinc-500 transition-colors hover:text-zinc-300"
                  aria-label={t.clearFile}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {result && status === "success" && (
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-zinc-800/80 bg-black/70 p-3 font-mono text-xs text-zinc-300 backdrop-blur-md">
              <p>{savingsText}</p>
              {dimensionsText && <p className="mt-1 text-zinc-500">{dimensionsText}</p>}
            </div>
          )}
        </div>

        {result && status === "success" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowOptimized(false)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                !showOptimized
                  ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                  : "border-zinc-800 text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {t.previewOriginal}
            </button>
            <button
              type="button"
              onClick={() => setShowOptimized(true)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                showOptimized
                  ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                  : "border-zinc-800 text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {t.previewOptimized}
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/bmp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-6">
        {status !== "success" ? (
          <div className="flex flex-col gap-6 rounded-2xl border border-zinc-800/60 bg-[#18191e] p-6">
            <h2 className="border-b border-zinc-800/60 pb-3 font-mono text-sm font-bold uppercase tracking-wider text-zinc-400">
              {t.configDeckTitle}
            </h2>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-zinc-400" htmlFor="output-format">
                {t.formatLabel}
              </label>
              <select
                id="output-format"
                disabled={status === "compressing"}
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-300 focus:border-teal-500/50 focus:outline-none disabled:opacity-50"
              >
                {FORMAT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t.formats[option]}
                  </option>
                ))}
              </select>
              {format === "avif" && avifSupported === false && (
                <p className="text-[11px] leading-relaxed text-amber-400/90">{t.avifUnsupported}</p>
              )}
              {format === "avif" && avifSupported === null && (
                <p className="text-[11px] text-zinc-500">{t.avifChecking}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-zinc-400" htmlFor="max-width">
                {t.maxWidthLabel}
              </label>
              <select
                id="max-width"
                disabled={status === "compressing"}
                value={maxWidth ?? "original"}
                onChange={(e) => {
                  const value = e.target.value;
                  setMaxWidth(value === "original" ? null : Number(value));
                }}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-300 focus:border-teal-500/50 focus:outline-none disabled:opacity-50"
              >
                {MAX_WIDTH_OPTIONS.map((option) => (
                  <option key={option.labelKey} value={option.value ?? "original"}>
                    {t.maxWidthOptions[option.labelKey]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-zinc-400" htmlFor="quality">
                  {t.qualityLabel}
                </label>
                <span className="font-mono text-xs text-zinc-300">{quality}%</span>
              </div>
              <input
                id="quality"
                type="range"
                min={10}
                max={100}
                step={5}
                disabled={status === "compressing" || format === "png"}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-teal-500 disabled:opacity-50"
              />
              {format === "png" && <p className="text-[11px] text-zinc-500">{t.pngQualityNote}</p>}
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5">
              <input
                type="checkbox"
                checked={preserveExif}
                disabled={status === "compressing"}
                onChange={(e) => setPreserveExif(e.target.checked)}
                className="accent-teal-500"
              />
              <span className="font-mono text-xs text-zinc-400">{t.preserveExifLabel}</span>
            </label>

            {showSizeWarning && (
              <div className="flex gap-3 rounded-xl border border-zinc-900 bg-zinc-950/60 p-3.5 text-[11px] leading-normal text-zinc-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500/90" />
                <span>{t.fileSizeWarning}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs text-rose-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {result?.avifFallback && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{t.avifFallbackNotice}</span>
              </div>
            )}

            {status === "loaded" && (
              <div className="mt-2 flex flex-col gap-3 border-t border-zinc-800/60 pt-6">
                <button
                  type="button"
                  onClick={() => void handleOptimize()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-teal-400 active:scale-98"
                >
                  <Zap className="h-4 w-4" />
                  <span>{t.optimizeButton}</span>
                </button>
              </div>
            )}

            <div className="flex gap-3 rounded-xl border border-zinc-900 bg-zinc-950/60 p-3.5 text-[11px] leading-normal text-zinc-400">
              <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-500/90" />
              <span>{t.privacyNote}</span>
            </div>
          </div>
        ) : (
          <div className="flex animate-fadeIn flex-col gap-6 rounded-2xl border border-zinc-800/60 bg-[#18191e] p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-teal-500/20 bg-teal-500/10">
                <CheckCircle className="h-6 w-6 text-teal-400" />
              </div>
              <h2 className="mb-2 font-mono text-sm font-bold text-white">{t.optimizedTitle}</h2>
              <p className="text-xs font-light leading-relaxed text-zinc-400">{t.optimizedDesc}</p>
              {result?.avifFallback && (
                <p className="mt-2 text-xs text-amber-400/90">{t.avifFallbackNotice}</p>
              )}
            </div>

            {result && (
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-4 font-mono text-xs text-zinc-300">
                <p>{savingsText}</p>
                {dimensionsText && <p className="mt-2 text-zinc-500">{dimensionsText}</p>}
                <p className="mt-2 text-zinc-500">
                  {t.outputFormatLabel}: {t.formats[result.outputFormat].toUpperCase()}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-6">
              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-teal-400 active:scale-98"
              >
                <Download className="h-4 w-4" />
                <span>{t.downloadOptimized}</span>
              </button>

              <button
                type="button"
                onClick={resetState}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900 py-3 text-xs font-medium text-zinc-300 transition-all duration-200 hover:bg-zinc-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{t.processAnother}</span>
              </button>

              <GitHubStarCta text={dict.common.starCta} className="mt-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
