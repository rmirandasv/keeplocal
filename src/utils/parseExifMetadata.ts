import type { Tags } from "exifreader";

export type MetadataSensitivity = "gps" | "camera" | "date" | "general";

export interface MetadataField {
  key: string;
  labelKey: string;
  value: string;
  sensitivity: MetadataSensitivity;
}

export interface ParsedExifResult {
  fields: MetadataField[];
  orientation: number;
  totalCount: number;
}

const PRIORITY_TAGS: Array<{
  tag: keyof Tags | string;
  labelKey: string;
  sensitivity: MetadataSensitivity;
}> = [
  { tag: "GPSLatitude", labelKey: "gpsLatitude", sensitivity: "gps" },
  { tag: "GPSLongitude", labelKey: "gpsLongitude", sensitivity: "gps" },
  { tag: "Make", labelKey: "cameraMake", sensitivity: "camera" },
  { tag: "Model", labelKey: "cameraModel", sensitivity: "camera" },
  { tag: "DateTimeOriginal", labelKey: "dateTaken", sensitivity: "date" },
  { tag: "DateTime", labelKey: "dateModified", sensitivity: "date" },
  { tag: "Software", labelKey: "software", sensitivity: "general" },
  { tag: "ImageDescription", labelKey: "description", sensitivity: "general" },
  { tag: "Orientation", labelKey: "orientation", sensitivity: "general" },
];

function tagToString(tag: unknown): string | null {
  if (!tag || typeof tag !== "object") return null;

  const record = tag as Record<string, unknown>;

  if (typeof record.description === "string" && record.description.length > 0) {
    return record.description;
  }

  if (record.value !== undefined) {
    const value = record.value;
    if (Array.isArray(value)) {
      return value.map(String).join(", ");
    }
    return String(value);
  }

  return null;
}

function getOrientation(tags: Tags): number {
  const orientation = tags.Orientation;
  if (!orientation || typeof orientation !== "object") return 1;

  const value = (orientation as { value?: number }).value;
  return typeof value === "number" && value >= 1 && value <= 8 ? value : 1;
}

export function parseExifFromTags(tags: Tags): ParsedExifResult {
  const fields: MetadataField[] = [];
  const seenKeys = new Set<string>();

  for (const { tag, labelKey, sensitivity } of PRIORITY_TAGS) {
    const tagData = tags[tag as keyof Tags];
    const value = tagToString(tagData);
    if (!value) continue;

    fields.push({ key: String(tag), labelKey, value, sensitivity });
    seenKeys.add(String(tag));
  }

  for (const [tag, tagData] of Object.entries(tags)) {
    if (seenKeys.has(tag) || tag === "Thumbnail" || tag === "Images") continue;

    const value = tagToString(tagData);
    if (!value) continue;

    fields.push({
      key: tag,
      labelKey: "generic",
      value: `${tag}: ${value}`,
      sensitivity: "general",
    });
  }

  return {
    fields,
    orientation: getOrientation(tags),
    totalCount: fields.length,
  };
}

export async function loadExifMetadata(file: File): Promise<ParsedExifResult> {
  const ExifReader = await import("exifreader");
  const buffer = await file.arrayBuffer();
  const tags = ExifReader.load(buffer);
  return parseExifFromTags(tags);
}
