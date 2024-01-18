import { writeFileSync } from "fs";
import { basename, extname } from "path";
import sharp from "sharp";

async function main() {
  if (process.argv.length < 3) {
    console.log(
      "Usage: node index.js <sourceFile> <wantedRatio>\nExample: node index.js image.png 16/9"
    );
    process.exit(1);
  }

  // Get the source file and wanted ratio from the command line arguments
  const sourceFile = process.argv[2];
  const wantedRatio = (process.argv[3] ? process.argv[3] : 16 / 9).toFixed(2);

  // Get the original image dimensions
  let { width, height } = await sharp(sourceFile)
    .metadata()
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

  // Check if the original ratio is larger than the wanted ratio
  const isRatioLarger = (width / height).toFixed(2) > wantedRatio;

  // If the original ratio is larger than the wanted ratio, we need to reduce the width
  // Otherwise, we need to reduce the height
  height = isRatioLarger ? height : Math.round(width / wantedRatio);
  width =
    isRatioLarger > wantedRatio ? Math.round(height * wantedRatio) : width;

  // Resize the image
  const newImage = await sharp(sourceFile)
    .resize(width, height)
    .toBuffer()
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

  // Save the new image
  const destinationFile =
    basename(sourceFile, extname(sourceFile)) + `_${wantedRatio}.png`;
  writeFileSync(destinationFile, newImage);
}

main();
