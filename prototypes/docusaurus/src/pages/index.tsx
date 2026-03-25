import {useEffect, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const personaPaths = [
  {
    title: 'Installing into an existing Rails app',
    description:
      'Follow the canonical install path and keep your current Rails structure while adding modern bundling.',
    href: '/docs/configuration',
    cta: 'Install Shakapacker',
  },
  {
    title: 'Upgrading from an older release',
    description:
      'Use upgrade checklists and release notes to move between major versions without guessing.',
    href: '/docs/common-upgrades',
    cta: 'Review upgrade guidance',
  },
  {
    title: 'Migrating from Webpack to Rspack',
    description:
      'Use the migration guide to adopt Rspack while preserving existing Rails integration patterns.',
    href: '/docs/rspack_migration_guide',
    cta: 'Open the Rspack guide',
  },
  {
    title: 'Troubleshooting build and deploy issues',
    description:
      'Diagnose common compile and runtime failures with practical fixes for Rails production workflows.',
    href: '/docs/troubleshooting',
    cta: 'Use troubleshooting docs',
  },
];

const recommendedFlows = [
  {
    title: 'Recommended first step',
    summary: 'Start from the install baseline before tuning advanced options or loader stacks.',
    command: 'bundle add shakapacker',
    href: '/docs/configuration',
    cta: 'Start with configuration',
  },
  {
    title: 'Initialize app files',
    summary:
      'Generate config and binstubs in one step so your app has the expected Shakapacker structure.',
    command: 'bin/rails shakapacker:install',
    href: '/docs/configuration',
    cta: 'Run installer steps',
  },
  {
    title: 'Validate deployment path',
    summary:
      'Precompile with the same task your deployment pipeline runs so failures show up early.',
    command: 'bin/rails assets:precompile',
    href: '/docs/deployment',
    cta: 'Read deployment docs',
  },
];

const keyGuides = [
  {
    title: 'API Reference',
    description: 'View helper and configuration APIs used by production Rails apps.',
    href: '/docs/api-reference',
  },
  {
    title: 'TypeScript and Loader Setup',
    description: 'Enable TypeScript and choose loader strategies for JavaScript and CSS pipelines.',
    href: '/docs/typescript',
  },
  {
    title: 'Version Upgrade Guides',
    description: 'Follow major-version upgrade notes for v6 through v9 and common migration pitfalls.',
    href: '/docs/v9_upgrade',
  },
];

const operatingNotes = [
  {
    quote:
      'Shakapacker keeps bundling inside Rails conventions so teams can preserve one deploy pipeline and one operational model.',
    author: 'Deployment model',
    role: 'Single release workflow',
  },
  {
    quote:
      'The docs are synced from the upstream repository, so guidance and code evolve together instead of drifting.',
    author: 'Documentation source',
    role: 'Version-aligned guidance',
  },
];

const firstRunCommands = ['bundle add shakapacker', 'bin/rails shakapacker:install', 'bin/rails assets:precompile'];

async function copyToClipboard(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall through to legacy copy path when Clipboard API exists but fails at runtime.
    }
  }

  if (typeof document !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    try {
      textArea.select();
      const copied = document.execCommand('copy');
      if (!copied) throw new Error('Fallback copy failed');
      return;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  throw new Error('Clipboard unavailable');
}

function HeroSection() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commandText = firstRunCommands.join('\n');

  useEffect(
    () => () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    },
    []
  );

  const handleCopyFirstRun = async () => {
    try {
      await copyToClipboard(commandText);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    if (copyResetTimerRef.current) {
      clearTimeout(copyResetTimerRef.current);
    }
    copyResetTimerRef.current = setTimeout(() => {
      setCopyState('idle');
      copyResetTimerRef.current = null;
    }, 1800);
  };

  const copyButtonLabel =
    copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Retry copy' : 'Copy commands';

  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx('container', styles.heroLayout)}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Official docs for Shakapacker</p>
          <h1 className={styles.title}>Keep Rails conventions while using modern JS and CSS bundling.</h1>
          <p className={styles.subtitle}>
            Start from the recommended install flow, then branch into migration, Rspack, TypeScript,
            and deployment guidance as needed.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs">
              Start with docs
            </Link>
            <Link className="button button--secondary button--lg" to="/examples">
              Browse resources
            </Link>
            <Link className="button button--secondary button--lg" to="/pro">
              Get support
            </Link>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <p className={styles.panelLabel}>Recommended first run</p>
          <ol className={styles.heroSteps}>
            {firstRunCommands.map((command) => (
              <li key={command}>
                <code>{command}</code>
              </li>
            ))}
          </ol>
          <div className={styles.panelActions}>
            <button
              type="button"
              className={clsx('button button--secondary button--sm', styles.copyButton)}
              onClick={handleCopyFirstRun}>
              {copyButtonLabel}
            </button>
          </div>
          <p className={styles.panelNote}>
            Follow with configuration and deployment docs to align your local setup with production.
          </p>
        </div>
      </div>
    </header>
  );
}

function PersonaSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Choose your path</p>
          <h2>Start where your Rails app is today.</h2>
        </div>
        <div className={styles.personaGrid}>
          {personaPaths.map((persona) => (
            <article className={styles.personaCard} key={persona.title}>
              <h3>{persona.title}</h3>
              <p>{persona.description}</p>
              <Link className={styles.cardLink} to={persona.href}>
                {persona.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowSection() {
  return (
    <section className={styles.sectionSoft}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Recommended flow</p>
          <h2>Keep setup deterministic before expanding into advanced bundling choices.</h2>
        </div>
        <div className={styles.flowGrid}>
          {recommendedFlows.map((flow) => (
            <article className={styles.flowCard} key={flow.title}>
              <p className={styles.cardEyebrow}>{flow.title}</p>
              <p className={styles.flowSummary}>{flow.summary}</p>
              <code className={styles.inlineCode}>{flow.command}</code>
              <Link className={styles.cardLink} to={flow.href}>
                {flow.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyGuidesSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Key references</p>
          <h2>Use focused docs for API details, upgrades, and loader migrations.</h2>
        </div>
        <div className={styles.migrationGrid}>
          {keyGuides.map((guide) => (
            <article className={styles.migrationCard} key={guide.title}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <Link className={styles.cardLink} to={guide.href}>
                Open guide
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.consultationBanner}>
          <div className={styles.consultationContent}>
            <p className={styles.sectionEyebrow}>Expert help</p>
            <h2>Get free advice from the team behind Shakapacker</h2>
            <p>
              ShakaCode maintains Shakapacker and supports teams with setup audits, migration plans,
              and production debugging. Book a complimentary 30-minute assessment for direct
              implementation guidance.
            </p>
          </div>
          <div className={styles.consultationActions}>
            <Link
              className="button button--primary button--lg"
              href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
              Book a complimentary assessment
            </Link>
            <Link className="button button--secondary button--lg" href="https://www.shakacode.com">
              Learn about ShakaCode
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function OperationsSection() {
  return (
    <section className={styles.sectionSoft}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Production notes</p>
          <h2>Shakapacker docs stay focused on operationally useful guidance.</h2>
        </div>
        <div className={styles.quoteGrid}>
          {operatingNotes.map((entry) => (
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

export default function Home(): ReactNode {
  return (
    <Layout
      title="Shakapacker"
      description="Official Shakapacker documentation, guides, migration paths, and support resources.">
      <HeroSection />
      <main>
        <PersonaSection />
        <FlowSection />
        <KeyGuidesSection />
        <OperationsSection />
        <ConsultationSection />
      </main>
    </Layout>
  );
}
