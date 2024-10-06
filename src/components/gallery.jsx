import React from "react";
import GalleryT from "react-photo-gallery";

const photos = [
  {
    src: "https://lh5.googleusercontent.com/p/AF1QipPFfi5vhO2PWWpWVwhplH38-9rMJ5YGmJZ9PpO7=w203-h270-k-no",
    width: 203,
    height: 270
  },
  {
    src: "img/1.webp",
    width: 4032,
    height: 3024
  },
  {
    src: "img/2.webp",
    width: 2048,
    height: 1536
  },
  {
    src: "img/3.webp",
    width: 2048,
    height: 1536
  },
  {
    src: "img/4.webp",
    width: 2048,
    height: 1536
  },
  {
    src: "img/5.webp",
    width: 1600,
    height: 1200
  },
  {
    src: "img/6.webp",
    width: 4032,
    height: 3024
  }
];

export const Gallery = (props) => {
  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Comunitatea AVA</h2>
          <p>
          Comunitatea oamenilor născuți din nou, care au ca temelie Biblia și ca scop glorificarea lui Dumnezeu.
          </p>
        </div>
        <GalleryT photos={photos} />
      </div>
    </div>
  );
};

