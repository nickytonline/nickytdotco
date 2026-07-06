import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  targetId: string;
  label?: string;
  copiedMessage?: string;
  errorMessage?: string;
}

interface CopyContent {
  markdown: string;
}

const copyPlainText = async (text: string): Promise<void> => {
  if (!navigator.clipboard?.writeText || !window.isSecureContext) {
    throw new Error("Clipboard API is unavailable");
  }

  await navigator.clipboard.writeText(text);
};

const getCopyContent = (targetId: string): CopyContent | null => {
  const target = document.getElementById(targetId);

  if (!target?.dataset.bio) {
    return null;
  }

  return {
    markdown: target.dataset.bio,
  };
};

const CopyButton = ({
  targetId,
  label = "Copy content",
  copiedMessage = "Copied to clipboard",
  errorMessage = "Clipboard access was blocked. Select and copy the content manually.",
}: CopyButtonProps) => {
  const [didCopy, setDidCopy] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!didCopy && !hasError) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setDidCopy(false);
      setHasError(false);
    }, 2500);

    return () => window.clearTimeout(resetTimer);
  }, [didCopy, hasError]);

  const handleCopy = async () => {
    setHasError(false);
    const content = getCopyContent(targetId);

    if (!content) {
      setDidCopy(false);
      setHasError(true);
      return;
    }

    try {
      await copyPlainText(content.markdown);
      setDidCopy(true);
    } catch {
      setDidCopy(false);
      setHasError(true);
    }
  };

  const statusMessage = didCopy ? copiedMessage : hasError ? errorMessage : "";

  return (
    <>
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-background hover:text-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        onClick={handleCopy}
        title={label}
      >
        {didCopy ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">{didCopy ? copiedMessage : label}</span>
      </button>
      <div className="sr-only" aria-live="polite">
        {statusMessage}
      </div>
    </>
  );
};

export default CopyButton;
