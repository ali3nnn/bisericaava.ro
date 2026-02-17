const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMG_DIR = path.join(__dirname, "..", "public", "img");
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"];

async function convertToWebp() {
  const files = fs.readdirSync(IMG_DIR);
  const toConvert = files.filter((f) =>
    EXTENSIONS.includes(path.extname(f).toLowerCase())
  );

  if (toConvert.length === 0) {
    console.log("No non-webp images found to convert.");
    return;
  }

  console.log(`Converting ${toConvert.length} image(s) to webp...\n`);

  for (const file of toConvert) {
    const inputPath = path.join(IMG_DIR, file);
    const outputPath = path.join(
      IMG_DIR,
      `${path.parse(file).name}.webp`
    );

    try {
      await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
      fs.unlinkSync(inputPath);
      console.log(`  ${file} -> ${path.parse(file).name}.webp`);
    } catch (err) {
      console.error(`  Failed to convert ${file}: ${err.message}`);
    }
  }

  console.log("\nDone.");
}

convertToWebp();
