import React from "react";
import StripeButton from "../components/donate";

export const Contact = (props) => {
  return (
    <>
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact__grid">
            <div className="contact__col">
              <h3>Contactează-ne</h3>

              <div className="contact__item">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
                <p>
                  <span className="label">Adresă</span>
                  {props?.data?.gmaps && props?.data?.address ? (
                    <a href={props.data.gmaps}>Târgoviște, {props.data.address}</a>
                  ) : (
                    "loading"
                  )}
                </p>
              </div>

              <div className="contact__item">
                <i className="fa fa-phone" aria-hidden="true"></i>
                <p>
                  <span className="label">Telefon</span>
                  {props?.data?.phone ? (
                    <a href={`tel:${props.data.phone.replace(/\s/g, "")}`}>{props.data.phone}</a>
                  ) : (
                    "loading"
                  )}
                </p>
              </div>

              <div className="contact__item">
                <i className="fa fa-envelope-o" aria-hidden="true"></i>
                <p>
                  <span className="label">Email</span>
                  {props?.data?.email ? (
                    <a href={`mailto:${props.data.email}`}>{props.data.email}</a>
                  ) : (
                    "loading"
                  )}
                </p>
              </div>

              <div className="social">
                <a
                  href={props.data ? props.data.facebook : "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <i className="fa fa-facebook" aria-hidden="true"></i>
                </a>
                <a
                  href={props.data ? props.data.youtube : "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <i className="fa fa-youtube" aria-hidden="true"></i>
                </a>
              </div>
            </div>

            <div className="contact__col">
              <h3>Program</h3>
              <p>Miercuri, de la 19:00</p>
              <p>Duminică, de la 10:00</p>
            </div>

            <div className="contact__col">
              <h3>Donează</h3>
              <p>{props?.data?.donations?.name}</p>
              {props?.data?.donations?.ron && (
                <p className="bank-detail">RON: {props.data.donations.ron}</p>
              )}
              {props?.data?.donations?.eur && (
                <p className="bank-detail">EUR: {props.data.donations.eur}</p>
              )}
              {props?.data?.donations?.usd && (
                <p className="bank-detail">USD: {props.data.donations.usd}</p>
              )}
              <p className="bank-detail">{props?.data?.donations?.bank}</p>
              <p className="bank-detail">{props?.data?.donations?.swift}</p>
              <div className="contact__stripe">
                <StripeButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="site-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Biserica AVA. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </>
  );
};
