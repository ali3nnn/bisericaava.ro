import React, { useState, useEffect, useCallback } from "react";

const photos = [
  { src: "img/tort.webp", alt: "Sărbătoare în comunitatea AVA" },
  { src: "img/1.webp", alt: "Părtășie la Biserica AVA" },
  { src: "img/2.webp", alt: "Întâlnire a comunității AVA" },
  { src: "img/3.webp", alt: "Membri ai Bisericii AVA" },
  { src: "img/4.webp", alt: "Activitate a Bisericii AVA" },
  { src: "img/5.webp", alt: "Comunitatea AVA împreună" },
  { src: "img/6.webp", alt: "Eveniment la Biserica AVA" },
];

export const Gallery = (props) => {
  const [active, setActive] = useState(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  return (
    <section id="portfolio" className="section">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Galerie</span>
          <h2 className="section-title">Comunitatea AVA</h2>
          <p className="section-lead">
            Oameni născuți din nou, având ca temelie Biblia și ca scop glorificarea lui Dumnezeu.
          </p>
        </div>

        <div className="gallery__grid" data-reveal>
          {photos.map((photo, i) => (
            <button
              type="button"
              key={photo.src}
              className="gallery__item"
              onClick={() => setActive(i)}
              aria-label={`Mărește imaginea: ${photo.alt}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button className="lightbox__close" aria-label="Închide" onClick={close}>
            ✕
          </button>
          <img
            src={photos[active].src}
            alt={photos[active].alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};
