const base = import.meta.env.BASE_URL || "/";

export const appsData = [
  {
    id: 1,
    title: "Attendance App",
    summary: "Smart attendance tracking made simple and automated.",
    tags: ["Flutter", "Firebase"],
    screenshot: `${base}Attendance.png`,
    githubUrl: "https://github.com/Umerjamshaid",
    glow: "shadow-blue-500/30",
  },
  {
    id: 2,
    title: "Attendance Log",
    summary: "Detailed attendance statistics and history visualization.",
    tags: ["Flutter", "Charts"],
    screenshot: `${base}Attendance-profile.png`,
    githubUrl: "https://github.com/Umerjamshaid",
    glow: "shadow-violet-500/30",
  },
  {
    id: 3,
    title: "Baby Shop Hub",
    summary: "Mobile e-commerce for parents on the go.",
    tags: ["Flutter", "Dart"],
    screenshot: `${base}images/gal1.png`,
    githubUrl: "https://github.com/Umerjamshaid",
    glow: "shadow-emerald-500/30",
  },
  {
    id: 4,
    title: "Food Delivery App",
    summary: "Order food from your favorite spots in minutes.",
    tags: ["Flutter", "Dart"],
    screenshot: `${base}images/project-3.png`,
    githubUrl: "https://github.com/Umerjamshaid",
    glow: "shadow-rose-500/30",
  },
];

export const packagesData = [
  { id: 1, title: "orient_ui", desc: "Beautiful, ready-to-use UI components for Flutter.", url: "pub.dev/packages/orient_ui", color: "violet" },
  // …
];

export const otherData = [
  { id: 1, title: "Serverpod Console", desc: "Console for Serverpod Cloud.", url: "console.serverpod.dev", color: "cyan" },
  // …
];

export const COLORS = {
  violet:   { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100", dot: "bg-violet-500" },
  sky:      { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-100", dot: "bg-sky-500" },
  amber:    { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100", dot: "bg-amber-500" },
  pink:     { bg: "bg-pink-50", text: "text-pink-600", ring: "ring-pink-100", dot: "bg-pink-500" },
  emerald:  { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100", dot: "bg-emerald-500" },
  indigo:   { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100", dot: "bg-indigo-500" },
  cyan:     { bg: "bg-cyan-50", text: "text-cyan-600", ring: "ring-cyan-100", dot: "bg-cyan-500" },
  fuchsia:  { bg: "bg-fuchsia-50", text: "text-fuchsia-600", ring: "ring-fuchsia-100", dot: "bg-fuchsia-500" },
  rose:     { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100", dot: "bg-rose-500" },
  lime:     { bg: "bg-lime-50", text: "text-lime-600", ring: "ring-lime-100", dot: "bg-lime-500" },
};

export const TAG_COLORS = {
  Flutter:    "bg-sky-100 text-sky-700",
  "Mobile UI": "bg-violet-100 text-violet-700",
  GovTech:    "bg-indigo-100 text-indigo-700",
  Emergency:  "bg-rose-100 text-rose-700",
  Payments:   "bg-amber-100 text-amber-700",
  Logistics:  "bg-orange-100 text-orange-700",
};

export const TABS = ["Apps", "Packages", "Other"];