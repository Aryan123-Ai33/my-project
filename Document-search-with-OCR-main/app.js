// === React + Utility Functions ===
const { useState, useEffect } = React;

/* ---------- Theme Hook ---------- */
function useTheme() {
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, setDark];
}

/* ---------- Text Highlight Utility ---------- */
function highlightText(text, query, activeIndex) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  let i = -1;
  return text.split(regex).map((part, idx) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      i++;
      return (
        <mark key={idx} className={i === activeIndex ? "active" : ""}>
          {part}
        </mark>
      );
    }
    return part;
  });
}

/* ---------- File Parsing Helpers ---------- */
// ✅ Reliable PDF parser using pdf.js worker
async function parsePDF(arrayBuffer) {
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
  } else {
    throw new Error("pdfjsLib not found (pdf.js not loaded).");
  }

  const uint8 = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8 });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let p = 1; p <= pdf.numPages; ++p) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items.map((itm) => itm.str).join(" ");
    fullText += `\n--- Page ${p} ---\n` + pageText + "\n\n";
  }
  return fullText;
}

// ✅ DOCX text extractor
async function parseDOCX(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// ✅ XLS / XLSX text extractor
async function parseXLS(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  let text = "";
  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    text += `\n--- Sheet: ${sheetName} ---\n`;
    text += XLSX.utils.sheet_to_csv(sheet) + "\n";
  });
  return text;
}

// ✅ Enhanced PowerPoint parser (titles, texts, notes)
async function parsePPT(arrayBuffer) {
  try {
    const data = await window.Pptx2Json.parse(arrayBuffer);
    let allText = "";

    data.slides.forEach((slide, index) => {
      allText += `\n--- Slide ${index + 1} ---\n`;

      if (slide.title) allText += `Title: ${slide.title}\n`;
      if (slide.texts && slide.texts.length)
        allText += slide.texts.join("\n") + "\n";
      if (slide.notes && slide.notes.length)
        allText += "Notes:\n" + slide.notes.join("\n") + "\n";
    });

    if (!allText.trim()) {
      allText = "No readable text found in this presentation.";
    }
    return allText;
  } catch (err) {
    console.error("PPT parse error:", err);
    return "Unable to extract PowerPoint text. Please check file format.";
  }
}

// === Main App Component ===
function QuickReadApp() {
  const [dark, setDark] = useTheme();
  const [activeTab, setActiveTab] = useState("home");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchIndex, setMatchIndex] = useState(0);

  /* ---------- File Upload ---------- */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const buf = ev.target.result;
        let content = "";
        if (["txt", "csv"].includes(ext))
          content = new TextDecoder("utf-8").decode(buf);
        else if (ext === "pdf") content = await parsePDF(buf);
        else if (["doc", "docx"].includes(ext)) content = await parseDOCX(buf);
        else if (["xls", "xlsx"].includes(ext)) content = await parseXLS(buf);
        else if (["ppt", "pptx"].includes(ext)) content = await parsePPT(buf);
        else {
          alert("Unsupported file type.");
          return;
        }
        const newFile = { name: file.name, content };
        setFiles((prev) => {
          const updated = [...prev, newFile];
          localStorage.setItem("recentUploads", JSON.stringify(updated));
          return updated;
        });
        setSelectedFile(newFile);
        setFileText(content);
        setSearchQuery("");
      } catch (err) {
        alert("Error reading file.");
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  /* ---------- Reset Viewer ---------- */
  const resetViewer = () => {
    setSelectedFile(null);
    setFileText("");
    setSearchQuery("");
    setMatches([]);
    setMatchIndex(0);
  };

  /* ---------- Load Recent on Mount ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("recentUploads");
    if (saved) setFiles(JSON.parse(saved));
  }, []);

  /* ---------- Search Handling ---------- */
  useEffect(() => {
    if (!searchQuery) {
      setMatches([]);
      setMatchIndex(0);
      return;
    }
    const regex = new RegExp(searchQuery, "gi");
    const found = [...fileText.matchAll(regex)].map((m) => m.index);
    setMatches(found);
    setMatchIndex(0);
  }, [searchQuery, fileText]);

  const nextMatch = () => {
    if (matches.length === 0) return;
    setMatchIndex((i) => (i + 1) % matches.length);
  };
  const prevMatch = () => {
    if (matches.length === 0) return;
    setMatchIndex((i) => (i - 1 + matches.length) % matches.length);
  };

  useEffect(() => {
    const el = document.querySelector("mark.active");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [matchIndex]);

  /* ---------- Tab Content ---------- */
  const renderHome = () => (
    <div className="workspace">
      <div className="panel">
        <h3>Recent Uploads</h3>
        <div className="recent-list">
          {files.length === 0 ? (
            <p className="muted">No uploads yet — load a document.</p>
          ) : (
            files.map((f, i) => (
              <div
                key={i}
                className="recent-item"
                onClick={() => {
                  setSelectedFile(f);
                  setFileText(f.content);
                  setSearchQuery("");
                }}
              >
                <span>{f.name}</span>
              </div>
            ))
          )}
        </div>
        <br />
        <h3>Actions</h3>
        <button className="btn primary" onClick={() => localStorage.clear()}>
          Clear Recent
        </button>
        <button className="btn ghost" onClick={resetViewer}>
          Reset Viewer
        </button>
      </div>

      <div className="card">
        <div className="hero">
          <h2>Welcome to Quick Read</h2>
          <p>Upload, read, and instantly search any document.</p>
        </div>

        <div className="upload-box">
          <div className="upload-cta">Drag & Drop or Click to Upload</div>
          <p className="muted">Supported: .txt • .docx • .pdf • .xlsx • .pptx</p>
          <input
            type="file"
            onChange={handleFileUpload}
            style={{ marginTop: "10px" }}
          />
        </div>

        <div className="search-row">
          <input
            type="text"
            placeholder="Search inside this document…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {matches.length > 0 && (
            <div className="inline-arrows">
              <button className="arrow" onClick={prevMatch}>↑</button>
              <button className="arrow" onClick={nextMatch}>↓</button>
              <span className="muted">{matchIndex + 1}/{matches.length}</span>
            </div>
          )}
        </div>

        <div className="file-viewer">
          {selectedFile ? (
            <>{highlightText(fileText, searchQuery, matchIndex)}</>
          ) : (
            <p className="muted">
              No document loaded — upload a file to begin.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="card" style={{ margin: "24px" }}>
      <div className="hero">
        <h2>About Quick Read</h2>
        <p>
          <strong>Quick Read v7.5</strong> is an AI-ready, multi-format document
          reader designed for rapid keyword search and organization.
        </p>
      </div>
      <p style={{ lineHeight: 1.6 }}>
        It supports <b>.txt</b>, <b>.csv</b>, <b>.pdf</b>, <b>.docx</b>, <b>.xlsx</b>,
        and <b>.pptx</b> files, allowing you to drag, drop, and read instantly.  
        Switch between light and dark modes for comfort and efficiency.
      </p>
    </div>
  );

  const renderHelp = () => (
    <div className="card" style={{ margin: "24px" }}>
      <div className="hero">
        <h2>Help & Support</h2>
        <p>Common questions and tips for using Quick Read.</p>
      </div>
      <ul style={{ lineHeight: 1.7, marginLeft: "20px" }}>
        <li>📂 Use the “Choose File” button or drag and drop to upload.</li>
        <li>🔍 Type in the search box to highlight matching words.</li>
        <li>⬆⬇ Use the arrow buttons to jump through matches.</li>
        <li>🌗 Toggle the theme icon to switch light/dark mode.</li>
        <li>🧹 Use “Reset Viewer” to clear the current file.</li>
      </ul>
    </div>
  );

  // === Header, Navigation & Footer ===
  const renderNav = () => (
    <header>
      <div className="brand">
        <div className="logo">QR</div>
        <div>
          <h1>Quick Read</h1>
          <span className="tagline">Universal Document Reader</span>
        </div>
      </div>

      <nav className="links">
        <a
          href="#"
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          Home
        </a>
        <a
          href="#"
          className={activeTab === "about" ? "active" : ""}
          onClick={() => setActiveTab("about")}
        >
          About
        </a>
        <a
          href="#"
          className={activeTab === "help" ? "active" : ""}
          onClick={() => setActiveTab("help")}
        >
          Help
        </a>
      </nav>

      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={() => setDark(!dark)}
          title="Toggle theme"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer>
      © 2025 Quick Read — Designed with 💙 for clarity and speed
    </footer>
  );

  /* ---------- Render Tabs ---------- */
  return (
    <>
      {renderNav()}
      {activeTab === "home" && renderHome()}
      {activeTab === "about" && renderAbout()}
      {activeTab === "help" && renderHelp()}
      {renderFooter()}
    </>
  );
}

// === Final Render Mount ===
ReactDOM.createRoot(document.getElementById("root")).render(<QuickReadApp />);
