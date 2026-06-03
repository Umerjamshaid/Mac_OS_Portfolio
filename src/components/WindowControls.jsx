import useWindowStore from "#store/window";

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, toggleFullscreen, windows } = useWindowStore();
  const isFullscreen = windows[target]?.isFullscreen ?? false;

  return (
    <div id="window-controls">
      <button
        type="button"
        className="close"
        title="Close"
        aria-label="Close window"
        onClick={() => closeWindow(target)}
      />
      <button
        type="button"
        className="minimize"
        title="Minimise"
        aria-label="Minimize window"
        onClick={() => minimizeWindow(target)}
      />
      <button
        type="button"
        className={`maximize${isFullscreen ? " maximize-active" : ""}`}
        title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
        aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        aria-pressed={isFullscreen}
        onClick={() => toggleFullscreen(target)}
      />
    </div>
  );
};

export default WindowControls;
