"use client";

import { useState, useCallback } from "react";

interface ProcessingResult<T = undefined> {
  loading: boolean;
  error: string | null;
  result: Blob | null;
  extra: T | null;
}

export function useProcessing<T = undefined>() {
  const [state, setState] = useState<ProcessingResult<T>>({
    loading: false,
    error: null,
    result: null,
    extra: null,
  });

  const process = useCallback(
    async (fn: () => Promise<Blob | { blob: Blob; extra?: T }>) => {
      setState({ loading: true, error: null, result: null, extra: null });

      try {
        const output = await fn();

        if (output instanceof Blob) {
          setState({ loading: false, error: null, result: output, extra: null });
        } else {
          setState({
            loading: false,
            error: null,
            result: output.blob,
            extra: output.extra ?? null,
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Processing failed.";
        setState({ loading: false, error: message, result: null, extra: null });
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null, extra: null });
  }, []);

  return { ...state, process, reset };
}
