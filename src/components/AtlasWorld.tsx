import { useMemo, useRef, useState } from "react";
import { Compass, LocateFixed, Minus, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Artefact } from "../types";
type Camera = { x: number; y: number; scale: number };
const regions = [
  {
    name: "Communities",
    x: 29,
    y: 29,
    note: "Decorative region · gathering places",
  },
  {
    name: "Creative works",
    x: 48,
    y: 18,
    note: "Decorative region · vanished makers",
  },
  {
    name: "Tools & protocols",
    x: 70,
    y: 29,
    note: "Decorative region · machines of the web",
  },
  {
    name: "Lost platforms",
    x: 82,
    y: 51,
    note: "Decorative region · pathways awaiting records",
  },
  {
    name: "Early web",
    x: 17,
    y: 55,
    note: "Decorative region · bright beginnings",
  },
];
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
export function AtlasWorld({
  entries,
  loading,
  error,
}: {
  entries: Artefact[];
  loading: boolean;
  error: string;
}) {
  const navigate = useNavigate(),
    stage = useRef<HTMLDivElement>(null),
    pointers = useRef(new Map<number, { x: number; y: number }>()),
    drag = useRef({ x: 0, y: 0, cx: 0, cy: 0, distance: 0 });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 }),
    [selected, setSelected] = useState(""),
    [hint, setHint] = useState(true);
  const accepted = entries.filter((e) => e.assessment_status === "ACCEPTED"),
    record = accepted.find((e) => e.id === selected);
  const markers = useMemo(
    () =>
      accepted.map((entry, i) => ({
        entry,
        x: 44 + (i % 3) * 9,
        y: 55 + Math.floor(i / 3) * 8,
      })),
    [accepted],
  );
  const setScale = (n: number) =>
    setCamera((c) => ({ ...c, scale: clamp(n, 0.82, 2.35) }));
  function down(e: React.PointerEvent) {
    stage.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      cx: camera.x,
      cy: camera.y,
      distance: 0,
    };
    setHint(false);
  }
  function move(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pointers.current.values()];
    if (p.length === 2) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (drag.current.distance)
        setScale((camera.scale * d) / drag.current.distance);
      drag.current.distance = d;
      return;
    }
    setCamera((c) => ({
      ...c,
      x: clamp(drag.current.cx + e.clientX - drag.current.x, -560, 560),
      y: clamp(drag.current.cy + e.clientY - drag.current.y, -260, 260),
    }));
  }
  function up(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    drag.current.distance = 0;
  }
  function focus(x: number, y: number, id = "") {
    setSelected(id);
    setCamera({ x: (50 - x) * 8, y: (48 - y) * 5, scale: 1.45 });
    setHint(false);
  }
  function key(e: React.KeyboardEvent) {
    const d = 32;
    if (e.key === "ArrowLeft") setCamera((c) => ({ ...c, x: c.x + d }));
    if (e.key === "ArrowRight") setCamera((c) => ({ ...c, x: c.x - d }));
    if (e.key === "ArrowUp") setCamera((c) => ({ ...c, y: c.y + d }));
    if (e.key === "ArrowDown") setCamera((c) => ({ ...c, y: c.y - d }));
    if (e.key === "+" || e.key === "=") setScale(camera.scale + 0.15);
    if (e.key === "-") setScale(camera.scale - 0.15);
  }
  return (
    <section className="world-shell">
      <div className="world-title">
        <span>THE LIVING ARCHIPELAGO</span>
        <h1>Explore what the web almost forgot.</h1>
      </div>
      <div
        ref={stage}
        className="world-stage"
        tabIndex={0}
        onKeyDown={key}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onWheel={(e) => {
          e.preventDefault();
          setScale(camera.scale + (e.deltaY < 0 ? 0.12 : -0.12));
          setHint(false);
        }}
      >
        <div
          className="atlas-scene"
          style={{
            transform: `translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`,
          }}
        >
          <img
            src="/atlas-world.jpg"
            alt="A luminous archipelago of floating islands above violet clouds"
            draggable={false}
          />
          <div className="atmosphere" aria-hidden="true" />
          {regions.map((r, i) => (
            <button
              key={r.name}
              className={`region-marker region-${i}`}
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(r.x, r.y)}
            >
              <span>{r.name}</span>
              <small>{r.note}</small>
            </button>
          ))}
          {markers.map(({ entry, x, y }) => (
            <button
              key={entry.id}
              className="record-beacon"
              style={{ left: `${x}%`, top: `${y}%` }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(x, y, entry.id)}
            >
              <i />
              <span>{entry.title}</span>
              <small>Verified record · {entry.category}</small>
            </button>
          ))}
        </div>
        {hint && (
          <div className="gesture-hint">
            <Compass /> Drag to roam · scroll or pinch to zoom
          </div>
        )}
        <div className="camera-tools">
          <button
            onClick={() => setScale(camera.scale + 0.18)}
            aria-label="Zoom in"
          >
            <Plus />
          </button>
          <button
            onClick={() => setScale(camera.scale - 0.18)}
            aria-label="Zoom out"
          >
            <Minus />
          </button>
          <button
            onClick={() => setCamera({ x: 0, y: 0, scale: 1 })}
            aria-label="Reset camera"
          >
            <LocateFixed />
          </button>
        </div>
        <button
          className="minimap"
          onClick={() => setCamera({ x: 0, y: 0, scale: 1 })}
          aria-label="Reset atlas camera"
        >
          <img src="/atlas-world.jpg" alt="" />
          <span
            style={{
              transform: `translate(${-camera.x / 18}px,${-camera.y / 14}px) scale(${1 / camera.scale})`,
            }}
          />
        </button>
        <div className="world-status">
          <Sparkles />
          <div>
            <strong>
              {loading
                ? "Reading the registry…"
                : error
                  ? "Registry signal interrupted"
                  : `${accepted.length} verified ${accepted.length === 1 ? "artefact" : "artefacts"}`}
            </strong>
            <small>
              Scenery is interpretive. Bright beacons are finalised records.
            </small>
          </div>
        </div>
        {!loading && !error && accepted.length === 0 && (
          <p className="sr-only">
            The atlas is waiting for its first finalised record. Nothing has been staged for
            display.
          </p>
        )}
        {record && (
          <article className="world-preview">
            <button onClick={() => setSelected("")} aria-label="Close preview">
              ×
            </button>
            <span>
              {record.assessment_status} · {record.category}
            </span>
            <h2>{record.title}</h2>
            <p>{record.historical_context}</p>
            <button
              className="enter-exhibit"
              onClick={() => navigate(`/artefact/${record.id}`)}
            >
              Enter exhibit →
            </button>
          </article>
        )}
      </div>
    </section>
  );
}
