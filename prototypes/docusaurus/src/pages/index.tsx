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
      'Full guides for configuration, upgrades, and troubleshooting ship with every release — always in sync with the version you\'re running.',
    author: 'Docs from source',
    role: 'Browse docs in the docs/ directory',
  },
];

const rspackBenefits = [
  {
    title: 'Drop-in Webpack replacement',
    description:
      'Rspack is wire-compatible with Webpack 5. Existing loaders, plugins, and config files work without rewriting your build pipeline.',
  },
  {
    title: '2-4x faster builds',
    description:
      'Written in Rust, Rspack delivers dramatically faster cold starts, warm-cache rebuilds, and incremental production builds compared to Webpack.',
  },
  {
    title: 'Rails-native integration',
    description:
      'Unlike Vite, Rspack works with Shakapacker out of the box — no ejecting from the Rails asset pipeline, no custom server configuration.',
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
        <div className={styles.testimonialCard}>
          <div className={styles.testimonialHeader}>
            <span className={styles.testimonialBrand}>Academia.edu</span>
            <span className={styles.testimonialLabel}>Case Study</span>
          </div>
          <blockquote className={styles.testimonialQuote}>
            <p>
              2-4x build speed increase. Warm-cache startup went from ~1m to ~20s, and incremental
              prod builds now take ~10s.
            </p>
          </blockquote>
          <div className={styles.testimonialStats}>
            <div className={styles.testimonialStat}>
              <span className={styles.statValue}>2-4x</span>
              <span className={styles.statLabel}>faster builds</span>
            </div>
            <div className={styles.testimonialStat}>
              <span className={styles.statValue}>~20s</span>
              <span className={styles.statLabel}>warm-cache startup</span>
            </div>
            <div className={styles.testimonialStat}>
              <span className={styles.statValue}>~10s</span>
              <span className={styles.statLabel}>incremental deploys</span>
            </div>
          </div>
          <p className={styles.testimonialAttribution}>
            <strong>Jon Rajavuori</strong> — ShakaCode helped Academia.edu migrate from Webpack to
            Rspack
          </p>
        </div>
      </div>
    </section>
  );
}

function RspackSection() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <h2>Rspack Support</h2>
        <p className={styles.rspackIntro}>
          Shakapacker ships with first-class{' '}
          <a href="https://rspack.dev/" target="_blank" rel="noopener noreferrer">
            Rspack
          </a>{' '}
          support — a Rust-powered bundler that&rsquo;s wire-compatible with Webpack 5 but
          dramatically faster. Switch bundlers with a one-line config change; no migration rewrite
          needed.
        </p>
        <div className={styles.benefitGrid}>
          {rspackBenefits.map((b) => (
            <article className={styles.benefitCard} key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.description}</p>
            </article>
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
        <RspackSection />
        <HighlightsSection />
        <ArchitectureSection />
      </main>
    </Layout>
  );
}
