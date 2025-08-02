const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

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
    });

    // Get image metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Calculate text position (bottom-right corner with padding)
    const padding = 20;
    const fontSize = Math.max(16, Math.min(metadata.width / 30, 48)); // Responsive font size

    // Calculate text dimensions for proper background sizing
    const textWidth = timeString.length * fontSize * 0.52; // Balanced text width
    const textHeight = fontSize;
    const bgPadding = 7; // Balanced padding inside the background rectangle

    // Create SVG text overlay with white background
    const textSvg = `
      <svg width="${metadata.width}" height="${metadata.height}">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="black" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- White background rectangle -->
        <rect x="${metadata.width - padding - textWidth - bgPadding * 2}" 
              y="${metadata.height - padding - textHeight - bgPadding}" 
              width="${textWidth + bgPadding * 2}" 
              height="${textHeight + bgPadding * 2}" 
              fill="white" 
              fill-opacity="0.95"
              rx="4" 
              ry="4"
              filter="url(#shadow)"/>
        <!-- Black text -->
        <text x="${metadata.width - padding - bgPadding}" 
              y="${metadata.height - padding - bgPadding / 2}" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize}" 
              fill="black" 
              font-weight="bold"
              text-anchor="end" 
              dominant-baseline="baseline">
          ${timeString}
        </text>
      </svg>
    `;

    // Apply the text overlay to the image
    await image
      .composite([
        {
          input: Buffer.from(textSvg),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 90 }) // Adjust quality as needed
      .toFile(outputPath);

    console.log(`✅ Successfully added timestamp to image: ${outputPath}`);
    console.log(`📅 Modified time: ${timeString}`);
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
