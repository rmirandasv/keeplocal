"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  Sparkles,
} from "lucide-react";
import type { Dictionary } from "@/utils/i18n";
import { resolveLocale } from "@/utils/i18n";
import {
  DEFAULT_CHARSET,
  DEFAULT_PASSWORD_LENGTH,
  DEFAULT_WORD_COUNT,
  estimateEntropyBits,
  generateSecret,
  getEntropyStrength,
  isCharsetValid,
  MAX_PASSWORD_LENGTH,
  MAX_WORD_COUNT,
  MIN_PASSWORD_LENGTH,
  MIN_WORD_COUNT,
  type GeneratorMode,
  type PasswordGenOptions,
} from "@/utils/passwordGen";
import GitHubStarCta from "@/components/layout/GitHubStarCta";

interface PasswordGenConsoleProps {
  lang: string;
  dict: Dictionary;
}

function getStrengthClass(strength: ReturnType<typeof getEntropyStrength>): string {
  switch (strength) {
    case "weak":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "fair":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "strong":
      return "border-teal-500/30 bg-teal-500/10 text-teal-300";
    case "veryStrong":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    default:
      return "border-zinc-700/60 bg-zinc-950/40 text-zinc-300";
  }
}

export default function PasswordGenConsole({ lang, dict }: PasswordGenConsoleProps) {
  const t = dict.passwordGen;
  const locale = resolveLocale(lang);

  const [mode, setMode] = useState<GeneratorMode>("password");
  const [length, setLength] = useState(DEFAULT_PASSWORD_LENGTH);
  const [wordCount, setWordCount] = useState(DEFAULT_WORD_COUNT);
  const [charset, setCharset] = useState(DEFAULT_CHARSET);
  const [separator, setSeparator] = useState("-");
  const [capitalizeWords, setCapitalizeWords] = useState(false);
  const [generationToken, setGenerationToken] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const options: PasswordGenOptions = useMemo(
    () => ({
      mode,
      length,
      wordCount,
      charset,
      separator,
      capitalizeWords,
    }),
    [mode, length, wordCount, charset, separator, capitalizeWords],
  );

  const entropyBits = useMemo(() => estimateEntropyBits(options, locale), [options, locale]);
  const entropyStrength = getEntropyStrength(entropyBits);
  const charsetValid = mode === "password" ? isCharsetValid(charset) : true;

  const secret = useMemo(() => {
    if (!charsetValid) {
      return "";
    }

    return generateSecret(options, locale);
  // generationToken intentionally busts the memo when the user clicks regenerate
  // eslint-disable-next-line react-hooks/exhaustive-deps -- manual regenerate nonce
  }, [charsetValid, options, locale, generationToken]);

  const regenerate = useCallback(() => {
    setGenerationToken((value) => value + 1);
    setCopied(false);
  }, []);

  const handleCopy = async () => {
    if (!secret) return;

    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const strengthLabel = t.strength[entropyStrength];
  const entropyText = t.entropyLabel.replace("{bits}", entropyBits.toFixed(1));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-black/40">
          <div className="flex h-full min-h-[280px] flex-col justify-between bg-[#07080a] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-black/60 px-3 py-1 font-mono text-[11px] text-zinc-400">
                <KeyRound className="h-3.5 w-3.5 text-teal-400" aria-hidden />
                <span>{mode === "password" ? t.modes.password : t.modes.passphrase}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVisible((value) => !value)}
                  className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-2 text-zinc-400 transition-colors hover:text-zinc-200"
                  aria-label={isVisible ? t.hideSecret : t.showSecret}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  disabled={!secret}
                  className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-2 text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-40"
                  aria-label={copied ? t.copied : t.copySecret}
                >
                  {copied ? <Check className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={regenerate}
                  disabled={!charsetValid}
                  className="rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-2 text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-40"
                  aria-label={t.regenerate}
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="my-8 flex flex-1 items-center">
              {charsetValid ? (
                <p
                  className={`w-full break-all font-mono text-xl leading-relaxed md:text-2xl ${
                    isVisible ? "text-white" : "select-none text-zinc-700 blur-sm"
                  }`}
                >
                  {secret || "…"}
                </p>
              ) : (
                <p className="text-sm font-light leading-relaxed text-rose-300/90">{t.errors.emptyCharset}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 font-mono text-[11px] ${getStrengthClass(entropyStrength)}`}
              >
                {strengthLabel}
              </span>
              <span className="font-mono text-[11px] text-zinc-500">{entropyText}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 rounded-xl border border-zinc-900 bg-zinc-950/60 p-3.5 text-[11px] leading-normal text-zinc-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-500/90" />
          <span>{t.privacyNote}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-zinc-800/60 bg-[#18191e] p-6">
          <h2 className="border-b border-zinc-800/60 pb-3 font-mono text-sm font-bold uppercase tracking-wider text-zinc-400">
            {t.configDeckTitle}
          </h2>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-zinc-400">{t.modeLabel}</span>
            <div className="grid grid-cols-2 gap-2">
              {(["password", "passphrase"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  className={`rounded-lg border px-3 py-2.5 font-mono text-xs transition-colors ${
                    mode === option
                      ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                      : "border-zinc-800 text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {t.modes[option]}
                </button>
              ))}
            </div>
          </div>

          {mode === "password" ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-zinc-400" htmlFor="password-length">
                  {t.lengthLabel.replace("{value}", String(length))}
                </label>
                <input
                  id="password-length"
                  type="range"
                  min={MIN_PASSWORD_LENGTH}
                  max={MAX_PASSWORD_LENGTH}
                  value={length}
                  onChange={(event) => setLength(Number(event.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs text-zinc-400">{t.charsetLabel}</span>
                {(
                  [
                    ["lowercase", t.charset.lowercase],
                    ["uppercase", t.charset.uppercase],
                    ["numbers", t.charset.numbers],
                    ["symbols", t.charset.symbols],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={charset[key]}
                      onChange={(event) =>
                        setCharset((current) => ({ ...current, [key]: event.target.checked }))
                      }
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-teal-500"
                    />
                    <span className="font-mono text-xs text-zinc-300">{label}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-zinc-400" htmlFor="word-count">
                  {t.wordCountLabel.replace("{value}", String(wordCount))}
                </label>
                <input
                  id="word-count"
                  type="range"
                  min={MIN_WORD_COUNT}
                  max={MAX_WORD_COUNT}
                  value={wordCount}
                  onChange={(event) => setWordCount(Number(event.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-zinc-400" htmlFor="separator">
                  {t.separatorLabel}
                </label>
                <input
                  id="separator"
                  type="text"
                  maxLength={3}
                  value={separator}
                  onChange={(event) => setSeparator(event.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300 focus:border-teal-500/50 focus:outline-none"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={capitalizeWords}
                  onChange={(event) => setCapitalizeWords(event.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-teal-500"
                />
                <span className="font-mono text-xs text-zinc-300">{t.capitalizeWordsLabel}</span>
              </label>
            </>
          )}

          <button
            type="button"
            onClick={regenerate}
            disabled={!charsetValid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-teal-400 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t.regenerate}</span>
          </button>
        </div>

        <GitHubStarCta text={dict.common.starCta} />
      </div>
    </div>
  );
}
