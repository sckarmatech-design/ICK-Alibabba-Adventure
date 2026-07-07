import { Form, Link } from "react-router";

export interface AdminSaveBarDeleteButton {
  /** Label shown on the button, e.g. "Delete Trip" */
  label: string;
  /** Confirm message shown via window.confirm */
  confirmMessage: string;
}

export interface AdminSaveBarProps {
  /** id of the wrapping save form. The Save button uses `form={formId}` so it
   *  lives outside the form DOM-tree but still submits it. */
  formId: string;
  isSubmitting: boolean;
  isUploading?: boolean;
  /** True when a successful save should show the green banner */
  successVisible: boolean;
  /** General error message from the action (try/catch path). Per-field
   *  validation errors stay inline on the form. */
  errorMessage?: string | null;
  cancelHref: string;
  saveLabel: string;
  submittingLabel: string;
  /** Optional destructive action. Rendered as its OWN <Form> so Enter-key
   *  submission in any text input in the main form can never trigger it. */
  deleteButton?: AdminSaveBarDeleteButton;
  onDismissSuccess: () => void;
}

/**
 * Sticky bottom save bar for every admin CRUD form. Mirrors the pattern from
 * /admin/settings: success banner, error banner, and the primary "Save"
 * button are all visible together so an admin editing a long form never has
 * to scroll to find them.
 *
 * Architecture: the Save button is rendered as `<button type="submit"
 * form={formId}>` so it lives outside the save <Form>'s DOM tree but still
 * submits it. Delete lives in its own <Form>, entirely separate, so an
 * accidental Enter press inside a text input can never trigger it.
 */
export function AdminSaveBar({
  formId,
  isSubmitting,
  isUploading = false,
  successVisible,
  errorMessage,
  cancelHref,
  saveLabel,
  submittingLabel,
  deleteButton,
  onDismissSuccess,
}: AdminSaveBarProps) {
  const disabled = isSubmitting || isUploading;

  return (
    <div className="sticky bottom-0 -mx-8 -mb-8 mt-6 px-6 py-4 bg-gray-900/95 backdrop-blur border-t border-gray-800 rounded-b-lg flex items-center gap-4">
      {/* Delete: its own <Form>, entirely separate from the save form. */}
      {deleteButton && (
        <Form method="post" className="shrink-0 min-w-0">
          <input type="hidden" name="_action" value="delete" />
          <button
            type="submit"
            disabled={disabled}
            onClick={(event) => {
              if (!confirm(deleteButton.confirmMessage)) {
                event.preventDefault();
              }
            }}
            className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-red-300 border border-red-900/50 rounded text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {deleteButton.label}
          </button>
        </Form>
      )}

      {/* Banners */}
      <div className="grow min-w-0">
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden="true"
              className="shrink-0 mt-0.5"
            >
              <circle
                cx="9"
                cy="9"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M9 5v5M9 13v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="grow">{errorMessage}</span>
          </div>
        )}
        {successVisible && !errorMessage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden="true"
              className="shrink-0"
            >
              <circle cx="9" cy="9" r="8" fill="currentColor" opacity="0.2" />
              <path
                d="M5 9l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="grow">Saved successfully</span>
            <button
              type="button"
              onClick={onDismissSuccess}
              className="text-green-300/70 hover:text-green-200 text-xs"
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Cancel */}
      <Link
        to={cancelHref}
        className="shrink-0 px-4 py-2 text-gray-300 hover:text-white transition text-sm font-medium"
      >
        Cancel
      </Link>

      {/* Save: button outside the form, uses `form={formId}` to submit it. */}
      <button
        type="submit"
        form={formId}
        disabled={disabled}
        aria-busy={isSubmitting}
        className="shrink-0 px-5 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded text-sm font-semibold inline-flex items-center gap-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
      >
        {isSubmitting && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="animate-spin"
          >
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M8 2a6 6 0 0 1 6 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
        {isSubmitting ? submittingLabel : saveLabel}
      </button>
    </div>
  );
}
