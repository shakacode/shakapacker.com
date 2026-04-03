import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './pro.module.css';

const supportRows = [
  {
    feature: 'Documentation and issue tracker',
    oss: 'Public GitHub docs and issues',
    pro: 'Included',
  },
  {
    feature: 'Community help',
    oss: 'GitHub Discussions',
    pro: 'Included',
  },
  {
    feature: 'Direct implementation support',
    oss: 'No',
    pro: 'Available via ShakaCode services',
  },
  {
    feature: 'Migration guidance for complex apps',
    oss: 'Self-service docs',
    pro: 'Hands-on consulting available',
  },
  {
    feature: 'Sustained maintenance sponsorship',
    oss: 'Optional sponsorship',
    pro: 'Priority support options',
  },
];

export default function ProPage(): ReactNode {
  return (
    <Layout title="Shakapacker Support" description="Support options for teams using Shakapacker">
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <h1>Shakapacker Support</h1>
            <p>
              Start with the open-source docs and discussions. For teams that need guided migration
              or production hardening, ShakaCode provides direct support.
            </p>
            <div className={styles.actions}>
              <Link
                className="button button--primary button--lg"
                href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
                Book Free Assessment
              </Link>
              <Link className="button button--secondary button--lg" to="/docs">
                Read Documentation
              </Link>
              <Link
                className="button button--secondary button--lg"
                href="https://www.shakacode.com/contact/">
                Contact ShakaCode
              </Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.policyCard}>
            <h2>Support Model</h2>
            <p>
              Shakapacker is open source and fully usable without paid plans.
            </p>
            <p>
              If your team needs implementation help, performance tuning, or migration planning,{' '}
              <a href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
                book a complimentary 30-minute assessment
              </a>{' '}
              or email <a href="mailto:justin@shakacode.com">justin@shakacode.com</a>.
            </p>
          </div>
        </section>

        <section className="container">
          <h2>Community vs Direct Support</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Community</th>
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
            Need implementation guidance?{' '}
            <a href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
              Book a complimentary assessment
            </a>{' '}
            or reach out at <a href="mailto:justin@shakacode.com">justin@shakacode.com</a>.
          </p>
        </section>
      </main>
    </Layout>
  );
}
