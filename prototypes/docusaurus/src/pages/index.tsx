import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const quickStartSteps = [
  {
    title: 'Install Gem',
    command: 'bundle add shakapacker',
    docsPath: '/docs/configuration',
  },
  {
    title: 'Install Files',
    command: 'bin/rails shakapacker:install',
    docsPath: '/docs/configuration',
  },
  {
    title: 'Deploy',
    command: 'bin/rails assets:precompile',
    docsPath: '/docs/deployment',
  },
];

const highlights = [
  {
    quote:
      'Drop-in Rails integration for modern JavaScript bundling with Webpack 5 and Rspack support.',
    author: 'Rails-first workflow',
    role: 'Keep your existing conventions',
  },
  {
    quote:
      'Configuration, upgrades, and troubleshooting guidance are versioned alongside the source code.',
    author: 'Docs from source',
    role: 'Always aligned with current releases',
  },
];

function HeroSection() {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx('container', styles.heroContent)}>
        <p className={styles.kicker}>JavaScript Bundling for Rails</p>
        <h1 className={styles.title}>Shakapacker</h1>
        <p className={styles.subtitle}>
          Production-focused docs for configuring, deploying, and upgrading Shakapacker in Rails
          applications.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs">
            Browse Docs
          </Link>
          <Link className="button button--secondary button--lg" to="/examples">
            Resources
          </Link>
          <Link className="button button--secondary button--lg" to="/pro">
            Support
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2>Quick Start</h2>
        <div className={styles.stepGrid}>
          {quickStartSteps.map((step) => (
            <article className={styles.stepCard} key={step.title}>
              <h3>{step.title}</h3>
              <code className={styles.inlineCode}>{step.command}</code>
              <p>
                <Link to={step.docsPath}>Open guide</Link>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightsSection() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <h2>Why Teams Use It</h2>
        <div className={styles.quoteGrid}>
          {highlights.map((entry) => (
            <blockquote className={styles.quoteCard} key={entry.author}>
              <p>{entry.quote}</p>
              <footer>
                <strong>{entry.author}</strong>
                <span>{entry.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2>Docs Architecture</h2>
        <p>
          Canonical markdown stays in <code>shakapacker/docs</code>. This site syncs that content at
          build time, so docs stay co-located with the code while deployment remains independent.
        </p>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Shakapacker"
      description="Official Shakapacker documentation, guides, and support resources.">
      <HeroSection />
      <main>
        <QuickStartSection />
        <ArchitectureSection />
        <HighlightsSection />
      </main>
    </Layout>
  );
}
