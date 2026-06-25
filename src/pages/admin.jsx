import React, { useState, useEffect, useCallback } from "react";

/* ---------------- helpers ---------------- */

// Immutable set at a nested path
function setIn(obj, path, value) {
  const keys = Array.isArray(path) ? path : String(path).split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  let cur = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : { ...(next || {}) };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return root;
}

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => reject(new Error("Citirea fișierului a eșuat"));
    fr.readAsDataURL(file);
  });

const jsonReq = (path, opts = {}) =>
  fetch(path, { headers: { "Content-Type": "application/json" }, ...opts });

/* ---------------- field components ---------------- */

const Field = ({ label, value, onChange, textarea, rows, type = "text", placeholder, hint, full }) => (
  <div className={`admin-field${full ? " admin-field--full" : ""}`}>
    <label>{label}</label>
    {textarea ? (
      <textarea
        className="admin-input"
        rows={rows || 4}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input
        className="admin-input"
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
    {hint && <span className="admin-hint">{hint}</span>}
  </div>
);

const ImageField = ({ label, value, onChange }) => {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const dataUrl = await readAsDataURL(file);
      const key = file.name || `img-${Date.now()}`;
      const r = await jsonReq("/api/upload", {
        method: "POST",
        body: JSON.stringify({ key, type: file.type, dataBase64: dataUrl }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Încărcare eșuată");
      onChange(j.url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-field admin-field--full">
      <label>{label}</label>
      <div className="admin-image-row">
        {value ? (
          <img className="admin-thumb" src={value} alt="" />
        ) : (
          <div className="admin-thumb admin-thumb--empty">fără imagine</div>
        )}
        <div>
          <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
          {busy && <span className="admin-hint">Se încarcă…</span>}
          {err && <span className="admin-error">{err}</span>}
          <input
            className="admin-input"
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL imagine (ex: /api/images/…)"
          />
        </div>
      </div>
    </div>
  );
};

/* ---------------- login ---------------- */

const Login = ({ onSuccess }) => {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await jsonReq("/api/login", {
        method: "POST",
        body: JSON.stringify({ username: u, password: p }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Autentificare eșuată");
      onSuccess();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <h1>Administrare</h1>
        <p>Autentifică-te pentru a edita conținutul site-ului.</p>
        <Field label="Utilizator" value={u} onChange={setU} full />
        <Field label="Parolă" value={p} onChange={setP} type="password" full />
        {err && <p className="admin-error" style={{ marginBottom: "1rem" }}>{err}</p>}
        <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: "100%" }}>
          {busy ? "Se autentifică…" : "Intră"}
        </button>
      </form>
    </div>
  );
};

/* ---------------- editor ---------------- */

const Editor = ({ onLogout }) => {
  const [doc, setDoc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    jsonReq("/api/content")
      .then((r) => r.json())
      .then(setDoc)
      .catch(() => setMsg("Nu am putut încărca conținutul"));
  }, []);

  const update = useCallback((path, value) => {
    setDoc((d) => setIn(d, path, value));
    setMsg("");
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const r = await jsonReq("/api/content", { method: "PUT", body: JSON.stringify(doc) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Salvare eșuată");
      setMsg("Salvat ✓");
    } catch (ex) {
      setMsg(ex.message);
    } finally {
      setSaving(false);
    }
  };

  if (!doc) {
    return (
      <div className="admin">
        <div className="container" style={{ padding: "4rem 0" }}>{msg || "Se încarcă…"}</div>
      </div>
    );
  }

  const departments = doc.Departments || [];

  const addDepartment = () =>
    setDoc((d) => ({ ...d, Departments: [...(d.Departments || []), { name: "", text: "", content: "", image: "" }] }));
  const removeDepartment = (i) =>
    setDoc((d) => ({ ...d, Departments: (d.Departments || []).filter((_, idx) => idx !== i) }));

  return (
    <div className="admin">
      <div className="admin-bar">
        <div className="container admin-bar__inner">
          <h1>Administrare conținut</h1>
          {msg && <span className="admin-status">{msg}</span>}
          <div className="admin-actions">
            <a className="btn btn--ghost" href="/" target="_blank" rel="noreferrer">Vezi site-ul</a>
            <button className="btn btn--primary" onClick={save} disabled={saving}>
              {saving ? "Se salvează…" : "Salvează"}
            </button>
            <button className="btn btn--ghost" onClick={onLogout}>Ieși</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* HERO */}
        <section className="admin-section">
          <h2>Secțiunea principală (Hero)</h2>
          <Field label="Titlu" value={doc.Header?.title} onChange={(v) => update(["Header", "title"], v)} full />
          <Field label="Paragraf" value={doc.Header?.paragraph} onChange={(v) => update(["Header", "paragraph"], v)} textarea full />
        </section>

        {/* WARNING */}
        <section className="admin-section">
          <h2>Anunț (bară de sus)</h2>
          <Field
            label="Mesaj anunț"
            value={doc.Warning?.message}
            onChange={(v) => update(["Warning", "message"], v)}
            placeholder="Lasă gol pentru a ascunde bara"
            hint="Dacă e gol, bara de anunț nu apare. Acceptă HTML simplu."
            full
          />
        </section>

        {/* ABOUT */}
        <section className="admin-section">
          <h2>Despre noi</h2>
          <Field label="Paragraf (pagina principală)" value={doc.About?.paragraph} onChange={(v) => update(["About", "paragraph"], v)} textarea rows={5} full />
          <Field label="Titlu pagina „Despre noi”" value={doc.About?.aboutPage?.title} onChange={(v) => update(["About", "aboutPage", "title"], v)} full />
          <Field label="Conținut pagina „Despre noi” (HTML)" value={doc.About?.aboutPage?.content} onChange={(v) => update(["About", "aboutPage", "content"], v)} textarea rows={10} hint="Conținut HTML al paginii Despre noi." full />
        </section>

        {/* DEPARTMENTS */}
        <section className="admin-section">
          <h2>Departamente</h2>
          {departments.map((d, i) => (
            <div className="admin-dept" key={i}>
              <div className="admin-dept__head">
                <h3>{d.name || `Departament ${i + 1}`}</h3>
                <button className="admin-remove" onClick={() => removeDepartment(i)}>Șterge</button>
              </div>
              <ImageField label="Imagine" value={d.image} onChange={(v) => update(["Departments", i, "image"], v)} />
              <div className="admin-grid">
                <Field label="Nume" value={d.name} onChange={(v) => update(["Departments", i, "name"], v)} />
                <Field label="Text scurt (pe card)" value={d.text} onChange={(v) => update(["Departments", i, "text"], v)} />
              </div>
              <Field label="Descriere completă (HTML)" value={d.content} onChange={(v) => update(["Departments", i, "content"], v)} textarea rows={5} full />
            </div>
          ))}
          <button className="btn btn--ghost" onClick={addDepartment}>+ Adaugă departament</button>
        </section>

        {/* CONTACT */}
        <section className="admin-section">
          <h2>Contact</h2>
          <div className="admin-grid">
            <Field label="Adresă" value={doc.Contact?.address} onChange={(v) => update(["Contact", "address"], v)} />
            <Field label="Link Google Maps" value={doc.Contact?.gmaps} onChange={(v) => update(["Contact", "gmaps"], v)} />
            <Field label="Telefon" value={doc.Contact?.phone} onChange={(v) => update(["Contact", "phone"], v)} />
            <Field label="Email" value={doc.Contact?.email} onChange={(v) => update(["Contact", "email"], v)} />
            <Field label="Facebook" value={doc.Contact?.facebook} onChange={(v) => update(["Contact", "facebook"], v)} />
            <Field label="YouTube" value={doc.Contact?.youtube} onChange={(v) => update(["Contact", "youtube"], v)} />
          </div>

          <h3 style={{ margin: "1.5rem 0 0.75rem", fontSize: "1rem" }}>Donații</h3>
          <div className="admin-grid">
            <Field label="Nume cont" value={doc.Contact?.donations?.name} onChange={(v) => update(["Contact", "donations", "name"], v)} />
            <Field label="Bancă" value={doc.Contact?.donations?.bank} onChange={(v) => update(["Contact", "donations", "bank"], v)} />
            <Field label="SWIFT" value={doc.Contact?.donations?.swift} onChange={(v) => update(["Contact", "donations", "swift"], v)} />
            <Field label="IBAN RON" value={doc.Contact?.donations?.ron} onChange={(v) => update(["Contact", "donations", "ron"], v)} />
            <Field label="IBAN EUR" value={doc.Contact?.donations?.eur} onChange={(v) => update(["Contact", "donations", "eur"], v)} />
            <Field label="IBAN USD" value={doc.Contact?.donations?.usd} onChange={(v) => update(["Contact", "donations", "usd"], v)} />
          </div>
        </section>

        <div style={{ margin: "2rem 0" }}>
          <button className="btn btn--primary" onClick={save} disabled={saving}>
            {saving ? "Se salvează…" : "Salvează modificările"}
          </button>
          {msg && <span className="admin-status" style={{ marginLeft: "1rem" }}>{msg}</span>}
        </div>
      </div>
    </div>
  );
};

/* ---------------- page ---------------- */

export const AdminPage = () => {
  const [auth, setAuth] = useState(null); // null = checking

  useEffect(() => {
    jsonReq("/api/me")
      .then((r) => r.json())
      .then((j) => setAuth(!!j.authenticated))
      .catch(() => setAuth(false));
  }, []);

  const logout = async () => {
    try { await jsonReq("/api/logout", { method: "POST" }); } catch (e) {}
    setAuth(false);
  };

  if (auth === null) {
    return <div className="admin-login"><p>Se verifică sesiunea…</p></div>;
  }
  if (!auth) {
    return <Login onSuccess={() => setAuth(true)} />;
  }
  return <Editor onLogout={logout} />;
};
