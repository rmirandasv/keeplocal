export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export const MAX_IMAGE_FILE_SIZE = 25 * 1024 * 1024;

const JPEG_QUALITY = 0.92;

function getRotatedDimensions(
  width: number,
  height: number,
  orientation: number,
): { width: number; height: number } {
  if ([5, 6, 7, 8].includes(orientation)) {
    return { width: height, height: width };
  }
  return { width, height };
}

function applyOrientationTransform(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  orientation: number,
): void {
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      break;
  }
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: SupportedImageType,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const quality = mimeType === "image/jpeg" ? JPEG_QUALITY : undefined;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export image"));
        }
      },
      mimeType,
      quality,
    );
  });
}

export function isSupportedImageType(type: string): type is SupportedImageType {
  return SUPPORTED_IMAGE_TYPES.includes(type as SupportedImageType);
}

export async function stripExifFromImage(
  file: File,
  orientation = 1,
): Promise<Blob> {
  if (!isSupportedImageType(file.type)) {
    throw new Error("unsupported_format");
  }

  const img = await loadImageFromFile(file);
  const { width, height } = getRotatedDimensions(
    img.naturalWidth,
    img.naturalHeight,
    orientation,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("processing_failed");
  }

  applyOrientationTransform(ctx, img.naturalWidth, img.naturalHeight, orientation);
  ctx.drawImage(img, 0, 0);

  return canvasToBlob(canvas, file.type);
}

export function buildCleanFilename(originalName: string, mimeType: SupportedImageType): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseName = originalName.replace(/\.[^.]+$/, "") || "image";
  const extension =
    mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";

  return `keeplocal-clean-${baseName}-${timestamp}.${extension}`;
}
