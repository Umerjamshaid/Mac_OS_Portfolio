import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import useWindowStore from "#store/window";
import useDesktopStore from "#store/desktop";

// Check if desktop is locked

const base = import.meta.env.BASE_URL;

const SPOTLIGHT_ITEMS = [
  {
    group: "Apps",
    items: [
      { id: "finder",   label: "Portfolio",  subtitle: "Browse projects & files",    icon: `${base}images/finder.png`,   windowKey: "finder" },
      { id: "safari",   label: "Articles",   subtitle: "Read blog posts & articles", icon: `${base}images/safari.png`,   windowKey: "safari" },
      { id: "terminal", label: "Skills",     subtitle: "Tech stack & skills",        icon: `${base}images/terminal.png`, windowKey: "terminal" },
      { id: "contact",  label: "Contact",    subtitle: "Get in touch",               icon: `${base}images/contact.png`,  windowKey: "contact" },
      { id: "resume",   label: "Resume",     subtitle: "View resume PDF",            icon: `${base}images/pdf.png`,      windowKey: "resume" },
      { id: "photos",   label: "Gallery",    subtitle: "Photos & screenshots",       icon: `${base}images/photos.png`,   windowKey: "photos" },
    ],
  },
  {
    group: "Projects",
    items: [
      { id: "proj1", label: "Nike Ecommerce Website", subtitle: "Next.js · Tailwind CSS", icon: `${base}images/folder.png`, windowKey: "finder" },
      { id: "proj2", label: "AI Resume Analyzer",     subtitle: "React · AI / ML",        icon: `${base}images/folder.png`, windowKey: "finder" },
      { id: "proj3", label: "Food Delivery App",      subtitle: "React Native · API",      icon: `${base}images/folder.png`, windowKey: "finder" },
    ],
  },
];

const Spotlight = () => {
  const { isSpotlightOpen, openSpotlight, closeSpotlight } = useDesktopStore();
  const { isLocked, openWindow } = useWindowStore();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  const filteredGroups = (() => {
    if (!query.trim()) return SPOTLIGHT_ITEMS;
    const q = query.toLowerCase();
    return SPOTLIGHT_ITEMS
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.subtitle.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  })();

  const flatFiltered = filteredGroups.flatMap((g) => g.items);

  const handleClose = useCallback(() => {
    closeSpotlight();
    setQuery("");
    setCursor(0);
  }, [closeSpotlight]);

  const handleSelect = useCallback(
    (item) => {
      openWindow(item.windowKey);
      handleClose();
    },
    [openWindow, handleClose],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't allow spotlight when desktop is locked
      if (isLocked) return;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isSpotlightOpen) handleClose();
        else openSpotlight();
        return;
      }

      if (!isSpotlightOpen) return;

      if (e.key === "Escape") { e.preventDefault(); handleClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, flatFiltered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); const item = flatFiltered[cursor]; if (item) handleSelect(item); }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocked, isSpotlightOpen, cursor, flatFiltered, openSpotlight, handleClose, handleSelect]);

  useEffect(() => {
    if (isSpotlightOpen) setTimeout(() => inputRef.current?.focus(), 20);
  }, [isSpotlightOpen]);

  useEffect(() => { setCursor(0); }, [query]);

  if (!isSpotlightOpen) return null;

  return (
    <div className="spotlight-backdrop" onClick={handleClose}>
      <div className="spotlight-panel" onClick={(e) => e.stopPropagation()}>
        <div className="spotlight-search-bar">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Spotlight Search"
            className="spotlight-input"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          )}
        </div>

        {flatFiltered.length > 0 ? (
          <div className="spotlight-results">
            {filteredGroups.map((group) => (
              <div key={group.group}>
                <p className="spotlight-group-label">{group.group}</p>
                {group.items.map((item) => {
                  const globalIdx = flatFiltered.findIndex((f) => f.id === item.id);
                  const isActive = globalIdx === cursor;
                  return (
                    <button
                      key={item.id}
                      className={`spotlight-item ${isActive ? "spotlight-item-active" : ""}`}
                      onMouseEnter={() => setCursor(globalIdx)}
                      onClick={() => handleSelect(item)}
                    >
                      <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-gray-800"}`}>{item.label}</p>
                        <p className={`text-xs truncate ${isActive ? "text-white/70" : "text-gray-400"}`}>{item.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</p>
          </div>
        )}

        <div className="spotlight-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default Spotlight;
