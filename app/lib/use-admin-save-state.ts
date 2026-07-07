import { useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";

/**
 * Generic action-result shape for admin CRUD routes. The action either
 * succeeds ({ok: true}), throws a top-level error ({ok: false, error}),
 * or fails validation ({errors}). Routes can extend with extra fields.
 */
export type AdminActionResult =
  | { ok: true }
  | { ok: false; error: string }
  | { errors: Record<string, string> }
  | undefined;

interface UseAdminSaveStateOptions {
  /** When provided, only treat navigation as submitting this specific form
   *  (avoids false positives from other in-flight navigations). */
  formAction?: string;
}

interface UseAdminSaveStateReturn {
  isSubmitting: boolean;
  successVisible: boolean;
  setSuccessVisible: (next: boolean) => void;
}

/**
 * Shared save-state management for admin CRUD forms. Encapsulates the
 * "Saving…" button-state, success-banner visibility (auto-dismiss after 4s),
 * and clearing the banner when a new submission starts.
 */
export function useAdminSaveState(
  actionResult: AdminActionResult,
  options: UseAdminSaveStateOptions = {},
): UseAdminSaveStateReturn {
  const { formAction } = options;
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formMethod === "POST" &&
    (formAction ? navigation.formAction === formAction : true);

  const [successVisible, setSuccessVisible] = useState(false);
  const lastResultRef = useRef(actionResult);

  useEffect(() => {
    if (actionResult && actionResult !== lastResultRef.current) {
      lastResultRef.current = actionResult;
      if ("ok" in actionResult && actionResult.ok === true) {
        setSuccessVisible(true);
        const timer = setTimeout(() => setSuccessVisible(false), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [actionResult]);

  useEffect(() => {
    if (isSubmitting) {
      setSuccessVisible(false);
    }
  }, [isSubmitting]);

  return { isSubmitting, successVisible, setSuccessVisible };
}
