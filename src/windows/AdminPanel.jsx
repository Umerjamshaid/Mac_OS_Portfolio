import { useState, useEffect, useRef } from "react";
import useAdminStore from "#store/adminData";
import { appsData } from "../constants/data";
import { locations } from "#constants";
import { X, Lock, Save, RotateCcw, Upload, ExternalLink, Smartphone, Folder, ChevronRight } from "lucide-react";

const WORK_LOCATION = locations.work;

const ADMIN_PASSWORD = "admin123"; // change this to whatever you like
const SESSION_KEY = "portfolio_admin_auth";

const toBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const ImageField = ({ label, value, onChange }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(value || "");
  const [urlInput, setUrlInput] = useState(value?.startsWith("data:") ? "" : (value || ""));

  useEffect(() => { setPreview(value || ""); setUrlInput(value?.startsWith("data:") ? "" : (value || "")); }, [value]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await toBase64(file);
    setPreview(b64);
    setUrlInput("");
    onChange(b64);
  };

  const handleUrl = (v) => {
    setUrlInput(v);
    setPreview(v);
    onChange(v);
  };

  return (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      {preview && (
        <div className="ap-img-preview">
          <img src={preview} alt="preview" />
        </div>
      )}
      <div className="ap-img-row">
        <button className="ap-upload-btn" onClick={() => fileRef.current?.click()} type="button">
          <Upload size={12} /> Upload file
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <span className="ap-or">or</span>
        <input
          type="url"
          className="ap-input ap-input-url"
          placeholder="Paste image URL…"
          value={urlInput}
          onChange={(e) => handleUrl(e.target.value)}
        />
      </div>
    </div>
  );
};

const AppEditor = ({ app, onSave, onReset, override }) => {
  const [screenshot, setScreenshot] = useState(override?.screenshot ?? app.screenshot ?? "");
  const [githubUrl, setGithubUrl] = useState(override?.githubUrl ?? app.githubUrl ?? "");
  const [tags, setTags] = useState((override?.tags ?? app.tags ?? []).join(", "));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setScreenshot(override?.screenshot ?? app.screenshot ?? "");
    setGithubUrl(override?.githubUrl ?? app.githubUrl ?? "");
    setTags((override?.tags ?? app.tags ?? []).join(", "));
    setSaved(false);
  }, [app.id, override]);

  const save = () => {
    onSave(app.id, {
      screenshot: screenshot || undefined,
      githubUrl: githubUrl || undefined,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="ap-editor">
      <div className="ap-editor-title">
        <Smartphone size={14} className="text-blue-500" />
        <span>{app.title}</span>
        {override && <span className="ap-override-badge">custom</span>}
      </div>

      <ImageField label="Screenshot / Mockup" value={screenshot} onChange={setScreenshot} />

      <div className="ap-field">
        <label className="ap-label">GitHub URL</label>
        <div className="ap-input-row">
          <input
            type="url"
            className="ap-input"
            placeholder="https://github.com/you/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="ap-link-btn">
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      <div className="ap-field">
        <label className="ap-label">Tech tags <span className="ap-hint">(comma-separated)</span></label>
        <input
          type="text"
          className="ap-input"
          placeholder="Flutter, Dart, Firebase"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="ap-actions">
        <button className={`ap-save-btn${saved ? " ap-save-btn--done" : ""}`} onClick={save} type="button">
          <Save size={13} /> {saved ? "Saved!" : "Save changes"}
        </button>
        {override && (
          <button className="ap-reset-btn" onClick={() => onReset(app.id)} type="button">
            <RotateCcw size={12} /> Reset to default
          </button>
        )}
      </div>
    </div>
  );
};

const urlChildren = (folder) =>
  (folder.children ?? []).filter((c) => c.fileType === "url" || c.fileType === "fig");
const imgChildren = (folder) =>
  (folder.children ?? []).filter((c) => c.fileType === "img");

const FolderEditor = ({ folder, onSaveChild, onResetFolder, folderOverride }) => {
  const initState = () => {
    const s = {};
    [...urlChildren(folder), ...imgChildren(folder)].forEach((c) => {
      const ov = folderOverride?.[c.id];
      s[c.id] = {
        href: ov?.href ?? c.href ?? "",
        imageUrl: ov?.imageUrl ?? c.imageUrl ?? "",
      };
    });
    return s;
  };

  const [fields, setFields] = useState(initState);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setFields(initState()); setSaved(false); }, [folder.id, folderOverride]);

  const setField = (childId, key, val) =>
    setFields((f) => ({ ...f, [childId]: { ...f[childId], [key]: val } }));

  const save = () => {
    Object.entries(fields).forEach(([childId, data]) => {
      const child = (folder.children ?? []).find((c) => String(c.id) === childId);
      if (!child) return;
      if (child.fileType === "img") onSaveChild(folder.id, childId, { imageUrl: data.imageUrl });
      else onSaveChild(folder.id, childId, { href: data.href });
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const urls = urlChildren(folder);
  const imgs = imgChildren(folder);

  return (
    <div className="ap-editor">
      <div className="ap-editor-title">
        <Folder size={14} className="text-yellow-500" />
        <span>{folder.name}</span>
        {folderOverride && Object.keys(folderOverride).length > 0 && (
          <span className="ap-override-badge">custom</span>
        )}
      </div>

      {urls.length > 0 && (
        <div className="ap-section">
          <p className="ap-section-title">Links</p>
          {urls.map((c) => (
            <div key={c.id} className="ap-field">
              <label className="ap-label">{c.name}</label>
              <div className="ap-input-row">
                <input
                  type="url"
                  className="ap-input"
                  placeholder="https://…"
                  value={fields[c.id]?.href ?? ""}
                  onChange={(e) => setField(c.id, "href", e.target.value)}
                />
                {fields[c.id]?.href && (
                  <a href={fields[c.id].href} target="_blank" rel="noreferrer" className="ap-link-btn">
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {imgs.length > 0 && (
        <div className="ap-section">
          <p className="ap-section-title">Images</p>
          {imgs.map((c) => (
            <ImageField
              key={c.id}
              label={c.name}
              value={fields[c.id]?.imageUrl ?? ""}
              onChange={(v) => setField(c.id, "imageUrl", v)}
            />
          ))}
        </div>
      )}

      <div className="ap-actions">
        <button className={`ap-save-btn${saved ? " ap-save-btn--done" : ""}`} onClick={save} type="button">
          <Save size={13} /> {saved ? "Saved!" : "Save changes"}
        </button>
        {folderOverride && Object.keys(folderOverride).length > 0 && (
          <button className="ap-reset-btn" onClick={() => onResetFolder(folder.id)} type="button">
            <RotateCcw size={12} /> Reset to default
          </button>
        )}
      </div>
    </div>
  );
};

const AdminPanel = ({ onClose }) => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState("apps");
  const [selectedApp, setSelectedApp] = useState(appsData[0]?.id ?? null);
  const [selectedFolder, setSelectedFolder] = useState(WORK_LOCATION.children[0]?.id ?? null);

  const { apps, folders, setAppOverride, resetApp, setFolderChildOverride, resetFolder } = useAdminStore();

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 1200);
    }
  };

  if (!authed) {
    return (
      <div className="ap-overlay">
        <div className="ap-gate">
          <div className="ap-gate-icon"><Lock size={22} /></div>
          <h2 className="ap-gate-title">Admin Panel</h2>
          <p className="ap-gate-sub">Private — enter your password to continue</p>
          <form onSubmit={(e) => { e.preventDefault(); login(); }} className="ap-gate-form">
            <input
              type="password"
              className={`ap-gate-input${pwError ? " ap-gate-input--error" : ""}`}
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
            />
            <button type="submit" className="ap-gate-submit">Unlock</button>
          </form>
          <button className="ap-gate-close" onClick={onClose}><X size={14} /></button>
        </div>
      </div>
    );
  }

  const activeApp = appsData.find((a) => a.id === selectedApp);
  const activeFolder = WORK_LOCATION.children.find((f) => f.id === selectedFolder);

  return (
    <div className="ap-overlay">
      <div className="ap-panel">
        <div className="ap-panel-header">
          <span className="ap-panel-title">Admin Panel</span>
          <div className="ap-panel-tabs">
            <button className={`ap-tab${tab === "apps" ? " ap-tab--active" : ""}`} onClick={() => setTab("apps")}>
              <Smartphone size={13} /> Mobile Apps
            </button>
            <button className={`ap-tab${tab === "folders" ? " ap-tab--active" : ""}`} onClick={() => setTab("folders")}>
              <Folder size={13} /> Finder Folders
            </button>
          </div>
          <button className="ap-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="ap-panel-body">
          <div className="ap-sidebar">
            {tab === "apps" && appsData.map((app) => (
              <button
                key={app.id}
                className={`ap-sidebar-item${app.id === selectedApp ? " ap-sidebar-item--active" : ""}`}
                onClick={() => setSelectedApp(app.id)}
              >
                <span className="truncate">{app.title}</span>
                {apps[app.id] && <span className="ap-dot" />}
                <ChevronRight size={12} className="ml-auto opacity-40 flex-shrink-0" />
              </button>
            ))}
            {tab === "folders" && WORK_LOCATION.children.map((folder) => (
              <button
                key={folder.id}
                className={`ap-sidebar-item${folder.id === selectedFolder ? " ap-sidebar-item--active" : ""}`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                <span className="truncate">{folder.name}</span>
                {folders[folder.id] && Object.keys(folders[folder.id]).length > 0 && <span className="ap-dot" />}
                <ChevronRight size={12} className="ml-auto opacity-40 flex-shrink-0" />
              </button>
            ))}
          </div>

          <div className="ap-main">
            {tab === "apps" && activeApp && (
              <AppEditor
                key={activeApp.id}
                app={activeApp}
                override={apps[activeApp.id]}
                onSave={setAppOverride}
                onReset={resetApp}
              />
            )}
            {tab === "folders" && activeFolder && (
              <FolderEditor
                key={activeFolder.id}
                folder={activeFolder}
                folderOverride={folders[activeFolder.id]}
                onSaveChild={setFolderChildOverride}
                onResetFolder={resetFolder}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
