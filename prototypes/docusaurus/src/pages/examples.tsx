import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './examples.module.css';

const exampleApps = [
  {
    title: 'Changelog',
    description:
      'Release notes for every Shakapacker version, including breaking changes and migration tips.',
    href: '/docs/changelog',
  },
  {
    title: 'shakacode/shakapacker',
    description:
      'Main Shakapacker repository with source code, changelog, and issue tracking.',
    href: 'https://github.com/shakacode/shakapacker',
  },
  {
    title: 'Rspack Migration Guide',
    description:
      'Step-by-step guidance for migrating existing applications from Webpack to Rspack.',
    href: '/docs/rspack_migration_guide',
  },
  {
    title: 'Troubleshooting Guide',
    description:
      'Common build and runtime fixes for package resolution, compilation, and deployment.',
    href: '/docs/troubleshooting',
  },
];

const packageReferences = [
  {
    title: 'shakapacker',
    description: 'Core npm package for Shakapacker JavaScript helpers and bundler configuration.',
    href: 'https://www.npmjs.com/package/shakapacker',
  },
  {
    title: 'shakapacker-rspack',
    description: 'Rspack-specific supplemental npm package for Shakapacker installations.',
    href: 'https://www.npmjs.com/package/shakapacker-rspack',
  },
  {
    title: 'shakapacker-webpack',
    description: 'Webpack-specific supplemental npm package for Shakapacker installations.',
    href: 'https://www.npmjs.com/package/shakapacker-webpack',
  },
  {
    title: 'RubyGems shakapacker',
    description: 'Ruby gem package for Rails integration, installers, view helpers, and releases.',
    href: 'https://rubygems.org/gems/shakapacker',
  },
];

export default function ExamplesPage(): ReactNode {
  return (
    <Layout title="Resources" description="Shakapacker repositories, guides, and reference material">
      <main className={styles.main}>
        <section className="container">
          <h1>Resources</h1>
          <p>
            Use these references when setting up, upgrading, and operating Shakapacker in Rails
            applications.
          </p>
          <div className={styles.grid}>
            {exampleApps.map((app) => (
              <article className={styles.card} key={app.title}>
                <h2>{app.title}</h2>
                <p>{app.description}</p>
                <p>
                  <Link to={app.href}>Open resource</Link>
                </p>
              </article>
            ))}
          </div>
          <h2 className={styles.sectionHeading}>Package References</h2>
          <div className={styles.grid}>
            {packageReferences.map((reference) => (
              <article className={styles.card} key={reference.title}>
                <h2>{reference.title}</h2>
                <p>{reference.description}</p>
                <p>
                  <Link to={reference.href}>Open package</Link>
                </p>
              </article>
            ))}
          </div>
          <aside className={styles.conversionBanner}>
            <div>
              <h2>Need help applying this in production?</h2>
              <p>
                Book a complimentary 30-minute assessment with ShakaCode to review your Rails build
                setup and migration plan.
              </p>
            </div>
            <div className={styles.conversionActions}>
              <Link
                className="button button--primary button--lg"
                href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
                Book assessment
              </Link>
              <Link className="button button--secondary button--lg" href="https://www.shakacode.com/contact/">
                Contact ShakaCode
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </Layout>
  );
}
