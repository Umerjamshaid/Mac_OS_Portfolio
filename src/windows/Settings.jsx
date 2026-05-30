import { useState } from "react";
import { WindowControls } from "#components";
import WindowWrapper from "#hoc/WindowWrapper";
import useDesktopStore from "#store/desktop";
import { WALLPAPERS, socials } from "#constants";
import {
  User, Image, Monitor, SlidersHorizontal,
  Github, Linkedin, Twitter, Globe, Check,
  Cpu, HardDrive, MemoryStick, Layers,
} from "lucide-react";

const base = import.meta.env.BASE_URL;

const SIDEBAR = [
  { id: "profile",   label: "Profile",        Icon: User               },
  { id: "wallpaper", label: "Wallpaper",       Icon: Image              },
  { id: "about",     label: "About This Mac",  Icon: Monitor            },
  { id: "general",   label: "General",         Icon: SlidersHorizontal  },
];

const SOCIAL_ICONS = { Github, Linkedin, Twitter, Globe };

const AboutSpec = ({ Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon size={15} className="text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{value}</p>
    </div>
  </div>
);

const GeneralToggle = ({ label, description, value, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${value ? "bg-blue-500" : "bg-gray-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${value ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  </div>
);

const ProfileSection = () => (
  <div className="p-8 flex flex-col gap-6">
    <div className="flex items-center gap-5">
      <img
        src={`${base}images/umer.jpg`}
        alt="Umer Jamshaid"
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-md"
      />
      <div>
        <h2 className="text-xl font-bold text-gray-800">Umer Jamshaid</h2>
        <p className="text-sm text-blue-500 font-medium mt-0.5">Full Stack Developer</p>
        <p className="text-xs text-gray-400 mt-1">Portfolio · Pakistan</p>
      </div>
    </div>

    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</p>
      <p className="text-sm text-gray-600 leading-relaxed">
        Passionate developer building sleek, interactive web experiences. Specialising in React, TypeScript,
        and Node.js — obsessed with clean UI and buttery-smooth animations.
      </p>
    </div>

    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Social Links</p>
      <div className="flex flex-col gap-2">
        {[
          { label: "GitHub",    href: "https://github.com",   Icon: Github,   color: "#24292e" },
          { label: "LinkedIn",  href: "https://linkedin.com", Icon: Linkedin, color: "#0077b5" },
          { label: "Twitter/X", href: "https://x.com",        Icon: Twitter,  color: "#1da1f2" },
          { label: "Platform",  href: "https://jsmastery.com",Icon: Globe,    color: "#10b981" },
        ].map(({ label, href, Icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: color + "18" }}>
              <Icon size={14} style={{ color }} />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-800">{label}</span>
          </a>
        ))}
      </div>
    </div>

    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">At a Glance</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: "3+",  label: "Years Coding" },
          { value: "15+", label: "Projects" },
          { value: "100%", label: "Dedication" },
        ].map(({ value, label }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-800">{value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const WallpaperSection = () => {
  const { activeWallpaperId, setWallpaper } = useDesktopStore();
  return (
    <div className="p-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Choose Wallpaper</p>
      <div className="grid grid-cols-2 gap-4">
        {WALLPAPERS.map((wp) => {
          const active = wp.id === activeWallpaperId;
          return (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              className={`relative rounded-xl overflow-hidden aspect-video group transition-all ${
                active ? "ring-2 ring-blue-500 ring-offset-2" : "ring-1 ring-gray-200 hover:ring-gray-300"
              }`}
            >
              <img src={wp.src} alt={wp.label} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors`} />
              {active && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
              )}
              <p className="absolute bottom-0 inset-x-0 text-[10px] font-medium text-white/90 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 truncate">
                {wp.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AboutSection = () => (
  <div className="p-8">
    <div className="flex items-center gap-4 mb-6">
      <img src={`${base}images/logo.svg`} alt="logo" className="w-14 h-14 opacity-80" />
      <div>
        <h3 className="text-base font-bold text-gray-800">Portfolio Machine Pro</h3>
        <p className="text-sm text-gray-400">2025 — Built with React 19 + Vite</p>
      </div>
    </div>

    <div className="bg-gray-50 rounded-2xl px-4 py-2 divide-y divide-gray-100">
      <AboutSpec Icon={Cpu}          label="Processor"  value="React 19 · TypeScript · Node.js"       />
      <AboutSpec Icon={MemoryStick}  label="Memory"     value="3 Years of Frontend Experience"        />
      <AboutSpec Icon={HardDrive}    label="Storage"    value="15+ Projects · Unlimited Ideas"         />
      <AboutSpec Icon={Layers}       label="Display"    value="Tailwind CSS · GSAP · Pixel Perfect"   />
      <AboutSpec Icon={Monitor}      label="Graphics"   value="GSAP 3 · Framer Motion · Three.js"     />
    </div>

    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
      <p className="text-xs text-blue-500 font-semibold mb-1">Portfolio Version</p>
      <p className="text-sm text-blue-700">macOS-Style Portfolio · v2.0 · May 2025</p>
      <p className="text-xs text-blue-400 mt-1">Vite 8 · Tailwind 4 · Zustand 5</p>
    </div>
  </div>
);

const GeneralSection = () => {
  const [toggles, setToggles] = useState({
    animations: true,
    welcomeText: true,
    dockMagnify: true,
    soundEffects: false,
  });
  const toggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div className="p-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Appearance</p>
      <div className="bg-gray-50 rounded-2xl px-4 py-1 mb-6">
        <GeneralToggle label="Enable Animations"  description="GSAP spring & fade transitions"  value={toggles.animations}   onChange={() => toggle("animations")}   />
        <GeneralToggle label="Welcome Text"        description="Show hero text on desktop"        value={toggles.welcomeText}  onChange={() => toggle("welcomeText")}  />
        <GeneralToggle label="Dock Magnification"  description="Hover magnify effect on dock"     value={toggles.dockMagnify}  onChange={() => toggle("dockMagnify")}  />
        <GeneralToggle label="Sound Effects"       description="Play UI interaction sounds"       value={toggles.soundEffects} onChange={() => toggle("soundEffects")} />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Language & Region</p>
      <div className="bg-gray-50 rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Language</p>
          <span className="text-sm text-gray-400">English (UK)</span>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700">Time Zone</p>
          <span className="text-sm text-gray-400">PKT (UTC+5)</span>
        </div>
      </div>
    </div>
  );
};

const SECTION_CONTENT = {
  profile:   <ProfileSection />,
  wallpaper: <WallpaperSection />,
  about:     <AboutSection />,
  general:   <GeneralSection />,
};

const Settings = () => {
  const [active, setActive] = useState("profile");

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div id="window-header">
        <WindowControls target="settings" />
        <p className="flex-1 text-center text-xs font-semibold text-gray-500">System Settings</p>
        <div className="w-16" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 bg-gray-50 border-r border-gray-200 py-3 px-2 overflow-y-auto">
          {SIDEBAR.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                active === id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={15} className={active === id ? "text-blue-600" : "text-gray-400"} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {SECTION_CONTENT[active]}
        </div>
      </div>
    </div>
  );
};

const SettingsWindow = WindowWrapper(Settings, "settings");
export default SettingsWindow;
