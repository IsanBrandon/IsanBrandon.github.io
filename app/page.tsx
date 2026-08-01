const publications = [
  {
    venue: "WACV",
    year: "2024",
    kind: "Conference",
    title:
      "Human Motion Aware Text-to-Video Generation With Explicit Camera Control",
    authors:
      "Taehoon Kim*, ChanHee Kang*, JaeHyuk Park*, Daun Jeong*, ChangHee Yang*, Suk-Ju Kang, Kyeongbo Kong",
    contribution: "Co-first author",
    summary:
      "A human-motion-aware text-to-video framework that introduces explicit control over both character motion and camera movement.",
    tags: ["Text-to-Video", "Human Motion", "Camera Control"],
    paper:
      "https://openaccess.thecvf.com/content/WACV2024/html/Kim_Human_Motion_Aware_Text-to-Video_Generation_With_Explicit_Camera_Control_WACV_2024_paper.html",
    visual: "motion-camera",
  },
  {
    venue: "ICCV Workshop",
    year: "2023",
    kind: "Workshop",
    title:
      "Text-Based Video Generation With Human Motion and Controllable Camera",
    authors:
      "Taehoon Kim*, ChanHee Kang*, JaeHyuk Park*, Daun Jeong*, ChangHee Yang*, Suk-Ju Kang, Kyeongbo Kong",
    contribution: "Co-first author",
    summary:
      "An early investigation into combining generated human motion with controllable camera trajectories for text-conditioned video generation.",
    tags: ["Generative Video", "Motion Guidance", "Creative AI"],
    paper: "https://cveu.github.io/2023/papers/32.pdf",
    visual: "text-motion",
  },
  {
    venue: "IEIE Summer Conference",
    year: "2023",
    kind: "Domestic",
    title:
      "휴먼 모션 생성을 통한 텍스트 기반 비디오 생성 알고리즘에 관한 연구",
    authors: "김태훈*, 정다운*, 박재혁*, 공경보",
    contribution: "Co-first author",
    summary:
      "A study of a cascaded pipeline that connects text-driven motion generation with motion-guided video synthesis.",
    tags: ["Text-to-Motion", "Text-to-Video", "Human-Centric AI"],
    paper:
      "https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11522273",
    visual: "cascade",
  },
];

const navItems = [
  ["About me", "#about"],
  ["Publications", "#publications"],
  ["Experience", "#experience"],
  ["Gallery", "#gallery"],
  ["CV", "#cv"],
  ["Posts", "#posts"],
];

function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span aria-hidden="true" className="link-arrow">
      {external ? "↗" : "→"}
    </span>
  );
}

function SectionHeading({
  index,
  title,
  intro,
}: {
  index: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="section-heading">
      <p className="section-index">{index}</p>
      <div>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="wordmark" href="#about" aria-label="Jaehyuk Park, home">
          <span className="wordmark-mark">JP</span>
          <span className="wordmark-copy">
            Jaehyuk Park
            <small>AI research × visual storytelling</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {navItems.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
        </details>
      </header>

      <main id="main-content">
        <section className="hero section-wrap" id="about">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> Undergraduate researcher · Korea
            </p>
            <h1>
              Building intelligence
              <br />
              for <em>characters in motion.</em>
            </h1>
            <p className="hero-lead">
              I research computer vision and generative AI for controllable
              human motion, persistent character identity, and visual
              storytelling across actions and scenes.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#publications">
                View publications <Arrow />
              </a>
              <a className="button button-quiet" href="#posts">
                Read research notes <Arrow />
              </a>
            </div>
            <ul className="hero-tags" aria-label="Research interests">
              <li>Human Motion</li>
              <li>Persona &amp; Multimodal Generation</li>
              <li>AI for Film &amp; Animation</li>
            </ul>
          </div>

          <div className="research-frame" aria-label="Abstract diagram connecting persona, motion, and scene">
            <div className="frame-meta">
              <span>RESEARCH FRAME</span>
              <span>001 / 026</span>
            </div>
            <div className="frame-stage">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="persona-core">
                <span>JP</span>
                <small>character<br />intelligence</small>
              </div>
              <span className="diagram-node node-persona">persona</span>
              <span className="diagram-node node-motion">motion</span>
              <span className="diagram-node node-scene">scene</span>
              <span className="trajectory-dot dot-one" />
              <span className="trajectory-dot dot-two" />
              <span className="trajectory-dot dot-three" />
            </div>
            <p className="frame-caption">
              How can a virtual character remain recognizable when its action,
              environment, and available means of expression change?
            </p>
          </div>

          <div className="about-grid">
            <p className="about-kicker">About me</p>
            <div className="about-body">
              <p className="about-large">
                I am Jaehyuk Park, an undergraduate researcher working at the
                intersection of computer vision, generative motion, and
                character-centric AI.
              </p>
              <div className="about-columns">
                <p>
                  My current questions center on how models can generate
                  controllable human behavior while preserving a character&apos;s
                  behavioral identity across unfamiliar actions and physical
                  environments.
                </p>
                <p>
                  In the long term, I hope to connect AI research with
                  filmmaking and animation—building tools that give creators
                  finer control over how virtual characters move, behave, and
                  remain coherent throughout a story.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap" id="publications">
          <SectionHeading
            index="01"
            title="Selected publications"
            intro="Research on human motion and controllable video generation. An asterisk follows the equal-contribution notation used by the papers."
          />

          <div className="publication-list">
            {publications.map((publication, index) => (
              <article className="publication-card" key={publication.title}>
                <div className={`publication-visual ${publication.visual}`}>
                  <div className="visual-grid" />
                  <span className="visual-index">0{index + 1}</span>
                  <span className="visual-label">{publication.venue}</span>
                  <div className="motion-line line-one" />
                  <div className="motion-line line-two" />
                  <div className="motion-point point-one" />
                  <div className="motion-point point-two" />
                  <div className="motion-point point-three" />
                </div>
                <div className="publication-content">
                  <div className="publication-meta">
                    <span>{publication.venue}</span>
                    <span>{publication.year}</span>
                    <span>{publication.kind}</span>
                  </div>
                  <h3>{publication.title}</h3>
                  <p className="authors">{publication.authors}</p>
                  <p className="contribution">{publication.contribution}</p>
                  <p className="publication-summary">{publication.summary}</p>
                  <ul className="tag-list" aria-label={`Topics for ${publication.title}`}>
                    {publication.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <a
                    className="text-link"
                    href={publication.paper}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read paper <Arrow external />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap" id="experience">
          <SectionHeading
            index="02"
            title="Experience"
            intro="Research experiences and the questions that shaped my current direction."
          />

          <div className="timeline">
            <article className="timeline-row">
              <div className="timeline-date">Summer 2026</div>
              <div className="timeline-marker"><span /></div>
              <div className="timeline-content">
                <p className="timeline-type">Research internship</p>
                <h3>Interactive Multi-Modal Learning Lab</h3>
                <p className="timeline-place">UNIST · Ulsan, South Korea</p>
                <p>
                  Exploring multimodal generation, human motion, and
                  controllable character behavior through problem formulation,
                  literature analysis, experiment design, and implementation.
                </p>
              </div>
            </article>

            <article className="timeline-row">
              <div className="timeline-date">2026 — Present</div>
              <div className="timeline-marker"><span /></div>
              <div className="timeline-content">
                <p className="timeline-type">Independent research direction</p>
                <h3>Motion Persona under Physical Constraints</h3>
                <p className="timeline-place">Staged feasibility research</p>
                <p>
                  Investigating whether actor-specific motion identity remains
                  measurable across unseen actions, and whether persona evidence
                  is distributed across multiple body regions.
                </p>
              </div>
            </article>

            <article className="timeline-row">
              <div className="timeline-date">Undergraduate</div>
              <div className="timeline-marker"><span /></div>
              <div className="timeline-content">
                <p className="timeline-type">Education</p>
                <h3>Pukyong National University</h3>
                <p className="timeline-place">Busan, South Korea</p>
                <p>
                  Interdisciplinary study spanning engineering, artificial
                  intelligence, computer vision, graphics, and image processing.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="section-wrap" id="gallery">
          <SectionHeading
            index="03"
            title="Gallery"
            intro="A future home for motion studies, research figures, visual-development work, and selected moments behind the research."
          />

          <div className="gallery-grid">
            <article className="gallery-card gallery-motion">
              <div className="gallery-art" aria-hidden="true">
                <span className="pose-head" />
                <span className="pose-torso" />
                <span className="pose-arm arm-left" />
                <span className="pose-arm arm-right" />
                <span className="pose-leg leg-left" />
                <span className="pose-leg leg-right" />
                <span className="ghost-pose ghost-one" />
                <span className="ghost-pose ghost-two" />
              </div>
              <div className="gallery-copy">
                <p>Research in motion</p>
                <h3>Experiments &amp; diagnostics</h3>
                <span>Motion comparisons, canonicalization checks, and regional probes.</span>
              </div>
            </article>

            <article className="gallery-card gallery-figures">
              <div className="gallery-art figure-art" aria-hidden="true">
                <span className="figure-box box-a">input</span>
                <span className="figure-box box-b">model</span>
                <span className="figure-box box-c">evidence</span>
                <span className="figure-route route-a" />
                <span className="figure-route route-b" />
              </div>
              <div className="gallery-copy">
                <p>Figures &amp; visual design</p>
                <h3>Explaining systems clearly</h3>
                <span>Framework diagrams, architecture studies, and evaluation figures.</span>
              </div>
            </article>

            <article className="gallery-card gallery-film">
              <div className="gallery-art storyboard-art" aria-hidden="true">
                <span className="story-frame frame-a" />
                <span className="story-frame frame-b" />
                <span className="story-frame frame-c" />
                <span className="story-timecode">SC. 08 / TK. 01</span>
              </div>
              <div className="gallery-copy">
                <p>Film &amp; animation studies</p>
                <h3>From model to mise-en-scène</h3>
                <span>Storyboards, composition studies, character concepts, and visual development.</span>
              </div>
            </article>
          </div>

          <p className="gallery-note">
            Media is being curated. Every future item will include a caption,
            credit, alt text, and publication permission.
          </p>
        </section>

        <section className="section-wrap cv-section" id="cv">
          <div className="cv-panel">
            <div>
              <p className="section-index">04</p>
              <p className="cv-label">Curriculum vitae</p>
              <h2>A concise record of the work behind the questions.</h2>
            </div>
            <div className="cv-copy">
              <p>
                Education, publications, research experience, selected projects,
                and technical skills will be available here as a downloadable PDF.
              </p>
              <span className="button button-disabled" aria-disabled="true">
                CV PDF · preparing
              </span>
              <small>The public CV and contact details are being reviewed before release.</small>
            </div>
          </div>
        </section>

        <section className="section-wrap" id="posts">
          <SectionHeading
            index="05"
            title="Research notes & protocols"
            intro="A public research notebook for questions, frozen protocols, implementation tickets, failure analyses, and evidence-backed decisions."
          />

          <div className="posts-layout">
            <article className="featured-post">
              <div className="post-topline">
                <span className="post-type">Protocol</span>
                <span className="post-status">Planned · data audit pending</span>
              </div>
              <p className="post-date">August 1, 2026 · 8 min read</p>
              <h3>POC-0: Can motion persona survive an unseen action?</h3>
              <p>
                Before building a constraint-aware generator, I first need to
                establish that the identity signal I want to preserve is both
                measurable across actions and distributed beyond the arms.
              </p>
              <a className="button button-primary" href="/posts/poc-0/">
                Read the protocol <Arrow />
              </a>
            </article>

            <div className="post-queue" aria-label="Upcoming research posts">
              <article>
                <div>
                  <span>Ticket · Ready</span>
                  <span>001</span>
                </div>
                <h3>Build the PerMo Traits manifest</h3>
                <p>Deterministic parsing, missingness audit, and split-leakage tests.</p>
                <small>Repository ticket · awaiting research-repo setup</small>
              </article>
              <article>
                <div>
                  <span>Research log · Template</span>
                  <span>002</span>
                </div>
                <h3>From question to evidence</h3>
                <p>A dated log for decisions, failed assumptions, evidence, and next actions.</p>
                <small>Ready for the first experiment entry</small>
              </article>
              <article>
                <div>
                  <span>Paper review · Template</span>
                  <span>003</span>
                </div>
                <h3>Problem, method, evidence, limits</h3>
                <p>A concise reading format for understanding what a paper establishes.</p>
                <small>Ready for the first review</small>
              </article>
              <article>
                <div>
                  <span>Paper analysis · Template</span>
                  <span>004</span>
                </div>
                <h3>From intuition to implementation</h3>
                <p>Deep analysis connecting equations, code paths, assumptions, and new research questions.</p>
                <small>Ready for the first analysis</small>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <div>
          <p className="footer-name">Jaehyuk Park</p>
          <p>Character-centered AI for motion, scenes, and stories.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/IsanBrandon" target="_blank" rel="noreferrer">
            GitHub <Arrow external />
          </a>
          <span>Email · coming soon</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
