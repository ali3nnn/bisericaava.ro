import React from "react";

const Maps = () => {
  return (
    <section id="maps" className="section section--alt">
      <div className="container">
        <div className="maps__card" data-reveal>
          <div className="maps__text">
            <span className="eyebrow">Ne găsești aici</span>
            <h2>Te așteptăm!</h2>
            <p>
              Locația se află în clădirea din spatele complexului Spring. Se poate
              ajunge din str. Tudor Vladimirescu sau din str. Tineretului.
            </p>
          </div>
          <div className="maps__frame">
            <iframe
              title="Locația Bisericii AVA pe Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462.94569279954135!2d25.445638224682636!3d44.92638926722481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b2f73f20b2a6c3%3A0x96dac8fefcb225cf!2sBiserica%20Crestina%20Baptista%20AVA!5e0!3m2!1sro!2sro!4v1727376530248!5m2!1sro!2sro"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Maps;
