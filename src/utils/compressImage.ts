export const OPTIMIZER_INPUT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
] as const;

export type OptimizerInputType = (typeof OPTIMIZER_INPUT_TYPES)[number];
export type OutputFormat = "jpeg" | "png" | "webp" | "avif";

export const MAX_IMAGE_FILE_SIZE = 25 * 1024 * 1024;
export const COMPRESSION_LIB_URL = "/lib/browser-image-compression.js";

const FORMAT_MIME: Record<Exclude<OutputFormat, "avif">, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const FORMAT_EXTENSION: Record<OutputFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
};

let avifSupportCache: boolean | null = null;

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CompressImageOptions {
  format: OutputFormat;
  quality: number;
  maxWidth: number | null;
  preserveExif: boolean;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export interface CompressImageResult {
  blob: Blob;
  outputFormat: OutputFormat;
  avifFallback: boolean;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  originalDimensions: ImageDimensions;
  outputDimensions: ImageDimensions;
}

export function isOptimizerInputType(type: string): type is OptimizerInputType {
  return OPTIMIZER_INPUT_TYPES.includes(type as OptimizerInputType);
}

export async function detectAvifSupport(): Promise<boolean> {
  if (avifSupportCache !== null) return avifSupportCache;
  if (typeof document === "undefined") return false;

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      avifSupportCache = false;
      resolve(false);
      return;
    }

    ctx.fillRect(0, 0, 2, 2);
    canvas.toBlob(
      (blob) => {
        avifSupportCache = blob !== null && blob.size > 0;
        resolve(avifSupportCache);
      },
      "image/avif",
      0.5,
    );
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function buildOptimizedFilename(originalName: string, format: OutputFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseName = originalName.replace(/\.[^.]+$/, "") || "image";
  return `keeplocal-optimized-${baseName}-${timestamp}.${FORMAT_EXTENSION[format]}`;
}

function buildResult(
  file: File,
  blob: Blob,
  outputFormat: OutputFormat,
  avifFallback: boolean,
  originalDimensions: ImageDimensions,
  outputDimensions: ImageDimensions,
): CompressImageResult {
  const originalSize = file.size;
  const compressedSize = blob.size;
  const savingsPercent =
    originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return {
    blob,
    outputFormat,
    avifFallback,
    originalSize,
    compressedSize,
    savingsPercent,
    originalDimensions,
    outputDimensions,
  };
}

async function getImageDimensions(file: File | Blob): Promise<ImageDimensions> {
  const imageCompression = (await import("browser-image-compression")).default;
  const url = URL.createObjectURL(file);

  try {
    const img = await imageCompression.loadImage(url);
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function compressToAvif(
  file: File,
  options: Pick<CompressImageOptions, "quality" | "maxWidth" | "onProgress" | "signal">,
): Promise<{ blob: Blob; dimensions: ImageDimensions }> {
  const imageCompression = (await import("browser-image-compression")).default;

  options.onProgress?.(10);

  const orientation = await imageCompression.getExifOrientation(file).catch(() => 1);
  const [, canvas] = await imageCompression.drawFileInCanvas(file, {
    exifOrientation: orientation,
    maxWidthOrHeight: options.maxWidth ?? undefined,
    signal: options.signal,
  });

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;

  const ctx = outputCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("processing_failed");
  }

  ctx.drawImage(canvas as CanvasImageSource, 0, 0);
  options.onProgress?.(70);

  const blob = await new Promise<Blob>((resolve, reject) => {
    outputCanvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("avif_unsupported"));
        }
      },
      "image/avif",
      options.quality,
    );
  });

  options.onProgress?.(100);

  return {
    blob,
    dimensions: { width: outputCanvas.width, height: outputCanvas.height },
  };
}

export async function compressImage(
  file: File,
  options: CompressImageOptions,
): Promise<CompressImageResult> {
  const imageCompression = (await import("browser-image-compression")).default;
  const originalDimensions = await getImageDimensions(file);

  let targetFormat = options.format;
  let avifFallback = false;

  if (options.format === "avif") {
    const supported = await detectAvifSupport();
    if (!supported) {
      targetFormat = "webp";
      avifFallback = true;
    }
  }

  if (targetFormat === "avif") {
    try {
      const { blob, dimensions } = await compressToAvif(file, options);
      return buildResult(file, blob, "avif", false, originalDimensions, dimensions);
    } catch {
      targetFormat = "webp";
      avifFallback = true;
    }
  }

  const compressedFile = await imageCompression(file, {
    maxWidthOrHeight: options.maxWidth ?? undefined,
    initialQuality: options.quality,
    fileType: FORMAT_MIME[targetFormat as Exclude<OutputFormat, "avif">],
    preserveExif: options.preserveExif,
    useWebWorker: true,
    libURL: COMPRESSION_LIB_URL,
    onProgress: options.onProgress,
    signal: options.signal,
  });

  const outputDimensions = await getImageDimensions(compressedFile);

  return buildResult(
    file,
    compressedFile,
    targetFormat,
    avifFallback,
    originalDimensions,
    outputDimensions,
  );
}
