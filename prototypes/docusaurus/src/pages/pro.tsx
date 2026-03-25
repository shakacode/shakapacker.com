import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './pro.module.css';

const supportSteps = [
  {
    step: '1',
    title: 'Start with docs and troubleshooting',
    description:
      'Use the official guides first so your team can isolate whether an issue is setup, upgrade, or runtime related.',
  },
  {
    step: '2',
    title: 'Collect reproduction details',
    description:
      'Capture Rails, Ruby, Node, and Shakapacker versions plus failing commands to reduce turnaround time.',
  },
  {
    step: '3',
    title: 'Book implementation support',
    description:
      'When blockers remain, schedule time with ShakaCode maintainers for direct architecture and migration guidance.',
  },
];

const supportRows = [
  {
    feature: 'Core docs and upgrade guides',
    oss: 'Included',
    pro: 'Included',
  },
  {
    feature: 'Community issue/discussion channels',
    oss: 'Included',
    pro: 'Included',
  },
  {
    feature: 'Hands-on implementation support',
    oss: 'Self-service',
    pro: 'Available through ShakaCode services',
  },
  {
    feature: 'Migration planning for complex apps',
    oss: 'Self-service docs',
    pro: 'Direct maintainer guidance',
  },
  {
    feature: 'Performance/build pipeline review',
    oss: 'General guidance',
    pro: 'Project-specific recommendations',
  },
];

export default function ProPage(): ReactNode {
  return (
    <Layout title="Shakapacker Support" description="Support options for teams using Shakapacker">
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.kicker}>Open source docs with optional maintainer support</p>
            <h1>Shakapacker Support</h1>
            <p>
              Shakapacker is open source and fully usable without paid plans. For teams that need
              migration strategy, performance tuning, or production troubleshooting, ShakaCode
              offers direct implementation support.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs">
                Read the docs
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/troubleshooting">
                Open troubleshooting guide
              </Link>
              <Link className="button button--secondary button--lg" href="https://www.shakacode.com/contact/">
                Contact ShakaCode
              </Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.grid}>
            <article className={styles.policyCard}>
              <p className={styles.cardEyebrow}>Engagement flow</p>
              <h2>Three steps to get targeted help quickly.</h2>
              <ol className={styles.stepList}>
                {supportSteps.map((step) => (
                  <li key={step.step}>
                    <span className={styles.stepBadge}>{step.step}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>

            <article className={styles.policyCard}>
              <p className={styles.cardEyebrow}>Support model</p>
              <h2>Use community docs first, then pull in maintainers when needed.</h2>
              <p>
                The open-source docs and repository discussions cover the common setup and upgrade
                path.
              </p>
              <p>
                For project-specific constraints, email{' '}
                <a href="mailto:justin@shakacode.com">justin@shakacode.com</a> to arrange direct
                support.
              </p>
              <p className={styles.note}>
                ShakaCode focuses on practical implementation outcomes, not generic audits.
              </p>
            </article>
          </div>
        </section>

        <section className="container">
          <h2>Community vs Direct Support</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Open Source</th>
                  <th>ShakaCode Support</th>
                </tr>
              </thead>
              <tbody>
                {supportRows.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>{row.oss}</td>
                    <td>{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>
            Need implementation guidance for your app? Contact{' '}
            <a href="mailto:justin@shakacode.com">justin@shakacode.com</a>.
          </p>
        </section>
      </main>
    </Layout>
  );
}
