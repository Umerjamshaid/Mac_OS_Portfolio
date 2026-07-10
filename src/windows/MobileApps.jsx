import { useState } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { appsData, packagesData, otherData, TABS } from "../constants/data";
import AppCard from "../components/AppCard";
import ProjectCard from "../components/ProjectCard";

const base = import.meta.env.BASE_URL || "/";

const SegmentedControl = ({ activeTab, onTabChange }) => (
  <div className="ma-segmented" role="tablist" aria-label="Project categories">
    {TABS.map((tab) => (
      <button
        key={tab}
        role="tab"
        aria-selected={activeTab === tab}
        onClick={() => onTabChange(tab)}
        className={`ma-segmented__btn ${activeTab === tab ? "ma-segmented__btn--active" : ""}`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const MobileApps = () => {
  const [activeTab, setActiveTab] = useState("Apps");

  return (
    <div className="ma-window">
      <div id="window-header">
        <WindowControls target="mobileapps" />
        <p className="flex-1 text-center text-xs font-semibold text-gray-500">Mobile Apps</p>
        <div className="ma-header-badge" title="Built with Flutter">
          <img
            src={`${base}images/icons8-flutter-logo-48.png`}
            alt=""
            draggable={false}
          />
        </div>
      </div>

      <div className="ma-toolbar">
        <SegmentedControl activeTab={activeTab} onTabChange={setActiveTab} />
        <span className="ma-toolbar__meta">
          {activeTab === "Apps" ? `${appsData.length} Flutter apps` : activeTab}
        </span>
      </div>

      <main className="ma-window__body">
        {activeTab === "Apps" && (
          <div className="ma-apps-row scrollbar-hide">
            {appsData.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}

        {activeTab === "Packages" && (
          <div className="ma-grid-scroll">
            <div className="ma-grid">
              {packagesData.map((pkg) => (
                <ProjectCard key={pkg.id} item={pkg} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Other" && (
          <div className="ma-grid-scroll">
            <div className="ma-grid">
              {otherData.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WindowWrapper(MobileApps, "mobileapps");
