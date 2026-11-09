import React, { useCallback, useEffect, useState } from 'react';
import Diagram from './Diagram.jsx';
import { STEPS } from './workflow.js';

const STEP_MS = 7000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    q.addEventListener('change', onChange);
    return () => q.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function Output({ output }) {
  return (
    <section className="output" key={output.title}>
      <h3>{output.title}</h3>
      {output.type === 'rows' && (
        <dl className="rows">
          {output.rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      )}
      {output.type === 'chips' && (
        <div className="chips">
          {output.chips.map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      )}
      {output.type === 'bars' && (
        <div className="bars">
          {output.bars.map(([label, value, level]) => (
            <div className="bar" key={label}>
              <span className="bar-label">{label}</span>
              <span className="bar-track"><span className={`bar-fill bar-${level}`} style={{ '--value': `${value}%` }} /></span>
              <span className="bar-value">{value}</span>
            </div>
          ))}
        </div>
      )}
      {output.type === 'gates' && (
        <ul className="gates">
          {output.gates.map(([label, status]) => (
            <li key={label}><span>{label}</span><span className={`gate gate-${status.toLowerCase()}`}>{status}</span></li>
          ))}
        </ul>
      )}
      {output.type === 'alert' && (
        <div className="alert">
          <p>{output.text}</p>
          <span className="alert-action">Recommended: {output.action}</span>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState(1);
  const last = STEPS.length - 1;

  const select = useCallback((i) => {
    setPlaying(false);
    setStep(i);
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => {
      setStep((s) => (s >= last ? 0 : s + 1));
    }, STEP_MS / speed);
    return () => clearTimeout(t);
  }, [playing, step, speed, last]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('button, [role="button"], a')) {
        if (e.key === ' ' || e.key === 'Enter') return;
      }
      if (e.key === 'ArrowRight') select(Math.min(step + 1, last));
      if (e.key === 'ArrowLeft') select(Math.max(step - 1, 0));
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, last, select]);

  const current = STEPS[step];

  return (
    <div className="page">
      <header className="top">
        <div>
          <p className="brand">CampaignAI</p>
          <h1>How the multi-agent workflow runs</h1>
          <p className="lede">From campaign inputs to a reviewed Google Search campaign package, with people approving each key decision.</p>
        </div>
        <p className="status">Prototype walkthrough. Agents are simulated and all values are sample data. Not production ready.</p>
      </header>

      <main className="stage">
        <div className="canvas">
          <Diagram step={step} onSelect={select} animate={!reduced} />

          <div className="controls">
            <button type="button" className="primary" onClick={() => setPlaying((p) => !p)}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={() => select(Math.max(step - 1, 0))} disabled={step === 0}>Back</button>
            <button type="button" onClick={() => select(Math.min(step + 1, last))} disabled={step === last}>Next</button>
            <button type="button" onClick={() => select(0)}>Restart</button>
            <button type="button" onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))} aria-label={`Playback speed ${speed}x. Change speed.`}>
              {speed}x
            </button>
            <span className="counter">Step {step + 1} of {STEPS.length}</span>
          </div>

          <ol className="stepper">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  className={i === step ? 'current' : i < step ? 'past' : ''}
                  aria-current={i === step ? 'step' : undefined}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  title={s.title}
                  onClick={() => select(i)}
                >
                  <span className="dot">{i + 1}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <aside className={`detail detail-${current.tone || (current.human ? 'human' : current.future ? 'future' : 'flow')}`} key={step} aria-live="polite">
          <p className="eyebrow">Step {step + 1}</p>
          <h2>{current.title}</h2>
          <p className="summary">{current.summary}</p>
          <ul className="points">
            {current.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <Output output={current.output} />
          <p className="source">Source: {current.source}</p>
        </aside>
      </main>
    </div>
  );
}
