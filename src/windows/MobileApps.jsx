import { useState } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import { appsData, packagesData, otherData, TABS } from "../constants/data";
import AppCard from "../components/AppCard";
import ProjectCard from "../components/ProjectCard";

const WindowHeader = () => (
  <div className="flex items-center gap-3 px-4 py-2.5 bg-white/50 backdrop-blur-md border-b border-gray-200/80 flex-shrink-0">
    <WindowControls target="mobileapps" />
    <div className="flex-1 text-center">
      <span className="text-xs font-semibold text-gray-600">Mobile Projects</span>
    </div>
  </div>
);

const TabBar = ({ activeTab, onTabChange }) => (
  <div className="flex justify-center w-full pt-4 pb-4 flex-shrink-0">
    <div role="tablist" className="flex gap-1 bg-gray-100/80 backdrop-blur-md p-1 rounded-xl border border-black/5 shadow-sm">
      {TABS.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onTabChange(tab)}
          className={`relative px-6 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ease-out ${
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

const MobileApps = () => {
  const [activeTab, setActiveTab] = useState("Apps");

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 select-none">
      <WindowHeader />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-grow overflow-hidden min-h-0 relative flex flex-col">
          {activeTab === "Apps" && (
            <div className="flex-1 flex items-center justify-start overflow-x-auto gap-6 px-8 py-4 scrollbar-hide snap-x">
              {appsData.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}

          {activeTab === "Packages" && (
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packagesData.map((pkg) => (
                  <ProjectCard key={pkg.id} item={pkg} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "Other" && (
            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherData.map((item) => (
                  <ProjectCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WindowWrapper(MobileApps, "mobileapps");