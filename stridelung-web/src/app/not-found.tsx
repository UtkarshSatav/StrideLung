import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section page-top">
      <div className="wrap">
        <span className="eyebrow">404</span>
        <h1>That part isn’t in the register.</h1>
        <p className="lead">The register has 27 components, C01 to C27.</p>
        <Link className="btn primary" href="/components">Browse components</Link>
      </div>
    </section>
  );
}
