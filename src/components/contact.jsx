import React from "react";

export const Contact = (props) => {

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
                {props?.data?.gmaps && props?.data?.address ? <a href={props.data.gmaps} className="footerLink">Targoviste, {props.data.address}</a> : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Telefon
                </span>{" "}
                {props?.data?.phone ? <a href={props.data.phone} className="footerLink">{props.data.phone}</a> : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props?.data?.email ? <a href={props.data.email} className="footerLink">{props.data.email}</a> : "loading"}
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
            <p>{props?.data?.donations?.name}</p>
            {props?.data?.donations?.ron && <p>RON: {props.data.donations.ron}</p>}
            {props?.data?.donations?.eur && <p>EUR: {props.data.donations.eur}</p>}
            {props?.data?.donations?.usd && <p>USD: {props.data.donations.usd}</p>}
            <p>{props?.data?.donations?.bank}</p>
            <p>{props?.data?.donations?.swift}</p>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"} target="blank_">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.youtube : "/"} target="blank_">
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
            &copy; {(new Date()).getYear() + 1900} / All rights reversed. Biserica AVA.
          </p>
        </div>
      </div>
    </div>
  );
};
