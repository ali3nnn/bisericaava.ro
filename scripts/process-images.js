const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMG_DIR = path.join(__dirname, "..", "public", "img");
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"];
const MAX_DIMENSION = 1920;

const convertToWebp = process.argv.includes("--webp");

async function processImages() {
  const files = fs.readdirSync(IMG_DIR);

  const targetExtensions = convertToWebp ? EXTENSIONS : [...EXTENSIONS, ".webp"];
  const toProcess = files.filter((f) =>
    targetExtensions.includes(path.extname(f).toLowerCase())
  );

  if (toProcess.length === 0) {
    console.log("No images found to process.");
    return;
  }

  const mode = convertToWebp ? "Converting to webp" : "Reducing size";
  console.log(`${mode} for ${toProcess.length} image(s)...\n`);

  for (const file of toProcess) {
    const inputPath = path.join(IMG_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const outputPath = convertToWebp
      ? path.join(IMG_DIR, `${path.parse(file).name}.webp`)
      : path.join(IMG_DIR, `${path.parse(file).name}_opt${ext}`);

    try {
      const metadata = await sharp(inputPath).metadata();
      let pipeline = sharp(inputPath);

      if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        pipeline = pipeline.resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      if (convertToWebp) {
        await pipeline.webp({ quality: 80 }).toFile(outputPath);
      } else if (ext === ".webp") {
        await pipeline.webp({ quality: 80 }).toFile(outputPath);
      } else if (ext === ".png") {
        await pipeline.png({ quality: 80, compressionLevel: 9 }).toFile(outputPath);
      } else {
        await pipeline.jpeg({ quality: 80 }).toFile(outputPath);
      }

      const originalSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

      fs.unlinkSync(inputPath);
      if (!convertToWebp) {
        fs.renameSync(outputPath, inputPath);
      }

      const outputName = convertToWebp ? `${path.parse(file).name}.webp` : file;
      console.log(
        `  ${file} -> ${outputName} (${(originalSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB, -${reduction}%)`
      );
    } catch (err) {
      console.error(`  Failed to process ${file}: ${err.message}`);
    }
  }

  console.log("\nDone.");
}

processImages();
