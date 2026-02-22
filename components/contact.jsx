import React from "react";
import StripeButton from "./donate";

export const Contact = ({ data }) => {
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-4 contact-info">
            <div className="contact-item">
              <h3>Contactează-ne</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Adresa
                </span>
                {data?.gmaps && data?.address ? <a href={data.gmaps} className="footerLink">Targoviste, {data.address}</a> : ""}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Telefon
                </span>{" "}
                {data?.phone ? <a href={`tel:${data.phone}`} className="footerLink">{data.phone}</a> : ""}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {data?.email ? <a href={`mailto:${data.email}`} className="footerLink">{data.email}</a> : ""}
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <h3>Program</h3>
            <p>Miercuri de la 19:00</p>
            <p>Duminica de la 10:00</p>
          </div>
          <div className="col-md-4">
            <h3>Donează</h3>
            <p>{data?.donations?.name}</p>
            {data?.donations?.ron && <p>RON: {data.donations.ron}</p>}
            {data?.donations?.eur && <p>EUR: {data.donations.eur}</p>}
            {data?.donations?.usd && <p>USD: {data.donations.usd}</p>}
            <p>{data?.donations?.bank}</p>
            <p>{data?.donations?.swift}</p>
            <StripeButton />
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={data ? data.facebook : "/"} target="_blank" rel="noopener noreferrer">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href={data ? data.youtube : "/"} target="_blank" rel="noopener noreferrer">
                      <i className="fa fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="container text-center">
          <p>
            &copy; {new Date().getFullYear()} / All rights reserved. Biserica AVA.
          </p>
        </div>
      </div>
    </div>
  );
};
