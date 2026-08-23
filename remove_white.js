const Jimp = require('jimp');

async function makeTransparent(input, output) {
  const image = await Jimp.read(input);
  
  // Define tolerance
  const tolerance = 30;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // If pixel is close to white (255, 255, 255)
    if (r > 255 - tolerance && g > 255 - tolerance && b > 255 - tolerance) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0
    }
  });

  await image.writeAsync(output);
  console.log('Processed', input);
}

async function run() {
  await makeTransparent('client/public/images/au_logo.png', 'client/public/images/au_logo.png');
  await makeTransparent('client/public/images/club_logo.png', 'client/public/images/club_logo.png');
}

run();
