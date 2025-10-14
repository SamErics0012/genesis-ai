import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Welcome page of documentation"
    >
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          textAlign: 'center',
        }}
      >
        <h1>👋 Welcome to Solver Corp Documentation</h1>
        <h2>Follow us to more info</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
        }}>
          <a href='https://potarastudio.com/' style={{textDecoration: 'underline', cursor: 'pointer'}}>Website</a>
          <a href='https://dribbble.com/potarastudio' style={{textDecoration: 'underline', cursor: 'pointer'}}>Dribble</a>
          <a href='https://ui8.net/potara-studio-cad0c3/products' style={{textDecoration: 'underline', cursor: 'pointer'}}>UI8</a>
          <a href='https://www.behance.net/potarastudio' style={{textDecoration: 'underline', cursor: 'pointer'}}>Behance</a>
          <a href='https://www.instagram.com/potarastudio' style={{textDecoration: 'underline', cursor: 'pointer'}}>Instagaram</a>
          <a href='https://x.com/potarastudioM' style={{textDecoration: 'underline', cursor: 'pointer'}}>Twitter</a>
        </div>
      </main>
    </Layout>
  );
}
