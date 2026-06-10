import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

const RSPACK_PACKAGE_README =
  'https://github.com/shakacode/shakapacker/blob/main/packages/shakapacker-rspack/README.md';
const WEBPACK_PACKAGE_README =
  'https://github.com/shakacode/shakapacker/blob/main/packages/shakapacker-webpack/README.md';

// The Yarn/pnpm commands also list shakapacker explicitly because the generated config
// imports it directly. See docs/migration/v10.1-supplemental-packages.md
// ("Package manager support") for per-package-manager behavior.
const NPM_INSTALL = 'npm install --save-dev shakapacker-rspack';
const YARN_INSTALL =
  'yarn add --dev shakapacker-rspack shakapacker @rspack/core @rspack/cli rspack-manifest-plugin';
const PNPM_INSTALL =
  'pnpm add --save-dev shakapacker-rspack shakapacker @rspack/core @rspack/cli rspack-manifest-plugin';

const quickStartSteps = [
  {
    title: 'Install Gem',
    command: 'bundle add shakapacker',
    docsPath: '/docs/installation',
    packageHref: 'https://rubygems.org/gems/shakapacker',
    packageRegistry: 'rubygems',
    packageName: 'shakapacker',
  },
  {
    title: 'Install Files',
    command: 'bin/rails shakapacker:install',
    docsPath: '/docs/installation',
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
      'Installation, configuration, and deployment guidance is sourced directly from the shakapacker/docs tree.',
    author: 'Docs from source',
    role: 'Always aligned with current releases',
  },
  {
    quote:
      'Keep webpack-style configuration and Rails conventions while switching the build engine to Rspack for major speed gains.',
    author: 'Rails-first migration',
    role: 'No rewrite required',
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

const comparisonColumns = [
  'Option',
  'Build step',
  'npm + loaders',
  'JSX / TS',
  'HMR',
  'Code splitting',
  'Rails manifest + helpers',
  'Best for',
];

const comparisonRows = [
  {
    option: 'Sprockets',
    cells: ['none (concatenate)', '✗', '✗', '✗', '✗', '✓ (legacy)', 'Legacy apps, CSS / images'],
  },
  {
    option: 'Propshaft',
    cells: ['none (digest only)', '✗', '✗', '✗', '✗', '✓', 'Modern digesting; pair with a bundler'],
  },
  {
    option: 'importmap-rails',
    cells: ['none', '✗', '✗', '✗', '✗', '✓ (Propshaft)', 'No-build Hotwire'],
  },
  {
    option: 'jsbundling-rails',
    cells: ['esbuild / rollup / bun', 'minimal', '✓', 'partial', 'limited', '✓ (Propshaft)', 'Simple modern JS'],
  },
  {
    option: 'Vite Ruby',
    cells: ['Vite', 'Vite ecosystem', '✓', '✓', '✓', 'own pipeline', 'Teams wanting Vite DX'],
  },
  {
    option: 'Shakapacker + Rspack',
    highlight: true,
    cells: [
      'webpack or Rspack',
      'full ecosystem',
      '✓ SWC / Babel / esbuild',
      '✓',
      '✓',
      '✓ native',
      'Complex / React / TS at scale',
    ],
  },
];

function comparisonCellClass(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.startsWith('✓')) return styles.compareYes;
  if (trimmed.startsWith('✗')) return styles.compareNo;
  return undefined;
}

function HeroSection() {
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <p className={styles.kicker}>JavaScript Bundling for Rails</p>
        <h1 className={styles.title}>
          <img
            className={styles.titleLogo}
            src="/img/brand/mark-transparent.svg"
            alt=""
            aria-hidden="true"
          />
          <span>Shakapacker</span>
        </h1>
        <p className={styles.subtitle}>
          Official docs for installing, configuring, deploying, and upgrading Shakapacker in Rails
          applications, with first-class Rspack support.
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
                {step.packageHref ? (
                  <>
                    {' '}
                    <span aria-hidden="true">/</span>{' '}
                    <Link
                      to={step.packageHref}
                      className="package-version-link"
                      data-package-version-registry={step.packageRegistry}
                      data-package-version-name={step.packageName}>
                      RubyGems
                    </Link>
                  </>
                ) : null}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OnePackageSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.onePackageKicker}>New in v10.1</p>
        <h2>One Package, the Full Build Stack</h2>
        <p className={styles.onePackageIntro}>
          Shakapacker 10.1 adds two supplemental packages —{' '}
          <Link to={RSPACK_PACKAGE_README}>shakapacker-rspack</Link> and{' '}
          <Link to={WEBPACK_PACKAGE_README}>shakapacker-webpack</Link> — that carry the managed
          build stack as required peer dependencies. Install one package instead of wiring up four.
        </p>
        <div className={styles.installCard}>
          <Tabs groupId="package-manager">
            <TabItem value="npm" label="npm" default>
              <CodeBlock language="bash">{NPM_INSTALL}</CodeBlock>
              <p className={styles.installCaption}>
                npm 7+ auto-installs the required peers: <code>@rspack/core</code>,{' '}
                <code>@rspack/cli</code>, and <code>rspack-manifest-plugin</code>.
              </p>
            </TabItem>
            <TabItem value="yarn" label="Yarn">
              <CodeBlock language="bash">{YARN_INSTALL}</CodeBlock>
            </TabItem>
            <TabItem value="pnpm" label="pnpm">
              <CodeBlock language="bash">{PNPM_INSTALL}</CodeBlock>
            </TabItem>
          </Tabs>
          <p className={styles.installNote}>
            Defaults to Rspack — it ships SWC, so there&rsquo;s no separate transpiler to install.
            Unlike npm 7+, Yarn and pnpm can&rsquo;t rely on the one-package install, so their
            commands list the bundler peers and <code>shakapacker</code> explicitly; the Rails
            installer (<code>bin/rails shakapacker:install</code>) writes them into your{' '}
            <code>package.json</code> for you either way.
          </p>
        </div>
        <p className={styles.webpackPointer}>
          Prefer webpack? Swap in <Link to={WEBPACK_PACKAGE_README}>shakapacker-webpack</Link> for
          the managed webpack stack.
        </p>
        <div className={styles.migrationCallout}>
          <p className={styles.migrationCalloutText}>
            <strong>Already on Shakapacker 10.0?</strong> Collapse four dependencies into one — your{' '}
            <code>shakapacker.yml</code> and build configs stay unchanged.
          </p>
          <div className={styles.migrationLinks}>
            <Link to="/docs/migration/v10.1-supplemental-packages">Migration guide</Link>
            <Link to="/docs/dependency-strategy">Dependency strategy</Link>
          </div>
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

function RspackSection() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.rspackHeader}>
          <a href="https://rspack.rs/" target="_blank" rel="noopener noreferrer">
            <img className={styles.rspackLogo} src="/img/rspack-logo.svg" alt="Rspack logo" />
          </a>
          <div>
            <p className={styles.rspackKicker}>Shakapacker + Rspack</p>
            <h2>2-4x Faster Builds, Same Rails Workflow</h2>
          </div>
        </div>
        <p className={styles.rspackIntro}>
          Shakapacker ships with first-class{' '}
          <a href="https://rspack.rs/" target="_blank" rel="noopener noreferrer">
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

function ComparisonSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2>How Shakapacker Compares</h2>
        <p className={styles.compareCaption}>
          Sprockets and Propshaft are Rails&rsquo; asset-digesting layer — they fingerprint assets
          but don&rsquo;t bundle JavaScript. importmap-rails, jsbundling-rails, Vite Ruby, and
          Shakapacker are how modern JS actually reaches the browser.
        </p>
        <div className={styles.compareScroll}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                {comparisonColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.option} className={row.highlight ? styles.compareHighlight : undefined}>
                  <th scope="row">{row.option}</th>
                  {row.cells.map((cell, index) => (
                    <td key={comparisonColumns[index + 1]} className={comparisonCellClass(cell)}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.compareFootnote}>
          <Link to="/docs/transpiler-performance">Full comparison &amp; benchmarks →</Link>
        </p>
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

function ExpertHelpSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.expertHelpBanner}>
          <div className={styles.expertHelpContent}>
            <p className={styles.expertHelpKicker}>Expert Help</p>
            <h2>Get direct guidance from the team behind Shakapacker</h2>
            <p>
              Planning a Webpack-to-Rspack migration or troubleshooting production builds? Book a
              complimentary 30-minute assessment with ShakaCode.
            </p>
          </div>
          <div className={styles.expertHelpActions}>
            <Link
              className="button button--primary button--lg"
              href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
              Book a free assessment
            </Link>
            <Link className="button button--secondary button--lg" href="https://www.shakacode.com/contact/">
              Contact ShakaCode
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Modern JavaScript & CSS Bundling for Rails"
      description="Shakapacker brings webpack and Rspack-powered JavaScript and CSS bundling to Ruby on Rails — official docs, installation guides, and Rspack migration resources.">
      <HeroSection />
      <main>
        <QuickStartSection />
        <OnePackageSection />
        <RspackSection />
        <ComparisonSection />
        <HighlightsSection />
        <ArchitectureSection />
        <ExpertHelpSection />
      </main>
    </Layout>
  );
}
