# Image Timestamp Tool 📸

A Node.js tool that automatically adds file modification timestamps to images. Perfect for adding date/time stamps to photos while preserving image quality.

## Features ✨

- **Automatic Timestamp Overlay**: Adds file modification date/time to images
- **Responsive Text Sizing**: Font size adapts to image dimensions
- **Professional Styling**: White background with shadow for readability
- **Batch Processing**: Process entire directories of images at once
- **Multiple Formats**: Supports JPG, JPEG, PNG, WebP, and TIFF
- **High Quality Output**: Maintains image quality with 90% JPEG compression
- **Command Line Interface**: Easy to use from terminal/command prompt

## Installation 🚀

### Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

### Setup

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage 📋

### Single Image Processing

Process a single image and specify output filename:

```bash
node script.js input.jpg output.jpg
```

Process a single image with auto-generated output name:

```bash
node script.js photo.jpg
# Creates: timestamped_photo.jpg
```

### Batch Processing

Process all images in a directory:

```bash
node script.js --batch ./input-folder ./output-folder
```

Example:

```bash
node script.js --batch ./vacation-photos ./photos-with-timestamps
```

### Help

Display usage information:

```bash
node script.js
```

## Supported File Formats 📁

- **JPEG/JPG** - Most common photo format
- **PNG** - Lossless format with transparency support
- **WebP** - Modern web format
- **TIFF** - High-quality format

## How It Works 🔧

1. **File Analysis**: Reads the file's modification timestamp
2. **Image Processing**: Uses Sharp library for high-performance image manipulation
3. **Text Overlay**: Creates an SVG overlay with:
   - White semi-transparent background
   - Black text for contrast
   - Drop shadow for depth
   - Responsive font sizing
4. **Output**: Saves the processed image with timestamp overlay

## Timestamp Format 📅

The tool uses the following timestamp format:

```
MM/DD/YYYY, HH:MM:SS
```

Example: `08/02/2025, 14:30:45`

## Technical Details 🛠️

### Dependencies

- **sharp**: High-performance image processing library
- **fs.promises**: File system operations
- **path**: File path utilities

### Image Processing

- **Quality**: 90% JPEG compression for optimal balance
- **Position**: Bottom-right corner with responsive padding
- **Font**: Arial sans-serif for maximum compatibility
- **Background**: Semi-transparent white with rounded corners

### Performance

- Efficient memory usage with Sharp's streaming API
- Batch processing with sequential file handling
- Error handling for corrupted or unsupported files

## Examples 📷

### Before and After

- **Input**: `vacation_photo.jpg` (modified: Aug 2, 2025, 2:30 PM)
- **Output**: Same image with "08/02/2025, 14:30:45" timestamp in bottom-right corner

### Directory Structure Example

```
project/
├── script.js
├── package.json
├── README.md
├── input-photos/
│   ├── photo1.jpg
│   ├── photo2.png
│   └── photo3.jpg
└── output-photos/
    ├── photo1.jpg (with timestamp)
    ├── photo2.png (with timestamp)
    └── photo3.jpg (with timestamp)
```

## API Usage 📦

You can also use this tool as a Node.js module:

```javascript
const {
  addModifiedTimeToImage,
  processMultipleImages,
} = require('./script.js');

// Process single image
await addModifiedTimeToImage('input.jpg', 'output.jpg');

// Process multiple images
await processMultipleImages('./input-dir', './output-dir');
```

## Error Handling ⚠️

The tool includes comprehensive error handling for:

- Invalid file paths
- Unsupported image formats
- Corrupted image files
- Permission issues
- Disk space problems

## Troubleshooting 🔍

### Common Issues

**"Module not found" error**

```bash
npm install
```

**"Permission denied" error**

- Check file/directory permissions
- Run with administrator privileges if needed

**"Unsupported format" error**

- Ensure file is a supported image format
- Check file extension matches actual format

**Out of memory errors**

- Process images in smaller batches
- Use lower quality settings for very large images

## Development 🛠️

### Code Quality Tools

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check

# Run both linting and format check
npm run precommit
```

### Project Structure

```
project/
├── script.js           # Main application file
├── package.json        # Dependencies and scripts
├── eslint.config.mjs   # ESLint configuration
├── .prettierrc         # Prettier configuration
├── .prettierignore     # Prettier ignore rules
└── README.md           # Project documentation
```

### Development Workflow

1. Make your code changes
2. Run `npm run format` to format your code
3. Run `npm run lint` to check for issues
4. Fix any linting errors
5. Test your changes with sample images

## Contributing 🤝

Feel free to submit issues, feature requests, or pull requests to improve this tool.

## License 📄

ISC License - Feel free to use and modify as needed.

## Changelog 📝

### Version 1.0.0

- Initial release
- Single image processing
- Batch processing support
- Command line interface
- Module export functionality

---

**Happy timestamping! 📸✨**
