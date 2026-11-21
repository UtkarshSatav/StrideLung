import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section page-top not-found-panel">
      <div className="wrap">
        <header className="section-head">
          <span className="eyebrow">404</span>
          <h1>Page not found</h1>
          <p className="lead">Browse the 27 components in the StrideLung register.</p>
        </header>
        <Link className="btn primary" href="/components">Browse components</Link>
      </div>
    </section>
  );
}
