import { useRef, useState } from "react";

import { Box, Popover } from "@mui/material";

import JsonView from "./JsonView";

interface MetadataPopoverProps {
  /**
   * Arbitrary data to render with JsonView.
   */
  data: unknown;
  /**
   * Maximum height (in px) for the inline preview before it is truncated.
   * Defaults to 150.
   */
  maxPreviewHeight?: number;
}

/**
 * Shows a small, non-scrolling preview of arbitrary JSON-serialisable data.
 * When the user hovers the preview, a pop-over appears containing the full
 * JsonView. This prevents the mouse-wheel from getting trapped inside the
 * virtualised event card while still allowing the user to inspect the data in
 * detail.
 */
export default function MetadataPopover({
  data,
  maxPreviewHeight = 150
}: MetadataPopoverProps) {
  const [anchorPos, setAnchorPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [open, setOpen] = useState(false);

  // Track a close timer so we can cancel if the user moves from preview into the pop-over.
  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setAnchorPos(null);
    }, 80);
  };

  const handlePreviewMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    clearCloseTimer();
    setAnchorPos({ top: event.clientY, left: event.clientX });
    setOpen(true);
  };

  const handlePreviewMouseLeave = () => {
    scheduleClose();
  };

  const handlePopoverMouseEnter = () => {
    clearCloseTimer();
  };

  const handlePopoverMouseLeave = () => {
    scheduleClose();
  };

  return (
    <Box
      onMouseEnter={handlePreviewMouseEnter}
      onMouseLeave={handlePreviewMouseLeave}
      sx={{ width: "100%" }}
    >
      {/* Inline preview (truncated) */}
      <Box sx={{ maxHeight: maxPreviewHeight, overflow: "hidden" }}>
        <JsonView data={data} />
      </Box>

      {/* Full view pop-over */}
      <Popover
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={anchorPos ?? { top: 0, left: 0 }}
        onClose={scheduleClose}
        disableRestoreFocus
        PaperProps={{
          onMouseEnter: handlePopoverMouseEnter,
          onMouseLeave: handlePopoverMouseLeave,
          sx: {
            p: 2,
            maxWidth: "70vw",
            maxHeight: "70vh",
            overflow: "auto",
            bgcolor: "background.paper",
            boxShadow: 3
          }
        }}
        transformOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <JsonView data={data} />
      </Popover>
    </Box>
  );
}
