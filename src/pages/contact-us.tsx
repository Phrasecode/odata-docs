import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  card: {
    backgroundColor: 'var(--ifm-card-background-color)',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
    color: 'var(--ifm-color-primary)',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  link: {
    color: 'var(--ifm-link-color)',
    textDecoration: 'none',
  },
  aboutText: {
    lineHeight: '1.7',
    color: 'var(--ifm-font-color-base)',
  },
};

export default function ContactUs(): ReactNode {
  return (
    <Layout
      title="About & Contact"
      description="Learn about PhraseCode OData and get in touch with us."
    >
      <div style={styles.container}>
        <Heading as="h1">Contact Us</Heading>

        <div style={styles.grid}>
          {/* About Us Section */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>About Us</h2>
            <p style={styles.aboutText}>
              PhraseCode OData is a modern, type-safe OData v4 server library
              for Node.js. We're passionate about making API development simpler
              and more efficient.
            </p>
            <p style={styles.aboutText}>
              Our mission is to provide developers with powerful tools that
              integrate seamlessly with existing frameworks like Express.js and
              Next.js, enabling robust querying capabilities out of the box.
            </p>
          </div>

          {/* Contact Details Section */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Contact Us</h2>
            <div style={styles.contactItem}>
              <span>📧</span>
              <a href="mailto:hello@phrasecode.com" style={styles.link}>
                hello@phrasecode.com
              </a>
            </div>
            <div style={styles.contactItem}>
              <span>🐙</span>
              <a
                href="https://github.com/phrasecode/odata"
                style={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/phrasecode/odata
              </a>
            </div>
            <div style={styles.contactItem}>
              <span>💼</span>
              <a
                href="https://www.linkedin.com/company/phrasecode/"
                style={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
