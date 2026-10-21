import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  ExternalLink,
  Search,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { Shell } from "../components/Shell";
import { ArtefactCard } from "../components/ArtefactCard";
import { useRegistry } from "../hooks/useRegistry";
import {
  configured,
  entriesBySubmitter,
  entryById,
  explorer,
  submitEntry,
  switchNetwork,
} from "../genlayer/client";
import type { Artefact, TxState } from "../types";
import { AtlasWorld } from "../components/AtlasWorld";
function Empty({ kind = "atlas" }: { kind?: string }) {
  return (
    <div className="empty">
      <span>∿</span>
      <h2>The {kind} is waiting</h2>
      <p>
        No finalised records are visible yet. The first genuine contract record
        will appear here—nothing has been staged for display.
      </p>
      <Link to="/nominate">
        Preserve the first artefact <ArrowRight />
      </Link>
    </div>
  );
}
function LegacyAtlas() {
  const { entries, loading, error } = useRegistry(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const visible = useMemo(
    () =>
      entries.filter(
        (a) =>
          (cat === "all" || a.category === cat) &&
          (a.title + " " + a.historical_context)
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [entries, q, cat],
  );
  return (
    <>
      <section className="hero">
        <div>
          <span className="kicker">A living museum, held in consensus</span>
          <h1>
            Where the old internet <em>still has a horizon.</em>
          </h1>
          <p>
            Explore community spaces, rituals and creative works at risk of
            slipping beyond our shared memory.
          </p>
          <Link className="hero-cta" to="/nominate">
            Preserve an artefact <ArrowRight />
          </Link>
        </div>
        <aside>
          <strong>{entries.length.toString().padStart(2, "0")}</strong>
          <span>admitted artefacts</span>
          <i />
        </aside>
      </section>
      <section className="atlas-wrap" aria-label="Interactive artefact atlas">
        <div className="atlas-tools">
          <label>
            <Search />
            <span className="sr-only">Search museum</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the collection"
            />
          </label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="Filter category"
          >
            <option value="all">All regions</option>
            <option value="community">Communities</option>
            <option value="creative-work">Creative works</option>
            <option value="platform">Platforms</option>
            <option value="ritual">Rituals</option>
            <option value="tool">Tools</option>
          </select>
        </div>
        <div className="map-grid">
          <div className="contours" />
          {loading ? (
            <p className="map-note">Reading the finalised registry…</p>
          ) : error ? (
            <p className="map-note error">Registry unavailable: {error}</p>
          ) : visible.length ? (
            visible.map((a) => <ArtefactCard key={a.id} artefact={a} spatial />)
          ) : (
            <Empty />
          )}
          <span className="coordinate">34° LOST / 118° REMEMBERED</span>
        </div>
      </section>
      <section className="principles">
        <span className="kicker">How admission works</span>
        <h2>Not every memory becomes a monument.</h2>
        <div>
          <article>
            <b>01</b>
            <h3>Nominate</h3>
            <p>Describe an artefact and cite bounded, public evidence.</p>
          </article>
          <article>
            <b>02</b>
            <h3>Assess</h3>
            <p>
              Independent GenLayer validators evaluate the same published
              rubric.
            </p>
          </article>
          <article>
            <b>03</b>
            <h3>Remember</h3>
            <p>
              Accepted records join the atlas; every outcome remains traceable.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
function Atlas() {
  const { entries, loading, error } = useRegistry(true);
  return <AtlasWorld entries={entries} loading={loading} error={error} />;
}
void LegacyAtlas;
function Detail() {
  const { id } = useParams();
  const [a, setA] = useState<Artefact | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (id)
      entryById(id)
        .then(setA)
        .catch((e) => setError(String(e)));
  }, [id]);
  if (error)
    return (
      <div className="page">
        <h1>Record unavailable</h1>
        <p>{error}</p>
      </div>
    );
  if (!a)
    return (
      <div className="page">
        <p>Reading finalised record…</p>
      </div>
    );
  return (
    <article className="detail page">
      <Link to="/">← Return to atlas</Link>
      <div className="detail-head">
        <div>
          <span className="kicker">{a.category}</span>
          <h1>{a.title}</h1>
          <p>{a.historical_context}</p>
        </div>
        <span className={`seal ${a.assessment_status.toLowerCase()}`}>
          {a.assessment_status}
          <small>{a.assessment_version}</small>
        </span>
      </div>
      <div className="detail-grid">
        <section>
          <h2>Preservation assessment</h2>
          <p>{a.assessment_reason}</p>
          <blockquote>{a.evidence_summary}</blockquote>
          <h2>Evidence trail</h2>
          <ul>
            {a.evidence_urls.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {new URL(url).hostname}
                  <ExternalLink />
                </a>
              </li>
            ))}
          </ul>
        </section>
        <aside>
          <dl>
            <dt>Submitted</dt>
            <dd>{new Date(a.created_at).toLocaleString()}</dd>
            <dt>Contributor</dt>
            <dd className="mono">{a.submitter}</dd>
            <dt>Evidence digest</dt>
            <dd className="mono">{a.evidence_digest}</dd>
          </dl>
          <a
            href={a.source_url}
            target="_blank"
            rel="noreferrer"
            className="source-link"
          >
            Visit original source <ExternalLink />
          </a>
        </aside>
      </div>
    </article>
  );
}
function Nominate() {
  const [state, setState] = useState<TxState>("idle");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    source_url: "",
    category: "community",
    historical_context: "",
    evidence_urls: [""],
  });
  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await submitEntry(
        { ...form, evidence_urls: form.evidence_urls.filter(Boolean) },
        (s, h) => {
          setState(s);
          if (h) setHash(h);
        },
      );
    } catch (e) {
      setState("failed");
      setError(e instanceof Error ? e.message : "Transaction failed");
    }
  }
  return (
    <div className="studio page">
      <section>
        <span className="kicker">Nomination studio</span>
        <h1>Give a fragment of the web a place in memory.</h1>
        <p>
          Your words and evidence URLs become a permanent public record. Avoid
          private or personal information.
        </p>
        <form onSubmit={send}>
          <label>
            Artefact title
            <input
              required
              maxLength={120}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </label>
          <div className="form-row">
            <label>
              Original URL
              <input
                required
                type="url"
                value={form.source_url}
                onChange={(e) => update("source_url", e.target.value)}
              />
            </label>
            <label>
              Region
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="community">Community</option>
                <option value="creative-work">Creative work</option>
                <option value="platform">Platform</option>
                <option value="protocol">Protocol</option>
                <option value="ritual">Ritual</option>
                <option value="tool">Tool</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          <label>
            Historical context
            <textarea
              required
              minLength={30}
              maxLength={2000}
              value={form.historical_context}
              onChange={(e) => update("historical_context", e.target.value)}
              placeholder="What existed, who shaped it, and why does it matter?"
            />
          </label>
          <fieldset>
            <legend>
              Supporting evidence <small>1–3 public HTTP(S) links</small>
            </legend>
            {form.evidence_urls.map((url, i) => (
              <input
                key={i}
                required={i === 0}
                type="url"
                value={url}
                onChange={(e) =>
                  update(
                    "evidence_urls",
                    form.evidence_urls.map((x, j) =>
                      j === i ? e.target.value : x,
                    ),
                  )
                }
                placeholder="https://…"
              />
            ))}
            {form.evidence_urls.length < 3 && (
              <button
                type="button"
                className="text-button"
                onClick={() =>
                  update("evidence_urls", [...form.evidence_urls, ""])
                }
              >
                + Add another source
              </button>
            )}
          </fieldset>
          <div className="warning">
            <ShieldCheck />
            <p>
              <strong>Permanent public submission</strong>Your wallet will ask
              you to sign. A transaction hash is not success; this page waits
              for protocol finality.
            </p>
          </div>
          {!configured() && (
            <p className="error">
              Deployment is not configured. Add VITE_CONTRACT_ADDRESS before
              writing.
            </p>
          )}
          {error && <p className="error">{error}</p>}
          <button
            className="submit"
            disabled={state !== "idle" && state !== "failed"}
          >
            {state === "idle" || state === "failed"
              ? "Review & sign"
              : state === "confirming"
                ? "Confirm in wallet…"
                : state === "submitted"
                  ? "Submitted…"
                  : state === "finalising"
                    ? "Reaching finality…"
                    : "Finalised"}
          </button>
          {hash && (
            <a
              href={`${explorer}/transactions/${hash}`}
              target="_blank"
              rel="noreferrer"
              className="tx"
            >
              Transaction {hash.slice(0, 12)}… <ExternalLink />
            </a>
          )}
        </form>
      </section>
      <aside className="preview">
        <span>Live exhibit label</span>
        <div className="preview-object">{form.title.slice(0, 2) || "??"}</div>
        <small>{form.category}</small>
        <h2>{form.title || "Untitled fragment"}</h2>
        <p>
          {form.historical_context ||
            "Your account of this artefact will appear here."}
        </p>
      </aside>
    </div>
  );
}
function Ledger() {
  const { entries, loading, error } = useRegistry(false);
  const [filter, setFilter] = useState("ALL");
  const shown = entries.filter(
    (e) => filter === "ALL" || e.assessment_status === filter,
  );
  return (
    <div className="page ledger">
      <span className="kicker">Canonical register</span>
      <h1>Preservation ledger</h1>
      <p>
        Every finalised nomination remains visible, including rejected and
        inconclusive assessments.
      </p>
      <div className="tabs">
        {["ALL", "ACCEPTED", "REJECTED", "INCONCLUSIVE"].map((x) => (
          <button
            className={filter === x ? "active" : ""}
            onClick={() => setFilter(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Reading registry…</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : shown.length ? (
        <div className="records">
          {shown.map((a) => (
            <ArtefactCard key={a.id} artefact={a} />
          ))}
        </div>
      ) : (
        <Empty kind="ledger" />
      )}
    </div>
  );
}
function Mine() {
  const [address, setAddress] = useState(
    sessionStorage.getItem("va:wallet") || "",
  );
  const [entries, setEntries] = useState<Artefact[]>([]);
  const [error, setError] = useState("");
  async function connect() {
    try {
      const w = await import("../genlayer/client").then((m) =>
        m.connectWallet(),
      );
      setAddress(w.address);
      sessionStorage.setItem("va:wallet", w.address);
      setEntries((await entriesBySubmitter(w.address)).entries);
      if (w.wrongNetwork) setError("Switch to StudioNet before submitting.");
    } catch (e) {
      setError(String(e));
    }
  }
  useEffect(() => {
    if (address)
      entriesBySubmitter(address)
        .then((r) => setEntries(r.entries))
        .catch((e) => setError(String(e)));
  }, [address]);
  return (
    <div className="page ledger">
      <span className="kicker">Personal archive</span>
      <h1>My nominations</h1>
      {!address ? (
        <div className="empty">
          <Waypoints />
          <h2>Connect to recover your history</h2>
          <p>
            Your wallet address is the index. No account or off-chain database
            is used.
          </p>
          <button className="submit" onClick={connect}>
            Connect wallet
          </button>
        </div>
      ) : (
        <>
          <p className="mono">{address}</p>
          {error && (
            <p className="error">
              {error}{" "}
              <button
                className="text-button"
                onClick={() => void switchNetwork()}
              >
                Switch network
              </button>
            </p>
          )}
          {entries.length ? (
            <div className="records">
              {entries.map((a) => (
                <ArtefactCard key={a.id} artefact={a} />
              ))}
            </div>
          ) : (
            <Empty kind="personal archive" />
          )}
        </>
      )}
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Atlas />} />
          <Route path="/artefact/:id" element={<Detail />} />
          <Route path="/nominate" element={<Nominate />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/mine" element={<Mine />} />
          <Route
            path="*"
            element={
              <div className="page">
                <h1>Lost coordinate</h1>
                <Link to="/">Return to the atlas</Link>
              </div>
            }
          />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
