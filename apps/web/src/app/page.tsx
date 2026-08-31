import { BrandMark, NetworkIcon, ShieldIcon, SourceIcon } from "@/components/icons";
import { ImpactExplorer } from "@/components/impact-explorer";
import styles from "./home.module.css";

const methodSteps = [
  {
    number: "01",
    title: "Detect broadly",
    description:
      "Monitor official inventories, feeds, pages, documents, and independent alert routes. Every run leaves a heartbeat.",
    icon: SourceIcon,
  },
  {
    number: "02",
    title: "Verify carefully",
    description:
      "A reviewer confirms legal status, commencement, transitional provisions, and SQE scope against primary sources.",
    icon: ShieldIcon,
  },
  {
    number: "03",
    title: "Map the impact",
    description:
      "Each atomic rule change is connected to direct, consequential, contextual, and explicitly unaffected areas.",
    icon: NetworkIcon,
  },
];

export default function Home() {
  return (
    <div className={styles.siteShell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#top" aria-label="SQE Updates home">
            <BrandMark />
            <span>SQE Updates</span>
          </a>

          <nav className={styles.primaryNav} aria-label="Primary navigation">
            <a href="#impact-preview">Impact preview</a>
            <a href="#method">Method</a>
            <a href="#coverage">Coverage</a>
          </nav>

          <a
            className={styles.headerAction}
            href="https://github.com/davidfitzgerald1579-boop/SQE-Updates"
          >
            View source
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main id="main-content">
        <section className={styles.hero} id="top">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Sitting-specific legal updates</p>
              <h1>Know which law applies to your SQE sitting.</h1>
              <p className={styles.heroLead}>
                Follow verified legal changes through to the calculations, rules,
                syllabus topics, and practical contexts they may affect.
              </p>

              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#impact-preview">
                  Explore the prototype
                  <span aria-hidden="true">→</span>
                </a>
                <a className={styles.secondaryButton} href="#method">
                  See how coverage works
                </a>
              </div>

              <ul className={styles.trustList} aria-label="Service principles">
                <li>
                  <span aria-hidden="true">✓</span> Primary-source led
                </li>
                <li>
                  <span aria-hidden="true">✓</span> Human reviewed
                </li>
                <li>
                  <span aria-hidden="true">✓</span> Public audit trail
                </li>
              </ul>
            </div>

            <aside className={styles.heroPanel} aria-label="How an update is traced">
              <p className={styles.panelLabel}>One change, fully traced</p>
              <div className={styles.traceItem}>
                <span className={styles.traceNumber}>1</span>
                <div>
                  <strong>What changed?</strong>
                  <span>An atomic rule, threshold, test, or procedure</span>
                </div>
              </div>
              <div className={styles.traceLine} aria-hidden="true" />
              <div className={styles.traceItem}>
                <span className={styles.traceNumber}>2</span>
                <div>
                  <strong>Where does it reach?</strong>
                  <span>Direct, consequential, and contextual impacts</span>
                </div>
              </div>
              <div className={styles.traceLine} aria-hidden="true" />
              <div className={styles.traceItem}>
                <span className={styles.traceNumber}>3</span>
                <div>
                  <strong>Does it apply to me?</strong>
                  <span>Checked against your cutoff and specification</span>
                </div>
              </div>
              <p className={styles.panelFootnote}>
                Publication requires authoritative evidence and editorial approval.
              </p>
            </aside>
          </div>
        </section>

        <section className={styles.previewSection} id="impact-preview">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Prototype impact record</p>
            <h2>See the consequence, not just the headline.</h2>
            <p>
              Change the sitting to see how the same operative date produces a
              different provisional cutoff result.
            </p>
          </div>
          <ImpactExplorer />
        </section>

        <section className={styles.methodSection} id="method">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Defence-in-depth monitoring</p>
            <h2>Automation finds candidates. People publish conclusions.</h2>
          </div>

          <div className={styles.methodGrid}>
            {methodSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article className={styles.methodCard} key={step.number}>
                  <div className={styles.methodCardTop}>
                    <span>{step.number}</span>
                    <Icon />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.coverageSection} id="coverage">
          <div>
            <p className={styles.coverageEyebrow}>The coverage promise</p>
            <h2>A failed source should never become a silent gap.</h2>
          </div>
          <div className={styles.coverageCopy}>
            <p>
              Every syllabus area will have declared primary and backup sources,
              monitored heartbeats, and periodic reconciliation against broader
              official inventories.
            </p>
            <a href="https://github.com/davidfitzgerald1579-boop/SQE-Updates/blob/main/docs/MONITORING.md">
              Read the monitoring standard
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      <footer className={styles.siteFooter}>
        <div>
          <a className={styles.brand} href="#top" aria-label="SQE Updates home">
            <BrandMark />
            <span>SQE Updates</span>
          </a>
          <p>
            An independent educational project. Not affiliated with or endorsed by
            the SRA or the SQE assessment provider.
          </p>
        </div>
        <p className={styles.footerStatus}>
          Foundation preview · Not legal advice or revision guidance
        </p>
      </footer>
    </div>
  );
}
