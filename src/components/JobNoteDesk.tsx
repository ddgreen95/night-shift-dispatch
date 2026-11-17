import { useEffect, useState } from "react";
import { SAMPLE_NOTE } from "../data/sampleRoster";
import { summarizeJobNote, type JobNoteSummary } from "../summarizer/summarizeNote";

const VISITOR_KEY = "hollow-pines.night-shift.visitor-key";

function storageWorks(): boolean {
  try {
    const probe = "__hollow_pines_probe__";
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function keyIsStored(): boolean {
  try {
    return Boolean(localStorage.getItem(VISITOR_KEY));
  } catch {
    return false;
  }
}

export function JobNoteDesk() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState<JobNoteSummary | null>(null);
  const [keyDraft, setKeyDraft] = useState("");
  const [keyStored, setKeyStored] = useState(false);
  const [keyMessage, setKeyMessage] = useState("No visitor key is stored.");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    if (!storageWorks()) {
      setKeyMessage("This browser cannot store a key. The local summarizer still works.");
      setKeyStored(false);
      return;
    }
    const stored = keyIsStored();
    setKeyStored(stored);
    setKeyMessage(stored ? "A visitor key is stored in this browser only." : "No visitor key is stored.");
  }, []);

  function runSummary(nextNote = note) {
    setCopyMessage("");
    setResult(summarizeJobNote(nextNote, { visitorKeyStored: keyIsStored() }));
  }

  function saveKey() {
    if (!storageWorks()) {
      setKeyMessage("This browser would not store a key. The local summarizer still works.");
      setKeyStored(false);
      return;
    }
    const trimmed = keyDraft.trim();
    if (!trimmed) {
      setKeyMessage("Type a key if you want it kept in this browser only.");
      return;
    }
    localStorage.setItem(VISITOR_KEY, trimmed);
    setKeyDraft("");
    setKeyStored(true);
    setKeyMessage("Stored in this browser only. It is not copied into the summary, and nothing was sent.");
  }

  function clearKey() {
    try {
      localStorage.removeItem(VISITOR_KEY);
    } catch {
      setKeyMessage("This browser would not clear the key.");
      return;
    }
    setKeyStored(false);
    setKeyDraft("");
    setKeyMessage("Visitor key removed from this browser.");
  }

  async function copyDraft() {
    if (!result?.clientDraft) return;
    try {
      await navigator.clipboard.writeText(result.clientDraft);
      setCopyMessage("Client-safe draft copied. It still needs a person to review it.");
    } catch {
      setCopyMessage("Clipboard was blocked. Select the draft below and copy it by hand.");
    }
  }

  return (
    <section className="panel desk" aria-labelledby="desk-title">
      <div className="panel-head">
        <h2 id="desk-title">Job-note desk</h2>
        <p>Paste a sample on-site note. The local template writes a short summary and a client-safe draft.</p>
      </div>
      <label className="field" htmlFor="job-note">
        On-site note
        <textarea
          id="job-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              runSummary();
            }
          }}
          rows={7}
          spellCheck
          placeholder="Paste a fictional on-site note from the night shift."
        />
      </label>
      <div className="desk-actions">
        <button type="button" className="solid-button" onClick={() => runSummary()}>
          Summarize locally
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            setNote(SAMPLE_NOTE);
            setResult(null);
            setCopyMessage("");
          }}
        >
          Load sample note
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            setNote("");
            setResult(null);
            setCopyMessage("");
          }}
        >
          Clear note
        </button>
      </div>

      {result ? (
        <div className="drafts">
          <article>
            <h3>Summary</h3>
            <p>{result.summary}</p>
          </article>
          <article>
            <h3>Client-safe draft</h3>
            <p className="draft-text">{result.clientDraft || "No draft until there is a note."}</p>
            <button type="button" className="ghost-button" onClick={copyDraft} disabled={!result.clientDraft}>
              Copy draft
            </button>
            {copyMessage ? <p className="hint">{copyMessage}</p> : null}
          </article>
          <p className="notice">{result.notice}</p>
        </div>
      ) : (
        <p className="notice">Nothing is sent, posted, or billed. Summaries stay in this browser.</p>
      )}

      <details className="key-box">
        <summary>Optional visitor key</summary>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            saveKey();
          }}
        >
          <p>
            The template does not need a key. If you save one, it stays in localStorage on this browser and this
            build still does not call out.
          </p>
          <label className="field" htmlFor="visitor-key">
            Visitor key
            <input
              id="visitor-key"
              type="password"
              name="visitor-key"
              autoComplete="off"
              spellCheck={false}
              value={keyDraft}
              onChange={(event) => setKeyDraft(event.target.value)}
              placeholder={keyStored ? "A key is already stored" : "Paste a key to store locally"}
            />
          </label>
          <div className="desk-actions">
            <button type="submit" className="ghost-button">
              Save in this browser
            </button>
            <button type="button" className="ghost-button" onClick={clearKey} disabled={!keyStored && !keyDraft}>
              Clear stored key
            </button>
          </div>
          <p className="hint" role="status">
            {keyMessage}
          </p>
        </form>
      </details>
    </section>
  );
}
