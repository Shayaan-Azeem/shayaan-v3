"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import styles from "../page.module.css";

const MAX_TILT = 9;
const STORAGE_KEY = "visitor-book-pages";

type VisitorPage = {
  drawing: string;
  name: string;
  note: string;
};

export default function Notebook() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState<VisitorPage[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [showComposer, setShowComposer] = useState(false);
  const [stage, setStage] = useState<"details" | "draw">("details");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const stored = JSON.parse(saved) as Array<VisitorPage | string>;
    const storedPages = stored.map((page) =>
      typeof page === "string"
        ? { drawing: page, name: "Visitor", note: "" }
        : page,
    );
    setPages(storedPages);
    setPageIndex(Math.max(0, storedPages.length - 1));
  }, []);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || open) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
    el.style.setProperty("--ry", `${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--gloss", "1");
  };

  const rest = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gloss", "0");
  };

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const { x, y } = point(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: PointerEvent<HTMLCanvasElement>) => {
    const context = canvasRef.current?.getContext("2d");
    if (!drawing.current || !context) return;

    const { x, y } = point(e);
    context.lineWidth = 7;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#173d27";
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  const clearPage = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const openComposer = () => {
    setName("");
    setNote("");
    setStage("details");
    setShowComposer(true);
  };

  const addPage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nextPages = [
      ...pages,
      { drawing: canvas.toDataURL("image/png"), name: name.trim(), note: note.trim() },
    ];
    setPages(nextPages);
    setPageIndex(nextPages.length - 1);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPages));
    clearPage();
    setShowComposer(false);
    setOpen(true);
  };

  const savedPage = pages[pageIndex];

  return (
    <>
      <div
        ref={ref}
        className={`${styles.stack} ${open ? styles.isOpen : ""}`}
        onPointerMove={onMove}
        onPointerLeave={rest}
      >
        <div className={styles.paper}>
          <span className={styles.grain} aria-hidden="true" />
          {savedPage && (
            <>
              <img
                className={styles.savedPage}
                src={savedPage.drawing}
                alt={`Doodle by ${savedPage.name}`}
              />
              <div className={styles.doodleMeta}>
                <strong>{savedPage.name}</strong>
                {savedPage.note && <span>{savedPage.note}</span>}
              </div>
            </>
          )}
          {pages.length > 1 && (
            <div className={styles.pageControls}>
              <button
                type="button"
                onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
                disabled={pageIndex === 0}
                aria-label="Previous page"
              >
                ←
              </button>
              <span>{pageIndex + 1} / {pages.length}</span>
              <button
                type="button"
                onClick={() => setPageIndex((index) => Math.min(pages.length - 1, index + 1))}
                disabled={pageIndex === pages.length - 1}
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className={styles.notebook}
          aria-expanded={open}
          aria-label={open ? "Close visitor book" : "Open visitor book"}
          onClick={() => {
            rest();
            setOpen((value) => !value);
          }}
        >
          <span className={styles.staples} aria-hidden="true">
            <span className={styles.staple} />
            <span className={styles.staple} />
          </span>
          <span className={styles.spacer} />
          <span className={styles.name}>
            Visitor
            <br />
            Book
          </span>
          <span className={styles.gloss} aria-hidden="true" />
          <span className={styles.coverBack} aria-hidden="true" />
        </button>
      </div>

      <button type="button" className={styles.writeNote} onClick={openComposer}>
        Write a note
      </button>

      {showComposer && (
        <div className={styles.composerBackdrop} role="dialog" aria-modal="true" aria-label="Write a visitor note">
          <div className={styles.composer}>
            <button
              type="button"
              className={styles.composerClose}
              onClick={() => setShowComposer(false)}
              aria-label="Close"
            >
              ×
            </button>

            {stage === "details" ? (
              <form
                className={styles.noteForm}
                onSubmit={(event) => {
                  event.preventDefault();
                  if (name.trim()) setStage("draw");
                }}
              >
                <p>Thanks for visiting.</p>
                <h2>Leave your name and a note.</h2>
                <label>
                  Your name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name or handle"
                    required
                    maxLength={40}
                    autoFocus
                  />
                </label>
                <label>
                  A little note
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Write something…"
                    maxLength={140}
                  />
                </label>
                <button type="submit">Next: doodle</button>
              </form>
            ) : (
              <div className={styles.drawStep}>
                <p>Doodle anything</p>
                <canvas
                  ref={canvasRef}
                  className={styles.composerCanvas}
                  width={920}
                  height={920}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  aria-label="Draw your visitor book doodle"
                />
                <div className={styles.composerActions}>
                  <button type="button" onClick={() => setStage("details")}>Back</button>
                  <button type="button" onClick={clearPage}>Clear</button>
                  <button type="button" onClick={addPage}>Leave note</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
