import useWindowStore from "#store/window";

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, toggleFullscreen, windows } = useWindowStore();
  const isFullscreen = windows[target]?.isFullscreen ?? false;

  return (
    <div id="window-controls">
      <button
        type="button"
        className="close"
        role="button"
        tabIndex={0}
        title="Close"
        aria-label="Close window"
        onClick={() => closeWindow(target)}
        onKeyDown={(e) => e.key === "Enter" && closeWindow(target)}
      />
      <button
        type="button"
        className="minimize"
        role="button"
        tabIndex={0}
        title="Minimize"
        title="Minimise"
        aria-label="Minimize window"
        onClick={() => minimizeWindow(target)}
        onKeyDown={(e) => e.key === "Enter" && minimizeWindow(target)}
      />
      <button
        type="button"
        className={`maximize${isFullscreen ? " maximize-active" : ""}`}
        role="button"
        tabIndex={0}
        title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        aria-pressed={isFullscreen}
        onClick={() => toggleFullscreen(target)}
        onKeyDown={(e) => e.key === "Enter" && toggleFullscreen(target)}
      />
    </div>
  );
};

export default WindowControls;
