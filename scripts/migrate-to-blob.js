// This script provides a mapping of original image paths to their Blob URLs
// You can use this to update your image references in the code

const imageMapping = {
  // Projects
  '/revisiondojo.png': 'https://your-blob-url/revisiondojo.png',
  '/tensorforest.jpg': 'https://your-blob-url/tensorforest.jpg',
  '/performativepurity.png': 'https://your-blob-url/performativepurity.png',
  '/doeve.png': 'https://your-blob-url/doeve.png',
  '/coachbob.jpg': 'https://your-blob-url/coachbob.jpg',
  '/teenbuildersclub.jpg': 'https://your-blob-url/teenbuildersclub.jpg',
  '/vex.jpg': 'https://your-blob-url/vex.jpg',
  '/vibetype.png': 'https://your-blob-url/vibetype.png',
  '/shoppy.png': 'https://your-blob-url/shoppy.png',
  // Polaroids
  '/polaroids/the start of something big.png': 'https://your-blob-url/polaroids/the-start-of-something-big.png',
  '/polaroids/apogreg.png': 'https://your-blob-url/polaroids/apogreg.png',
  '/polaroids/lost in toronto.png': 'https://your-blob-url/polaroids/lost-in-toronto.png',
  // ... and so on
}

console.log('Image mapping generated. Update your code with these Blob URLs.')
console.log(JSON.stringify(imageMapping, null, 2))
