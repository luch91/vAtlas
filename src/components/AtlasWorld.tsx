import { useMemo, useRef, useState } from "react";
import { Compass, LocateFixed, Minus, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Artefact } from "../types";
type Camera = { x: number; y: number; scale: number };
const WORLD = { w: 1800, h: 1050 };
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const islands = [
  ["Early web", 330, 570, 0],
  ["Communities", 690, 315, 3],
  ["Creative works", 1010, 300, 1],
  ["Tools & protocols", 1390, 525, 4],
  ["Lost platforms", 1100, 730, 2],
  ["Portal ruins", 470, 810, 5],
] as const;
export function AtlasWorld({
  entries,
  loading,
  error,
}: {
  entries: Artefact[];
  loading: boolean;
  error: string;
}) {
  const nav = useNavigate(),
    stage = useRef<HTMLDivElement>(null),
    pts = useRef(new Map<number, { x: number; y: number }>()),
    g = useRef({ cx: 0, cy: 0, x: 0, y: 0, dist: 0 });
  const [cam, setCam] = useState<Camera>({ x: 0, y: 0, scale: 1 }),
    [selected, setSelected] = useState(""),
    [hint, setHint] = useState(true);
  const accepted = entries.filter((e) => e.assessment_status === "ACCEPTED"),
    record = accepted.find((e) => e.id === selected),
    records = useMemo(
      () =>
        accepted.map((entry, i) => ({
          entry,
          x: 900 + (i % 3) * 210,
          y: 560 + Math.floor(i / 3) * 180,
          s: i % 6,
        })),
      [accepted],
    );
  const bound = (c: Camera) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return c;
    const mx = Math.max(0, (WORLD.w * c.scale - r.width) / 2),
      my = Math.max(0, (WORLD.h * c.scale - r.height) / 2);
    return { ...c, x: clamp(c.x, -mx, mx), y: clamp(c.y, -my, my) };
  };
  const zoomAt = (z: number, x: number, y: number) =>
    setCam((c) => {
      const r = stage.current?.getBoundingClientRect();
      if (!r) return c;
      const s = clamp(z, 0.72, 2.25),
        px = x - r.left - r.width / 2,
        py = y - r.top - r.height / 2;
      return bound({
        scale: s,
        x: px - ((px - c.x) * s) / c.scale,
        y: py - ((py - c.y) * s) / c.scale,
      });
    });
  function down(e: React.PointerEvent) {
    try { stage.current?.setPointerCapture(e.pointerId); } catch { /* synthetic touch */ }
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    g.current = { cx: cam.x, cy: cam.y, x: e.clientX, y: e.clientY, dist: 0 };
    setHint(false);
  }
  function move(e: React.PointerEvent) {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const p = [...pts.current.values()];
    if (p.length === 2) {
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y),
        x = (p[0].x + p[1].x) / 2,
        y = (p[0].y + p[1].y) / 2;
      if (g.current.dist) zoomAt((cam.scale * d) / g.current.dist, x, y);
      g.current.dist = d;
      return;
    }
    setCam((c) =>
      bound({
        ...c,
        x: g.current.cx + e.clientX - g.current.x,
        y: g.current.cy + e.clientY - g.current.y,
      }),
    );
  }
  function up(e: React.PointerEvent) {
    pts.current.delete(e.pointerId);
    g.current.dist = 0;
  }
  const focus = (x: number, y: number, id: string) => {
      setSelected(id);
      setCam(
        bound({
          scale: 1.5,
          x: (WORLD.w / 2 - x) * 1.5,
          y: (WORLD.h / 2 - y) * 1.5,
        }),
      );
    },
    tr = (d: number) =>
      `translate3d(${cam.x * d}px,${cam.y * d}px,0) scale(${1 + (cam.scale - 1) * d})`;
  return (
    <section className="world-shell layered-world">
      <div className="world-title">
        <span>THE LIVING ARCHIPELAGO</span>
        <h1>Explore the old internet the web almost forgot.</h1>
      </div>
      <div
        ref={stage}
        className="world-stage"
        tabIndex={0}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onWheel={(e) => {
          e.preventDefault();
          zoomAt(
            cam.scale + (e.deltaY < 0 ? 0.12 : -0.12),
            e.clientX,
            e.clientY,
          );
        }}
        onKeyDown={(e) => {
          const d = 50;
          if (e.key === "ArrowLeft") setCam((c) => bound({ ...c, x: c.x + d }));
          if (e.key === "ArrowRight")
            setCam((c) => bound({ ...c, x: c.x - d }));
          if (e.key === "ArrowUp") setCam((c) => bound({ ...c, y: c.y + d }));
          if (e.key === "ArrowDown") setCam((c) => bound({ ...c, y: c.y - d }));
        }}
      >
        <div
          className="depth-plane atlas-sky"
          style={{ transform: tr(0.12) }}
        />
        <div
          className="depth-plane atlas-haze"
          style={{ transform: tr(0.28) }}
        />
        <div
          className="object-plane atlas-scene"
          style={{
            width: WORLD.w,
            height: WORLD.h,
            transform: `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.scale})`,
          }}
        >
          {islands.map(([name, x, y, s], i) => (
            <button
              key={name}
              className={`scene-object island-object ${selected === `d${i}` ? "is-selected" : ""}`}
              style={{ left: x, top: y }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(x, y, `d${i}`)}
            >
              <i className={`sprite sprite-${s}`} />
              <span>{name}</span>
              <small>Interpretive scenery</small>
            </button>
          ))}
          {records.map(({ entry, x, y, s }) => (
            <button
              key={entry.id}
              className={`scene-object island-object record-island ${selected === entry.id ? "is-selected" : ""}`}
              style={{ left: x, top: y }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => focus(x, y, entry.id)}
            >
              <i className={`sprite sprite-${s}`} />
              <span>{entry.title}</span>
              <small>Finalised GenLayer record</small>
            </button>
          ))}
        </div>
        <div
          className="depth-plane foreground-clouds"
          style={{ transform: tr(1.13) }}
        />
        {hint && (
          <div className="gesture-hint">
            <Compass />
            Drag · zoom at pointer · pinch
          </div>
        )}
        <div className="camera-tools">
          <button
            onClick={(e) => zoomAt(cam.scale + 0.18, e.clientX, e.clientY)}
            aria-label="Zoom in"
          >
            <Plus />
          </button>
          <button
            onClick={(e) => zoomAt(cam.scale - 0.18, e.clientX, e.clientY)}
            aria-label="Zoom out"
          >
            <Minus />
          </button>
          <button
            onClick={() => setCam({ x: 0, y: 0, scale: 1 })}
            aria-label="Reset camera"
          >
            <LocateFixed />
          </button>
        </div>
        <button
          className="minimap live-minimap"
          onClick={() => setCam({ x: 0, y: 0, scale: 1 })}
          aria-label="Reset atlas camera"
        >
          {islands.map((o) => (
            <i
              key={o[0]}
              style={{
                left: `${(o[1] / WORLD.w) * 100}%`,
                top: `${(o[2] / WORLD.h) * 100}%`,
              }}
            />
          ))}
          <span
            style={{
              width: `${Math.min(92, 100 / cam.scale)}%`,
              height: `${Math.min(88, 100 / cam.scale)}%`,
              transform: `translate(calc(-50% + ${-cam.x / 18}px),calc(-50% + ${-cam.y / 14}px))`,
            }}
          />
        </button>
        <div className="world-status">
          <Sparkles />
          <div>
            <strong>
              {loading
                ? "Reading registry…"
                : error
                  ? "Registry interrupted"
                  : `${accepted.length} verified artefacts`}
            </strong>
            <small>Only luminous record islands are finalised.</small>
          </div>
        </div>
        {!loading && !error && !accepted.length && (
          <p className="sr-only">
            The atlas is waiting for its first finalised record. Nothing has
            been staged for display.
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
              onClick={() => nav(`/artefact/${record.id}`)}
            >
              Enter exhibit →
            </button>
          </article>
        )}
      </div>
    </section>
  );
}
