const WORDS = [
  'Acción humanitaria',
  'Servicios esenciales',
  'Desarrollo comunitario',
  'Derechos e integración',
  'Cien naciones',
  'Un solo corazón',
];

export default function Ticker() {
  const items = [...WORDS, ...WORDS];
  return (
    <section className="ld-ticker" aria-hidden="true">
      <div className="ld-ticker__track">
        {items.map((word, i) => (
          <span key={i} className="ld-ticker__item">
            {word} <span className="ld-ticker__star">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
