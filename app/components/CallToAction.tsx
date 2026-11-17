export default function CallToAction() {
  return (
    <section className="ld-cta" aria-labelledby="cta-title">
      <img
        className="ld-cta__img"
        src="/images/latam_realista_medellin.png"
        alt="Lucha por transformar América Latina y el Caribe - Medellín"
      />
      <div className="ld-cta__shade" />
      <div className="ld-container ld-cta__body">
        <h2 id="cta-title" className="ld-cta__title">
          Juntos somos <span>imparables.</span>
        </h2>
        <p className="ld-cta__text">
          Hacia una lucha por transformar América Latina y el Caribe. Tu aporte llega donde el Estado no llega:
          asistencia, escuelas de talento y biofactorías en toda la región.
        </p>
        <div className="ld-hero__cta">
          <a href="/donaciones" className="ld-btn ld-btn--solid">Hacer una donación</a>
          <a href="/unete" className="ld-btn ld-btn--ghost">Quiero ser voluntario</a>
        </div>
      </div>
    </section>
  );
}
