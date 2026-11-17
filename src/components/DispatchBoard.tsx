import { STATUS_META, departmentName, type ActivityEvent, type Department } from "../data/sampleRoster";

interface BoardProps {
  departments: Department[];
  log: ActivityEvent[];
  beatLabel: string;
  beatIndex: number;
  beatCount: number;
  onStep: () => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function DispatchBoard({
  departments,
  log,
  beatLabel,
  beatIndex,
  beatCount,
  onStep,
  selectedId,
  onSelect,
}: BoardProps) {
  return (
    <section className="panel" aria-labelledby="board-title">
      <div className="panel-head panel-head-row">
        <div>
          <h2 id="board-title">Dispatch board</h2>
          <p>{beatLabel}</p>
        </div>
        <button type="button" className="ghost-button" onClick={onStep}>
          Step sample night
          <span>
            {beatIndex + 1} / {beatCount}
          </span>
        </button>
      </div>
      <ul className="roster">
        {departments.map((department) => {
          const meta = STATUS_META[department.status];
          const selected = department.id === selectedId;
          return (
            <li key={department.id}>
              <button
                id={`dept-${department.id}`}
                type="button"
                className={selected ? "roster-card is-selected" : "roster-card"}
                aria-pressed={selected}
                onClick={() => onSelect(selected ? null : department.id)}
              >
                <span className="roster-top">
                  <span className="roster-name">{department.name}</span>
                  <span className="status-pill" data-status={department.status}>
                    <span className="swatch" style={{ background: meta.color }} />
                    {meta.label}
                  </span>
                </span>
                <span className="roster-building">{department.building}</span>
                <span className="roster-note">{department.statusNote}</span>
                {selected ? <span className="on-lot">On the lot</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="log-block">
        <h3>Recent activity</h3>
        <ol className="activity-log">
          {log.map((event) => {
            const related = event.departmentId === selectedId;
            return (
              <li key={event.id} className={related ? "log-line is-related" : "log-line"}>
                <time dateTime={event.at}>{event.at}</time>
                <span>
                  <strong>{departmentName(event.departmentId)}</strong>
                  {event.summary}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
