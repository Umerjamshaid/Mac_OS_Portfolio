import useWindowStore from "#store/window";

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, toggleFullscreen, windows } = useWindowStore();
  const isFullscreen = windows[target]?.isFullscreen ?? false;

  return (
    <div id="window-controls">
      <div
        className="close"
        role="button"
        tabIndex={0}
        title="Close"
        aria-label="Close window"
        onClick={() => closeWindow(target)}
        onKeyDown={(e) => e.key === "Enter" && closeWindow(target)}
      />
      <div
        className="minimize"
        role="button"
        tabIndex={0}
        title="Minimize"
        aria-label="Minimize window"
        onClick={() => minimizeWindow(target)}
        onKeyDown={(e) => e.key === "Enter" && minimizeWindow(target)}
      />
      <div
        className={`maximize${isFullscreen ? " maximize-active" : ""}`}
        role="button"
        tabIndex={0}
        title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        onClick={() => toggleFullscreen(target)}
        onKeyDown={(e) => e.key === "Enter" && toggleFullscreen(target)}
      />
    </div>
  );
};

export default WindowControls;
