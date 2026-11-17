import { useEffect, useMemo, useState } from "react";
import { DispatchBoard } from "./components/DispatchBoard";
import { JobNoteDesk } from "./components/JobNoteDesk";
import { NightCity } from "./components/NightCity";
import { SAMPLE_BEATS, rosterForBeat } from "./data/sampleRoster";

export function App() {
  const [selectedId, setSelectedId] = useState<string | null>("night-dispatcher");
  const [beatIndex, setBeatIndex] = useState(0);
  const beat = SAMPLE_BEATS[beatIndex] ?? SAMPLE_BEATS[0];
  const departments = useMemo(() => rosterForBeat(beat), [beat]);

  useEffect(() => {
    if (!selectedId) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`dept-${selectedId}`)?.scrollIntoView({
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [selectedId, beatIndex]);

  return (
    <div className="sky">
      <header className="mast">
        <div>
          <p className="eyebrow">Hollow Pines Home Repair</p>
          <h1>Night-Shift Dispatch</h1>
          <p className="lede">
            A sample night console for six shop departments. The city, the board, and the note desk share one
            fictional shift.
          </p>
        </div>
        <p className="beat-chip">
          <span>Sample night</span>
          {beat.label}
        </p>
      </header>
      <main className="layout">
        <NightCity departments={departments} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="side">
          <DispatchBoard
            departments={departments}
            log={beat.log}
            beatLabel={beat.label}
            beatIndex={beatIndex}
            beatCount={SAMPLE_BEATS.length}
            onStep={() => setBeatIndex((index) => (index + 1) % SAMPLE_BEATS.length)}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <JobNoteDesk />
        </div>
      </main>
      <footer className="colophon">
        Sample data only. Nothing is sent, posted, or billed. Copyright 2026 Dylan Green. Apache-2.0.
      </footer>
    </div>
  );
}
