"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Minimal, self-contained typings for the Web Speech API.
 * It is non-standard (vendor-prefixed in most browsers) and not reliably
 * present in TS's DOM lib, so we declare just what we use under unique names to
 * avoid clashing with any built-in definitions.
 */
interface SpeechAlternative {
  readonly transcript: string;
}
type SpeechResult = ArrayLike<SpeechAlternative>;
type SpeechResultList = ArrayLike<SpeechResult>;

interface SpeechRecognitionEventLike {
  readonly results: SpeechResultList;
}
interface SpeechRecognitionErrorLike {
  readonly error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

/** Resolve the (possibly prefixed) constructor, or null if unsupported. */
function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface UseSpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  lang?: string;
}

interface UseSpeechRecognitionReturn {
  /** False when the browser lacks the Web Speech API — hide the mic UI. */
  isSupported: boolean;
  isListening: boolean;
  start: () => void;
  stop: () => void;
}

/**
 * Thin React wrapper over the Web Speech API for one-shot dictation.
 * Gracefully degrades: `isSupported` is false when the API is unavailable, and
 * `start`/`stop` become no-ops, so callers can simply hide the mic button.
 */
export function useSpeechRecognition({
  onResult,
  lang = "en-US",
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Keep the latest callback without re-creating `start`.
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  // Feature-detect after mount (avoids SSR/hydration mismatch on the mic icon).
  useEffect(() => {
    setIsSupported(getRecognitionCtor() !== null);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    recognitionRef.current?.abort();

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) onResultRef.current(transcript.trim());
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, [lang]);

  // Tidy up if the component unmounts mid-listen.
  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  return { isSupported, isListening, start, stop };
}
