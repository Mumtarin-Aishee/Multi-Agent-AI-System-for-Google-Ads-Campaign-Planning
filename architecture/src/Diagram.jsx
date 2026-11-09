import React from 'react';
import { EDGES, NODES, NODE_H, NODE_W, STEPS } from './workflow.js';

const KIND_LABEL = {
  input: 'INPUT',
  core: 'CORE',
  agent: 'AGENT',
  human: 'HUMAN',
  output: 'OUTPUT',
  future: 'PLANNED',
};

function firstStepOf(nodeId) {
  return STEPS.findIndex((s) => s.nodes.includes(nodeId));
}

function Packets({ path, tone, animate }) {
  if (!animate) return null;
  return [0, 1, 2].map((i) => (
    <circle key={i} r="6" className={`packet packet-${tone}`}>
      <animateMotion dur="1.8s" begin={`${-i * 0.6}s`} repeatCount="indefinite" path={path} />
    </circle>
  ));
}

export default function Diagram({ step, onSelect, animate }) {
  const current = STEPS[step];
  const tone = current.tone === 'alert' ? 'alert' : current.human ? 'human' : current.future ? 'future' : 'flow';

  const traversed = new Set();
  STEPS.slice(0, step).forEach((s) => s.edges.forEach((e) => traversed.add(e)));

  return (
    <div className="diagram-scroll">
      <svg className="diagram" viewBox="0 0 1300 790" role="img" aria-label={`Workflow diagram, currently showing ${current.title}`}>
        <defs>
          {['idle', 'done', 'flow', 'human', 'alert', 'future'].map((m) => (
            <marker key={m} id={`arrow-${m}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className={`arrowhead-${m}`} />
            </marker>
          ))}
        </defs>

        <text x="770" y="40" className="lane">AGENT LAYER</text>
        <text x="1070" y="255" className="lane">REVIEW</text>
        <text x="40" y="120" className="lane">SHARED INPUTS</text>

        {Object.entries(EDGES).map(([id, d]) => {
          const active = current.edges.includes(id);
          const state = active ? tone : traversed.has(id) ? 'done' : 'idle';
          const isReturn = id === 'reviewK-keyword' || id === 'reviewC-adcopy';
          return (
            <path
              key={id}
              d={d}
              className={`edge edge-${state}${isReturn ? ' edge-return' : ''}`}
              markerEnd={`url(#arrow-${state})`}
            />
          );
        })}

        {current.edges.map((id) => (
          <Packets key={`${step}-${id}`} path={EDGES[id]} tone={tone} animate={animate} />
        ))}

        {NODES.map((n) => {
          const first = firstStepOf(n.id);
          const active = current.nodes.includes(n.id);
          const done = !active && first < step;
          const stateClass = active ? `node-active node-active-${tone}` : done ? 'node-done' : 'node-idle';
          return (
            <g
              key={n.id}
              className={`node node-${n.kind} ${stateClass}`}
              transform={`translate(${n.x} ${n.y})`}
              onClick={() => onSelect(first)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(first);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${n.label}: ${n.sub}. Jump to this step.`}
            >
              {active && animate && (
                <rect className="pulse" x="-1" y="-1" width={NODE_W + 2} height={NODE_H + 2} rx="13" />
              )}
              <rect className="node-box" width={NODE_W} height={NODE_H} rx="12" />
              <text x="14" y="23" className="node-kind">{KIND_LABEL[n.kind]}</text>
              {done && <text x={NODE_W - 14} y="24" textAnchor="end" className="node-check">✓</text>}
              <text x="14" y="49" className="node-label">{n.label}</text>
              <text x="14" y="69" className="node-sub">{n.sub}</text>
            </g>
          );
        })}

        <text x="1000" y="306" className="edge-label">scored</text>
        <text x="1000" y="364" className="edge-label">override</text>
        <text x="1000" y="520" className="edge-label">RSAs</text>
        <text x="1000" y="580" className="edge-label">override</text>
        <text x="1050" y="210" className="edge-label">insights</text>
        <text x="875" y="225" className="edge-label">gaps</text>
        <text x="1010" y="430" className="edge-label">approved</text>
      </svg>
    </div>
  );
}
