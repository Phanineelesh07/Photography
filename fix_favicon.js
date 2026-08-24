const { Jimp } = require('jimp');

async function processFavicon() {
  try {
    const image = await Jimp.read('client/public/favicon.png');
    
    // Iterate through all pixels to find white and make it transparent,
    // and make dark pixels white so they appear on dark tabs
    image.scan((x, y, idx) => {
      const red = image.bitmap.data[idx + 0];
      const green = image.bitmap.data[idx + 1];
      const blue = image.bitmap.data[idx + 2];
      
      // If close to white, make transparent
      if (red > 240 && green > 240 && blue > 240) {
        image.bitmap.data[idx + 3] = 0; // Alpha to 0
      } 
      // If dark, make it white (so it contrasts against browser dark themes)
      else if (red < 100 && green < 100 && blue < 100) {
        image.bitmap.data[idx + 0] = 255;
        image.bitmap.data[idx + 1] = 255;
        image.bitmap.data[idx + 2] = 255;
        // Keep original alpha
      }
    });

    // Autocrop the transparent borders to make the logo fill the space
    image.autocrop();

    await image.write('client/public/favicon.png');
    console.log('Favicon processed successfully.');
  } catch (error) {
    console.error('Error processing favicon:', error);
  }
}

processFavicon();
