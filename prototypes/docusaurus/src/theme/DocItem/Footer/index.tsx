import type {ReactNode} from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';

import styles from './styles.module.css';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  return (
    <>
      <Footer {...props} />
      <aside className={styles.assessmentCallout}>
        <p className={styles.calloutHeading}>Need expert help with your Shakapacker setup?</p>
        <p className={styles.calloutBody}>
          ShakaCode maintains Shakapacker and helps Rails teams migrate to Rspack, speed up build
          pipelines, and stabilize production deploys.
        </p>
        <a
          className={styles.calloutLink}
          href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
          Book a complimentary 30-minute assessment
        </a>
      </aside>
    </>
  );
}
