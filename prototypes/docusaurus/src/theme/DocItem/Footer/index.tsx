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
      <aside className={styles.consultationCallout}>
        <p className={styles.calloutHeading}>Get free expert advice on your Shakapacker setup</p>
        <p className={styles.calloutBody}>
          ShakaCode maintains Shakapacker and helps teams migrate, tune build performance, and
          stabilize production deploys. Book a complimentary 30-minute call for direct guidance.
        </p>
        <a
          className={styles.calloutLink}
          href="https://meetings.hubspot.com/justingordon/30-minute-consultation">
          Book a free call
        </a>
      </aside>
    </>
  );
}
