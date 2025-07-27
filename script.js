function displayRandomImage() {
  const imageElement = document.querySelector('img.header-image');
  
  if (imageElement) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const randomImage = images[randomIndex];
      imageElement.src = "assets/" + randomImage;
  }
}

document.addEventListener('DOMContentLoaded', function() {
    displayRandomImage();
    console.log(`╔═════════════════════════════════════════╗\n║ I don't know what you are looking for,  ║\n║ but here's a cat:                       ║\n║                                         ║\n║                 /\\\_/\\                   ║\n║                 >^,^<                   ║\n║                  / \\                    ║\n║                 (___)_/                 ║\n║                                         ║\n╚═════════════════════════════════════════╝`);
});
