const Jimp = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('client/public/images/club_logo.png');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is roughly white, make it completely transparent
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0; // Alpha to 0
      } else {
        // Otherwise, it's the black/gold logo. Let's make it pure white!
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
      }
    });

    await image.writeAsync('client/public/images/club_logo_white.png');
    console.log('Image successfully processed and saved as club_logo_white.png');
  } catch (err) {
    console.error(err);
  }
}

processImage();
