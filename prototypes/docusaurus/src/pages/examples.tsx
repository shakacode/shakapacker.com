import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './examples.module.css';

const evaluationPaths = [
  {
    eyebrow: 'Setup path',
    title: 'Install and configure Shakapacker',
    description:
      'Start with the docs landing page, then follow configuration and deployment guidance in sequence.',
    href: '/docs',
    cta: 'Open setup docs',
  },
  {
    eyebrow: 'Upgrade path',
    title: 'Upgrade or migrate with confidence',
    description:
      'Use versioned upgrade notes and migration guides for Webpack-to-Rspack and major-release transitions.',
    href: '/docs/common-upgrades',
    cta: 'Review upgrade guides',
  },
];

const resources = [
  {
    title: 'shakacode/shakapacker',
    description: 'Canonical source code, release notes, and issue tracker for Shakapacker.',
    href: 'https://github.com/shakacode/shakapacker',
    cta: 'Open repository',
  },
  {
    title: 'Rspack Migration Guide',
    description: 'Step-by-step migration checklist for moving from Webpack to Rspack.',
    to: '/docs/rspack_migration_guide',
    cta: 'Open migration guide',
  },
  {
    title: 'Troubleshooting Guide',
    description: 'Practical fixes for dependency, compile, and deployment issues.',
    to: '/docs/troubleshooting',
    cta: 'Open troubleshooting docs',
  },
];

export default function ExamplesPage(): ReactNode {
  return (
    <Layout title="Resources" description="Shakapacker resources, migration paths, and references">
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.kicker}>Resources and migration references</p>
            <h1>Use concrete docs and concrete repos when evaluating Shakapacker.</h1>
            <p className={styles.lead}>
              These links support setup, upgrades, and operational troubleshooting. They are meant to
              accelerate implementation decisions.
            </p>
          </div>
        </section>

        <section className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Choose a path</p>
            <h2>Start from your current app state.</h2>
          </div>
          <div className={`${styles.grid} ${styles.evaluationGrid}`}>
            {evaluationPaths.map((path) => (
              <article className={styles.card} key={path.title}>
                <p className={styles.cardEyebrow}>{path.eyebrow}</p>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <Link className={styles.cardLink} to={path.href}>
                  {path.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Reference links</p>
            <h2>Resources that map directly to docs workflows.</h2>
          </div>
          <div className={styles.grid}>
            {resources.map((resource) => (
              <article className={styles.card} key={resource.title}>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                {resource.to ? (
                  <Link className={styles.cardLink} to={resource.to}>
                    {resource.cta}
                  </Link>
                ) : (
                  <Link className={styles.cardLink} href={resource.href}>
                    {resource.cta}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
