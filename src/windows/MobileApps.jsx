import { useState } from "react";
import { WindowControls } from "#components";
import { MOBILE_APPS } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import { Smartphone, Github, CheckCircle2 } from "lucide-react";

const MobileApps = () => {
  const [activeId, setActiveId] = useState(MOBILE_APPS[0]?.id);
  const app = MOBILE_APPS.find((a) => a.id === activeId) ?? MOBILE_APPS[0];

  return (
    <div id="mobileapps">
      <div id="window-header">
        <WindowControls target="mobileapps" />
        <div className="flex items-center gap-2 mx-auto text-sm font-semibold text-gray-600 select-none">
          <Smartphone size={14} className="text-gray-400" />
          <span>Mobile Projects</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-41px)] min-w-0">
        <nav className="ma-sidebar p-2">
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Flutter Apps
          </p>
          {MOBILE_APPS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`ma-sidebar-item${item.id === activeId ? " ma-sidebar-item--active" : ""}`}
              onClick={() => setActiveId(item.id)}
            >
              <Smartphone size={15} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="ma-detail p-6">
          {app && (
            <div className="ma-split">
              <div className="ma-info-col flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="ma-status-chip">
                    <CheckCircle2 size={12} />
                    {app.status}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-800 leading-tight break-words">
                  {app.name}
                </h2>
                <p className="text-sm text-gray-500 break-words">{app.tagline}</p>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  {app.stack.map((tag) => (
                    <span key={tag} className="ma-chip">{tag}</span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mt-2 text-sm text-gray-600 leading-relaxed">
                  {app.description.map((para, i) => (
                    <p key={i} className="break-words">{para}</p>
                  ))}
                </div>

                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ma-github-badge mt-3 w-fit"
                >
                  <Github size={15} className="flex-shrink-0" />
                  <span>View on GitHub</span>
                </a>
              </div>

              <div className="ma-phone-col">
                <div className="ma-phone-frame">
                  <div className="ma-phone-notch" />
                  <div className="ma-phone-screen">
                    <img
                      src={app.screenshot}
                      alt={`${app.name} screenshot`}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindowWrapper(MobileApps, "mobileapps");
