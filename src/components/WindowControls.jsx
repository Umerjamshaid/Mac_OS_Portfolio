import useWindowStore from "#store/window";

const WindowControls = ({ target }) => {
  const { closeWindow, minimizeWindow, toggleFullscreen, windows } = useWindowStore();
  const isFullscreen = windows[target]?.isFullscreen ?? false;

  return (
    <div id="window-controls">
      <div
        className="close"
        title="Close"
        onClick={() => closeWindow(target)}
      />
      <div
        className="minimize"
        title="Minimise"
        onClick={() => minimizeWindow(target)}
      />
      <div
        className={`maximize${isFullscreen ? " maximize-active" : ""}`}
        title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
        onClick={() => toggleFullscreen(target)}
      />
    </div>
  );
};

export default WindowControls;
