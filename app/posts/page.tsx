import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research Notes — Jaehyuk Park",
  description: "Research protocols, tickets, policies, and experiment notes by Jaehyuk Park.",
};

export default function PostsIndex() {
  return (
    <div className="article-shell">
      <header className="article-header">
        <Link className="article-back" href="/#posts">← Back to profile</Link>
        <span>Jaehyuk Park · Research notebook</span>
      </header>
      <main className="article-main">
        <section className="article-hero">
          <div>
            <p className="article-kicker">Archive</p>
            <h1>Research notes &amp; protocols</h1>
            <p className="article-deck">
              Questions, frozen designs, implementation tickets, and evidence-backed decisions—clearly separated from completed empirical results.
            </p>
          </div>
        </section>
        <div className="posts-layout">
          <article className="featured-post">
            <div className="post-topline">
              <span className="post-type">Protocol</span>
              <span className="post-status">Planned · data audit pending</span>
            </div>
            <p className="post-date">August 1, 2026 · 8 min read</p>
            <h3>POC-0: Can motion persona survive an unseen action?</h3>
            <p>A feasibility gate for cross-action actor×trait persona and non-arm evidence.</p>
            <a className="button button-primary" href="/posts/poc-0/">Read protocol →</a>
          </article>
          <div className="post-queue">
            <article>
              <div><span>Ticket · Ready</span><span>001</span></div>
              <h3>Build the PerMo Traits manifest</h3>
              <p>Publishing after the private research repository and licensing policy are ready.</p>
              <small>Queued</small>
            </article>
            <article>
              <div><span>Research Log · Template</span><span>002</span></div>
              <h3>From question to evidence</h3>
              <p>Record decisions, failed assumptions, evidence, and next actions without rewriting history.</p>
              <small>Ready</small>
            </article>
            <article>
              <div><span>Paper Review · Template</span><span>003</span></div>
              <h3>Problem, method, evidence, limits</h3>
              <p>A compact review format for understanding what a paper actually establishes.</p>
              <small>Ready</small>
            </article>
            <article>
              <div><span>Paper Analysis · Template</span><span>004</span></div>
              <h3>From intuition to implementation</h3>
              <p>Deep analysis connecting equations, code paths, assumptions, and research opportunities.</p>
              <small>Ready</small>
            </article>
            <article>
              <div><span>Policy · Draft</span><span>005</span></div>
              <h3>Evidence, leakage, and locked tests</h3>
              <p>A research operating policy for protocols, amendments, runs, and claims.</p>
              <small>Queued</small>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
