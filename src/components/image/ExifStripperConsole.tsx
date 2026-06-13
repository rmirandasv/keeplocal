"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import type { Dictionary } from "@/utils/i18n";
import { loadExifMetadata, type MetadataField } from "@/utils/parseExifMetadata";
import {
  buildCleanFilename,
  isSupportedImageType,
  MAX_IMAGE_FILE_SIZE,
  stripExifFromImage,
} from "@/utils/stripExif";
import GitHubStarCta from "@/components/layout/GitHubStarCta";

type ConsoleStatus = "idle" | "loaded" | "stripping" | "success";

interface ExifStripperConsoleProps {
  dict: Dictionary;
}

function getSensitivityClass(sensitivity: MetadataField["sensitivity"]): string {
  switch (sensitivity) {
    case "gps":
      return "border-amber-500/30 bg-amber-500/5 text-amber-200/90";
    case "camera":
      return "border-sky-500/30 bg-sky-500/5 text-sky-200/90";
    case "date":
      return "border-violet-500/30 bg-violet-500/5 text-violet-200/90";
    default:
      return "border-zinc-700/60 bg-zinc-950/40 text-zinc-300";
  }
}

function getFieldLabel(
  field: MetadataField,
  labels: Dictionary["exifStripper"]["labels"],
): string {
  if (field.labelKey === "generic") {
    return field.value;
  }

  const label = labels[field.labelKey as keyof typeof labels];
  return label ? `${label}: ${field.value}` : field.value;
}

export default function ExifStripperConsole({ dict }: ExifStripperConsoleProps) {
  const t = dict.exifStripper;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<ConsoleStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([]);
  const [orientation, setOrientation] = useState(1);
  const [cleanBlob, setCleanBlob] = useState<Blob | null>(null);
  const [cleanPreviewUrl, setCleanPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const resetState = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanPreviewUrl) URL.revokeObjectURL(cleanPreviewUrl);

    setStatus("idle");
    setSelectedFile(null);
    setPreviewUrl(null);
    setMetadataFields([]);
    setOrientation(1);
    setCleanBlob(null);
    setCleanPreviewUrl(null);
    setErrorMsg(null);
    setShowSizeWarning(false);
    setIsDragOver(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, cleanPreviewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (cleanPreviewUrl) URL.revokeObjectURL(cleanPreviewUrl);
    };
  }, [previewUrl, cleanPreviewUrl]);

  const processFile = async (file: File) => {
    setErrorMsg(null);

    if (!isSupportedImageType(file.type)) {
      setErrorMsg(t.errors.unsupportedFormat);
      return;
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
      setErrorMsg(t.errors.fileTooLarge);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (cleanPreviewUrl) URL.revokeObjectURL(cleanPreviewUrl);

    setCleanBlob(null);
    setCleanPreviewUrl(null);
    setShowSizeWarning(file.size > MAX_IMAGE_FILE_SIZE * 0.5);

    const nextPreviewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    setStatus("loaded");

    try {
      const parsed = await loadExifMetadata(file);
      setMetadataFields(parsed.fields);
      setOrientation(parsed.orientation);
    } catch {
      setMetadataFields([]);
      setOrientation(1);
      setErrorMsg(t.errors.readFailed);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleStripMetadata = async () => {
    if (!selectedFile) return;

    setStatus("stripping");
    setErrorMsg(null);

    try {
      const blob = await stripExifFromImage(selectedFile, orientation);
      const url = URL.createObjectURL(blob);

      if (cleanPreviewUrl) URL.revokeObjectURL(cleanPreviewUrl);

      setCleanBlob(blob);
      setCleanPreviewUrl(url);
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "unsupported_format") {
        setErrorMsg(t.errors.unsupportedFormat);
      } else {
        setErrorMsg(t.errors.processingFailed);
      }
      setStatus("loaded");
    }
  };

  const handleDownload = () => {
    if (!cleanBlob || !selectedFile || !isSupportedImageType(selectedFile.type)) return;

    const filename = buildCleanFilename(selectedFile.name, selectedFile.type);
    const url = URL.createObjectURL(cleanBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const displayUrl = cleanPreviewUrl ?? previewUrl;
  const fieldsFoundText = t.fieldsFound.replace("{count}", String(metadataFields.length));

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

          {status === "stripping" && (
            <div className="absolute inset-0 flex animate-fadeIn flex-col items-center justify-center bg-black/80 p-6 text-center backdrop-blur-sm">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-teal-400" />
              <h3 className="mb-2 font-mono text-sm font-bold text-white">{t.stripping}</h3>
            </div>
          )}

          {selectedFile && status !== "idle" && (
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-black/60 px-3 py-1 font-mono text-xs backdrop-blur-md">
              <span className="max-w-[220px] truncate text-zinc-300">{selectedFile.name}</span>
              {status !== "stripping" && (
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
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-6">
        {status !== "success" ? (
          <div className="flex flex-col gap-6 rounded-2xl border border-zinc-800/60 bg-[#18191e] p-6">
            <h2 className="border-b border-zinc-800/60 pb-3 font-mono text-sm font-bold uppercase tracking-wider text-zinc-400">
              {t.metadataTitle}
            </h2>

            {status === "idle" ? (
              <p className="text-xs font-light leading-relaxed text-zinc-500">{t.privacyNote}</p>
            ) : metadataFields.length > 0 ? (
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[11px] text-zinc-500">{fieldsFoundText}</p>
                <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
                  {metadataFields.map((field) => (
                    <li
                      key={`${field.key}-${field.value}`}
                      className={`rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed ${getSensitivityClass(field.sensitivity)}`}
                    >
                      <span className="inline-flex items-start gap-2">
                        {field.sensitivity === "gps" && (
                          <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                        )}
                        {getFieldLabel(field, t.labels)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs font-light leading-relaxed text-zinc-400">{t.noMetadata}</p>
            )}

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

            {status === "loaded" && (
              <div className="mt-2 flex flex-col gap-3 border-t border-zinc-800/60 pt-6">
                <button
                  type="button"
                  onClick={() => void handleStripMetadata()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-teal-400 active:scale-98"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t.stripButton}</span>
                </button>
              </div>
            )}

            <div className="flex gap-3 rounded-xl border border-zinc-900 bg-zinc-950/60 p-3.5 text-[11px] leading-normal text-zinc-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-500/90" />
              <span>{t.privacyNote}</span>
            </div>
          </div>
        ) : (
          <div className="flex animate-fadeIn flex-col gap-6 rounded-2xl border border-zinc-800/60 bg-[#18191e] p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-teal-500/20 bg-teal-500/10">
                <CheckCircle className="h-6 w-6 text-teal-400" />
              </div>
              <h2 className="mb-2 font-mono text-sm font-bold text-white">{t.strippedTitle}</h2>
              <p className="text-xs font-light leading-relaxed text-zinc-400">{t.strippedDesc}</p>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-6">
              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-teal-400 active:scale-98"
              >
                <Download className="h-4 w-4" />
                <span>{t.downloadClean}</span>
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
