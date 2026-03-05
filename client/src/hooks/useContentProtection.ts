import { useEffect } from "react";

/**
 * Hook to protect content from copying, printing, and inspection
 * Disables:
 * - CTRL+C (copy)
 * - CTRL+V (paste)
 * - CTRL+X (cut)
 * - CTRL+A (select all)
 * - Right-click context menu
 * - F12 (developer tools)
 * - CTRL+SHIFT+I (developer tools)
 * - CTRL+SHIFT+J (developer tools)
 * - CTRL+SHIFT+C (developer tools)
 * - Text selection
 * - Print screen
 */
export function useContentProtection() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // CTRL+C, CTRL+X, CTRL+V, CTRL+A
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "x" || e.key === "v" || e.key === "a")
      ) {
        e.preventDefault();
        return false;
      }

      // F12, CTRL+SHIFT+I, CTRL+SHIFT+J, CTRL+SHIFT+C
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))
      ) {
        e.preventDefault();
        return false;
      }

      // Print Screen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable cut
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable paste
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);

    // Disable user select via CSS
    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      /* Allow selection in input fields */
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
      document.head.removeChild(style);
    };
  }, []);
}

/**
 * Hook to protect video content from downloading
 * Disables right-click on video and prevents download
 */
export function useVideoProtection(videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Disable right-click on video
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts on video
        video.addEventListener("contextmenu", handleContextMenu);

    // Disable controls menu (some browsers)
    (video as any).controlsList = "nodownload";

    return () => {
      video.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [videoRef]);
}
