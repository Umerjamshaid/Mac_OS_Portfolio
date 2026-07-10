import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "#store/window";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState, useEffect } from "react";

const ImageWindowContent = () => {
  const { windows, openWindow } = useWindowStore();
  const data = windows.imgfile?.data;

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [data?.imageUrl]);

  if (!data) return null;

  const { name, imageUrl, siblings = [], siblingIndex = 0 } = data;

  const hasSiblings = siblings.length > 1;
  const canPrev = siblingIndex > 0;
  const canNext = siblingIndex < siblings.length - 1;

  const navigate = (dir) => {
    const next = siblings[siblingIndex + dir];
    if (next) openWindow("imgfile", { ...next, siblings, siblingIndex: siblingIndex + dir });
  };

  const shortName = name?.replace(/\.[^.]+$/, "") ?? "";

  return (
    <div id="imgfile" className="flex flex-col h-full select-none">
      <div id="window-header" className="imgfile-toolbar">
        <WindowControls target="imgfile" />

        {hasSiblings && (
          <div className="flex items-center gap-1 ml-2">
            <button
              className="imgfile-nav-btn"
              disabled={!canPrev}
              onClick={() => navigate(-1)}
              title="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="imgfile-nav-btn"
              disabled={!canNext}
              onClick={() => navigate(1)}
              title="Next"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        <p className="imgfile-title">{shortName}</p>

        <div className="flex items-center gap-1 ml-auto">
          <button
            className="imgfile-tool-btn"
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            title="Zoom in"
          >
            <ZoomIn size={13} />
          </button>
          <button
            className="imgfile-tool-btn"
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.25))}
            title="Zoom out"
          >
            <ZoomOut size={13} />
          </button>
          <button
            className="imgfile-tool-btn"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            title="Rotate"
          >
            <RotateCw size={13} />
          </button>
          {zoom !== 1 && (
            <button
              className="imgfile-tool-btn imgfile-reset-btn"
              onClick={() => { setZoom(1); setRotation(0); }}
              title="Reset"
            >
              {Math.round(zoom * 100)}%
            </button>
          )}
        </div>
      </div>

      <div className="imgfile-canvas">
        {hasSiblings && (
          <>
            <button
              className={`imgfile-arrow imgfile-arrow-left${!canPrev ? " imgfile-arrow-disabled" : ""}`}
              onClick={() => navigate(-1)}
              disabled={!canPrev}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`imgfile-arrow imgfile-arrow-right${!canNext ? " imgfile-arrow-disabled" : ""}`}
              onClick={() => navigate(1)}
              disabled={!canNext}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {imageUrl && (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={name}
            draggable={false}
            className="imgfile-img"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease",
            }}
          />
        )}

        {hasSiblings && (
          <div className="imgfile-strip">
            {siblings.map((s, i) => (
              <button
                key={s.id}
                className={`imgfile-thumb${i === siblingIndex ? " imgfile-thumb-active" : ""}`}
                onClick={() => openWindow("imgfile", { ...s, siblings, siblingIndex: i })}
                title={s.name}
              >
                <img src={s.imageUrl} alt={s.name} draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ImageWindow = WindowWrapper(ImageWindowContent, "imgfile");

export default ImageWindow;
