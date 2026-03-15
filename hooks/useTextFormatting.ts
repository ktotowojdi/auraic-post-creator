'use client';

/**
 * Handles Cmd+B in a textarea — wraps selection in **...**
 * Returns an onKeyDown handler to attach to the textarea.
 */
export function handleBoldShortcut(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  onChange: (newValue: string) => void
) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
    e.preventDefault();
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    if (selectionStart === selectionEnd) return; // nothing selected

    const selected = value.slice(selectionStart, selectionEnd);

    // Toggle: if already wrapped in **, remove them
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);

    if (before.endsWith('**') && after.startsWith('**')) {
      const newValue = before.slice(0, -2) + selected + after.slice(2);
      onChange(newValue);
      // Restore selection
      requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart - 2;
        textarea.selectionEnd = selectionEnd - 2;
      });
    } else {
      const newValue = before + '**' + selected + '**' + after;
      onChange(newValue);
      // Select the bold text (inside the **)
      requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart + 2;
        textarea.selectionEnd = selectionEnd + 2;
      });
    }
  }
}
