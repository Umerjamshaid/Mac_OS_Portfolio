import { WindowControls } from "#components";
import { locations } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import useLocationStore from "#store/location";
import useWindowStore from "#store/window";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/all";

const Finder = () => {
  const { openWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
  const contentRef = useRef(null);

  const renderList = (name, items) => (
    <div>
      <h3>{name}</h3>

      <ul>
        {" "}
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveLocation(item)}
            className={clsx(
              item.id === activeLocation?.id ? "active" : "not-active",
            )}
          >
            <img src={item.icon} className="w-4" alt={item.name} />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  const openItem = (item) => {
    if (item.fileType === "pdf") return openWindow("resume");
    if (item.kind === "folder") return setActiveLocation(item);
    if (['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, "_blank");
    openWindow(`${item.fileType}${item.kind}`, item);
  };

  useGSAP(() => {
    if (!contentRef.current) return;
    const items = contentRef.current.querySelectorAll(".finder-item");
    if (items.length === 0) return;

    const draggables = Draggable.create(items, {
      bounds: contentRef.current,
      onPress: function (e) {
        e.stopPropagation();
      },
      onClick: function (e) {
        const itemId = this.target.getAttribute("data-item-id");
        const item = activeLocation?.children?.find((c) => String(c.id) === itemId);
        if (item) {
          openItem(item);
        }
      },
    });

    return () => {
      draggables.forEach((d) => d.kill());
    };
  }, [activeLocation?.children]);

  return (
    <div className="window-header">
      <div id="window-header">
        <WindowControls target="finder" />
        <Search className="icon" />
      </div>

      <div className="bg-white flex h-full">
        <div className="sidebar">
          {renderList("Favorites", Object.values(locations))}
          {renderList("Work", locations.work.children)}
        </div>
        <ul ref={contentRef} className="content">
          {activeLocation?.children?.map((item) => (
            <li
              key={item.id}
              className={clsx("finder-item", item.position)}
              data-item-id={item.id}
            >
              <img src={item.icon} alt={item.name} />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
