import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "POC-0 Motion Persona Protocol — Jaehyuk Park",
  description:
    "A preregistered feasibility gate for cross-action actor-trait motion persona and non-arm evidence in PerMo.",
};

const toc = [
  ["Why this gate exists", "#motivation"],
  ["Research question", "#question"],
  ["Frozen action split", "#split"],
  ["Measurement design", "#measurement"],
  ["GO criteria", "#criteria"],
  ["Decision policy", "#decision"],
  ["First implementation ticket", "#ticket"],
];

export default function PocZeroPost() {
  return (
    <div className="article-shell">
      <header className="article-header">
        <Link className="article-back" href="/#posts">
          ← Back to research notes
        </Link>
        <span>Jaehyuk Park · Research notebook</span>
      </header>

      <main className="article-main">
        <section className="article-hero">
          <div>
            <p className="article-kicker">Protocol · POC-0 · August 1, 2026</p>
            <h1>Can motion persona survive an unseen action?</h1>
            <p className="article-deck">
              A feasibility gate for testing whether canonicalized actor×trait
              motion persona is measurable across actions—and whether useful
              identity evidence exists outside the arms.
            </p>
          </div>
          <aside className="article-status-card" aria-label="Protocol status">
            <span>Planned protocol · no results yet</span>
            <dl>
              <dt>Version</dt>
              <dd>Draft v1.0</dd>
              <dt>Data</dt>
              <dd>PerMo Traits</dd>
              <dt>Personas</dt>
              <dd>5 actors × 4 traits</dd>
              <dt>Locked test</dt>
              <dd>Walk</dd>
              <dt>Next gate</dt>
              <dd>Manifest audit</dd>
            </dl>
          </aside>
        </section>

        <div className="article-layout">
          <aside className="article-toc">
            <p>On this page</p>
            <nav aria-label="Article contents">
              {toc.map(([label, href]) => (
                <a href={href} key={href}>
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="prose">
            <section id="motivation">
              <h2>Why this gate exists</h2>
              <p>
                The larger research direction asks whether a generative model
                can preserve a character&apos;s motion identity when a physical
                constraint blocks its usual expressive cues. But a compensation
                mechanism is premature unless the intended identity signal can
                first be measured reliably.
              </p>
              <p>
                POC-0 therefore uses canonicalized ground-truth 3D motion only.
                It does not use a generator, scene geometry, collision losses,
                diffusion optimization, a router, or human evaluation. Its job
                is to decide whether the proposed research has a measurable
                foundation.
              </p>
            </section>

            <section id="question">
              <h2>Research question</h2>
              <p className="research-question">
                After controlling body shape and separating actions, can an
                actor×trait behavioral persona be retrieved from a held-out
                action, and is measurable persona evidence present outside the
                arms?
              </p>
              <p>
                The operational unit is not a trait label alone. It is the
                combination of performer and acted trait: five actors multiplied
                by four traits—Elegant, Shy, Silly, and Uppity—giving twenty
                closed-set motion personas.
              </p>
              <h3>What success would establish</h3>
              <ul>
                <li>Behavioral persona remains identifiable across unseen action content.</li>
                <li>The result is not explained only by body shape or metadata leakage.</li>
                <li>At least one non-arm cue group contains independently diagnostic evidence.</li>
              </ul>
              <h3>What success would not establish</h3>
              <p>
                Passing POC-0 would not demonstrate scene robustness,
                cross-part compensation, unseen-person generalization, or motion
                generation quality. Those claims require later experiments.
              </p>
            </section>

            <section id="split">
              <h2>Frozen action split</h2>
              <p>
                Evaluator fitting, hyperparameter selection, persona references,
                and final testing use completely disjoint actions. Walk remains
                sealed until every model and threshold choice is frozen.
              </p>
              <div className="protocol-table-wrap">
                <table className="protocol-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Actions</th>
                      <th>Permitted use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Evaluator training</td>
                      <td>Kick, Kick Something, Punch, Throw, Transition</td>
                      <td>Update model weights</td>
                    </tr>
                    <tr>
                      <td>Validation</td>
                      <td>Jump</td>
                      <td>Select hyperparameters and thresholds</td>
                    </tr>
                    <tr>
                      <td>Reference gallery</td>
                      <td>Run, Wave, Hop</td>
                      <td>Build each persona prototype only</td>
                    </tr>
                    <tr>
                      <td>Locked test</td>
                      <td>Walk</td>
                      <td>One final evaluation after freeze</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Only original takes are used for the primary experiment;
                mirrored samples ending in the official <code>_m</code> suffix
                are excluded. Exact take counts and missing cells must be
                determined from the released manifest rather than inferred from
                the paper.
              </p>
            </section>

            <section id="measurement">
              <h2>Measurement design</h2>
              <p>
                Body shape, global position, and initial heading are
                canonicalized before evaluation. The model input excludes
                betas, gender, file-name tokens, actor IDs, trait text, and hand
                or finger pose.
              </p>
              <h3>Two independent evaluators</h3>
              <ul>
                <li>
                  <strong>E_guide:</strong> a small temporal Transformer that may
                  later provide a differentiable persona loss.
                </li>
                <li>
                  <strong>E_audit:</strong> an independently trained ST-GCN or
                  dilated TCN that is never used for generator gradients or
                  checkpoint selection.
                </li>
              </ul>
              <p>
                Both must support the same conclusion. A result that passes only
                the guide evaluator is treated as a metric-gaming risk.
              </p>
              <h3>Region probes</h3>
              <div className="protocol-table-wrap">
                <table className="protocol-table">
                  <thead>
                    <tr>
                      <th>Probe</th>
                      <th>Evidence isolated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Left arm</td><td>Collar, shoulder, elbow, wrist</td></tr>
                    <tr><td>Right arm</td><td>Collar, shoulder, elbow, wrist</td></tr>
                    <tr><td>Torso + head</td><td>Spine, neck, and head articulation</td></tr>
                    <tr><td>Legs</td><td>Hip, knee, ankle, and foot behavior</td></tr>
                    <tr><td>Root + timing</td><td>Trajectory, yaw, speed, cadence, phase, and contact timing</td></tr>
                  </tbody>
                </table>
              </div>
              <p>
                Region-specific encoders are trained for the primary diagnostic
                test. Zeroing a body region inside a full-body evaluator is not
                used because it creates an out-of-distribution attribution test.
              </p>
            </section>

            <section id="criteria">
              <h2>Preregistered GO criteria</h2>
              <p>
                Every condition below must pass before moving to a physical-
                constraint experiment. These thresholds are a feasibility gate,
                not a claim of publication-level performance.
              </p>
              <ul className="gate-list">
                <li>Both evaluators reach 20-way R@1 ≥ 25%, with the 95% CI lower bound above the 5% chance level.</li>
                <li>Within-actor trait classification reaches at least 40%; chance is 25%.</li>
                <li>Within-trait actor classification reaches at least 35%; chance is 20%.</li>
                <li>Same-actor/different-trait and same-trait/different-actor hard-negative AUC reaches 0.80 for E_guide and 0.75 for E_audit.</li>
                <li>At least one of torso+head, legs, or root+timing reaches AUC ≥ 0.65 for at least three of the four traits.</li>
                <li>Canonical bone-length and shuffled-label controls remain at chance.</li>
              </ul>
            </section>

            <section id="decision">
              <h2>Decision policy</h2>
              <p>
                The purpose of preregistration is to make an unattractive result
                informative. The project does not add extra models or relax the
                split after seeing Walk.
              </p>
              <div className="decision-grid">
                <div className="decision-card">
                  <strong>GO</strong>
                  <p>Both evaluators and the non-arm gate pass. Continue to a constrained GT-motion POC.</p>
                </div>
                <div className="decision-card">
                  <strong>PARTIAL</strong>
                  <p>Full-body persona passes but non-arm signal fails. Preserve the persona study, stop the arm→non-arm router claim.</p>
                </div>
                <div className="decision-card">
                  <strong>NO-GO</strong>
                  <p>Cross-action retrieval or the independent audit fails. Stop scene and router implementation and report the failure.</p>
                </div>
              </div>
            </section>

            <section id="ticket">
              <h2>First implementation ticket</h2>
              <p>
                The first deliverable is not an evaluator. It is a deterministic
                data manifest and integrity audit for the PerMo Traits SMPL-H
                files.
              </p>
              <h3>Ticket 001 — Build the PerMo Traits manifest</h3>
              <ul>
                <li>Parse actor, trait, action, take, and mirror status deterministically.</li>
                <li>Treat “Kick Something” as one action and anchor mirror detection to the official suffix.</li>
                <li>Verify the five-actor by four-trait Cartesian set and report every missing action cell.</li>
                <li>Detect duplicate semantics, duplicate hashes, NaN/Inf arrays, zero-frame clips, and invalid temporal shapes.</li>
                <li>Assign each source take to exactly one frozen split role and make leakage a fatal error.</li>
                <li>Write only relative paths and stable IDs; never commit raw PerMo data or absolute local paths.</li>
                <li>Prove determinism with byte-identical outputs across repeated runs and synthetic unit tests.</li>
              </ul>
              <p>
                The ticket closes only after a real-data audit establishes the
                exact Traits take counts and missingness. Until then, the
                protocol status remains <strong>data audit pending</strong>.
              </p>
            </section>

            <footer className="article-footer">
              <span>Draft protocol v1.0 · Plans are not empirical results.</span>
              <Link href="/#posts">Return to posts →</Link>
            </footer>
          </article>
        </div>
      </main>
    </div>
  );
}
