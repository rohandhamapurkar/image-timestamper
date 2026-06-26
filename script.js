const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

function escapePangoText(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function addModifiedTimeToImage(inputPath, outputPath) {
  try {
    // Get file stats to retrieve modified time
    const stats = await fs.stat(inputPath);
    const modifiedTime = stats.mtime;

    // Format the date/time string
    const timeString = modifiedTime.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
    const timestampLabel = `${timeString} UTC+0000`;

    // Get image metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate text position (bottom-right corner with padding)
    const padding = 20;
    const fontSize = Math.max(16, Math.min(metadata.width / 30, 48)); // Responsive font size

    // Render text first, then place it using the real rasterized dimensions.
    const bgPadding = 7; // Balanced padding inside the background rectangle
    const textOverlay = sharp({
      text: {
        text: `<span foreground="black">${escapePangoText(timestampLabel)}</span>`,
        font: `Arial Bold ${Math.round(fontSize)}px`,
        rgba: true,
        wrap: 'none',
      },
    });
    const textMetadata = await textOverlay.metadata();
    const textBuffer = await textOverlay.png().toBuffer();

    const backgroundWidth = textMetadata.width + bgPadding * 2;
    const backgroundHeight = textMetadata.height + bgPadding * 2;
    const overlayLeft = metadata.width - padding - backgroundWidth;
    const overlayTop = metadata.height - padding - backgroundHeight;

    const backgroundBuffer = await sharp({
      create: {
        width: backgroundWidth,
        height: backgroundHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0.95 },
      },
    })
      .png()
      .toBuffer();

    // Apply the text overlay to the image
    await image
      .composite([
        {
          input: backgroundBuffer,
          top: overlayTop,
          left: overlayLeft,
        },
        {
          input: textBuffer,
          top: overlayTop + bgPadding,
          left: overlayLeft + bgPadding,
        },
      ])
      .jpeg({ quality: 90 }) // Adjust quality as needed
      .toFile(outputPath);

    console.log(`✅ Successfully added timestamp to image: ${outputPath}`);
    console.log(`📅 Modified time: ${timestampLabel}`);
  } catch (error) {
    console.error(`❌ Error processing image: ${error.message}`);
    throw error;
  }
}

// Batch process multiple images
async function processMultipleImages(inputDir, outputDir) {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Read all files in input directory
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|webp|tiff)$/i.test(file)
    );

    console.log(`📸 Found ${imageFiles.length} image files to process`);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `${file}`);

      console.log(`\n🔄 Processing: ${file}`);
      await addModifiedTimeToImage(inputPath, outputPath);
    }

    console.log(
      `\n🎉 Batch processing complete! Processed ${imageFiles.length} images`
    );
  } catch (error) {
    console.error(`❌ Batch processing error: ${error.message}`);
  }
}

// Command line usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📸 Image Timestamp Tool

Usage:
  Single image: node script.js <input-image> [output-image]
  Batch process: node script.js --batch <input-dir> <output-dir>

Examples:
  node script.js photo.jpg photo_with_time.jpg
  node script.js --batch ./photos ./photos_with_timestamps
    `);
    return;
  }

  if (args[0] === '--batch') {
    if (args.length < 3) {
      console.error('❌ Batch mode requires input and output directories');
      return;
    }
    await processMultipleImages(args[1], args[2]);
  } else {
    const inputPath = args[0];
    const outputPath = args[1] || `timestamped_${path.basename(inputPath)}`;
    await addModifiedTimeToImage(inputPath, outputPath);
  }
}

// Export functions for use as module
module.exports = {
  addModifiedTimeToImage,
  processMultipleImages,
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
