import React from "react";
import GalleryT from "react-photo-gallery";

const photos = [
  {
    src: "https://lh5.googleusercontent.com/p/AF1QipPFfi5vhO2PWWpWVwhplH38-9rMJ5YGmJZ9PpO7=w203-h270-k-no",
    width: 203,
    height: 270
  },
  {
    src: "https://scontent.fotp3-1.fna.fbcdn.net/v/t39.30808-6/455259737_811251954451633_7740980740536108168_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=plQH6u_3NwEQ7kNvgEPrXz1&_nc_ht=scontent.fotp3-1.fna&oh=00_AYBqOYfyvPyxPRcNOSVOfczUncZOn_vaybKKN1ihdKCUrg&oe=66FF57F3",
    width: 203,
    height: 152
  },
  {
    src: "https://scontent.fotp3-4.fna.fbcdn.net/v/t39.30808-6/453475522_803425415234287_5786876002189269212_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GFLR6fuJyLgQ7kNvgHuMx0v&_nc_ht=scontent.fotp3-4.fna&_nc_gid=AlG0MDFykd-gGyRnOOcVIEo&oh=00_AYD5a-1hUn_eQpgNByJbG73rfs9uz1Ts4V0nts6v7h2PVg&oe=66FF35F8",
    width: 1,
    height: 1
  },
  {
    src: "https://scontent.fotp3-1.fna.fbcdn.net/v/t39.30808-6/453207361_803446708565491_3339535327783259891_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=rSPPRn8kZKUQ7kNvgEjIl1O&_nc_ht=scontent.fotp3-1.fna&_nc_gid=AS7XGtemLJwc-qSIWFlFIa9&oh=00_AYCr8oHlBHCJ6zjmYpcqSnpoQBXGAZaqFWWv9rIBD9SESQ&oe=66FF5FA2",
    width: 1.2,
    height: 1
  },
  {
    src: "https://scontent.fotp3-3.fna.fbcdn.net/v/t39.30808-6/453739102_808067234770105_1157817009729847679_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=RgQw2HSdpd4Q7kNvgE46mO0&_nc_ht=scontent.fotp3-3.fna&_nc_gid=AV_SxP5UVnTq_6UlCTm3JkI&oh=00_AYAh0RVxS_WTY-6lQRepcTkgeih4TRu8DFxIFmyeywoJYA&oe=66FF5337",
    width: 1.3,
    height: 2
  },
  {
    src: "https://scontent.fotp3-3.fna.fbcdn.net/v/t39.30808-6/454403287_808067478103414_3936541503369127315_n.jpg?stp=cp6_dst-jpg&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=E00pf4rkyCYQ7kNvgHJN_e5&_nc_ht=scontent.fotp3-3.fna&_nc_gid=Acx3iC7B-CMpb0BUWZTVG4N&oh=00_AYB0e1l0JWTRmQCWfgKUv0fi9USKStJeQ1G2KvbDpK3sWQ&oe=66FF5175",
    width: 2,
    height: 1
  },
  {
    src: "https://scontent.fotp3-4.fna.fbcdn.net/v/t39.30808-6/452661701_799500325626796_886690327183779803_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=3d2W_F8FBx4Q7kNvgH8Z3tJ&_nc_ht=scontent.fotp3-4.fna&_nc_gid=Ay75A1C6DMvY4UR48F2U1i8&oh=00_AYBTMVB1rEXlrCp4XmeeVb0PVaxIgLt_qPY7LM9NTnVyWQ&oe=66FF2D86",
    width: 1.3,
    height: 1
  },
  {
    src: "https://scontent.fotp3-1.fna.fbcdn.net/v/t39.30808-6/452650698_799500375626791_7305726618062283061_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=ADZ8mu-Ee-UQ7kNvgEofhyN&_nc_ht=scontent.fotp3-1.fna&_nc_gid=AriH9gTLyyDoQ47Gkv9vj41&oh=00_AYCRCrh3OmVfin9E5Mlls2GtdKjbq53NF6WIZ0d0XdX6mw&oe=66FF5DE4",
    width: 1.3,
    height: 2
  },
  {
    src: "https://scontent.fotp3-4.fna.fbcdn.net/v/t39.30808-6/447984986_771721648404664_4665258213539228868_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=8j3xwOlV3IoQ7kNvgGNLa0D&_nc_ht=scontent.fotp3-4.fna&oh=00_AYAIBdHY9nMxiAlDR9gl4AwmLVeI0nYdax6vNjM_VXSbiQ&oe=66FF451A",
    width: 1.2,
    height: 1
  },
  {
    src: "https://scontent.fotp3-4.fna.fbcdn.net/v/t39.30808-6/441263539_751184763791686_2911197260340646140_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=yKClBoVU3REQ7kNvgG6WInv&_nc_ht=scontent.fotp3-4.fna&_nc_gid=AeZQZiRHPxX4TW1tKMQkXjU&oh=00_AYBuSlg8xgWV_QZH86JEetoAGavsBYvKp-AmyfDgLjFhqA&oe=66FF358C",
    width: 1.2,
    height: 2
  },
  {
    src: "https://scontent.fotp3-3.fna.fbcdn.net/v/t39.30808-6/434351397_728331176077045_1859241114882723741_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=3zA1Yp5tWIEQ7kNvgEh3HGy&_nc_ht=scontent.fotp3-3.fna&_nc_gid=AayYIhY2Gs7GdGiZ6e0HiWn&oh=00_AYDFI9nqOHIG2fkaagazsSmZgLsuw1jsYHk_3pjcv2E_yw&oe=66FF582A",
    width: 3,
    height: 2.2
  },
  {
    src: "https://scontent.fotp3-3.fna.fbcdn.net/v/t39.30808-6/425677623_702265142016982_4289100293289392965_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=13ACsgv_0RMQ7kNvgFr5xX8&_nc_ht=scontent.fotp3-3.fna&_nc_gid=ACUT9CNvPh1ivFLas9pLGHl&oh=00_AYCxxlzRVN15Bg8JbjnkTFyiI2-vAnm0rINYZmAZWQw0Qw&oe=66FF4EC7",
    width: 1.5,
    height: 1
  }
];

export const Gallery = (props) => {
  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Comunitatea AVA</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>
        <GalleryT photos={photos} />;
      </div>
    </div>
  );
};

