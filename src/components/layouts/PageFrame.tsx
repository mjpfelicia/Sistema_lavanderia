import type { ReactNode } from 'react';
import BackToHome from '../buttons/BackToHome';
import './PageFrame.css';

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const PageFrame = ({ eyebrow, title, description, actions, children }: PageFrameProps) => {
  return (
    <div className="page-frame">
      <div className="page-frame-bg" aria-hidden="true">
        <div className="page-frame-blob blob-one"></div>
        <div className="page-frame-blob blob-two"></div>
        <div className="page-frame-grid"></div>
      </div>

      <main className="page-frame-shell">
        <section className="page-frame-hero">
          <div className="page-frame-topbar">
            <BackToHome variant="full" />
            {actions ? <div className="page-frame-actions">{actions}</div> : null}
          </div>

          <div className="page-frame-copy">
            <span className="page-frame-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>

        <section className="page-frame-surface">{children}</section>
      </main>
    </div>
  );
};

export default PageFrame;
