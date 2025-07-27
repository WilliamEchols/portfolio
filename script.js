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
    console.log(`╔═════════════════════════════════════════╗\n║ I don't know what you are looking for,  ║\n║ but here's a cat:                       ║\n║                                         ║\n║                 /\\_/\\                   ║\n║                 >^,^<                   ║\n║                  / \\                    ║\n║                 (___)_/                 ║\n║                                         ║\n╚═════════════════════════════════════════╝`);

    const intro = document.getElementById('intro');
    if (intro) {
        let rotateX = 0;
        let rotateY = 0;
        let targetX = 0;
        let targetY = 0;
        const easing = 0.1;

        function animate() {
            rotateX += (targetX - rotateX) * easing;
            rotateY += (targetY - rotateY) * easing;
            intro.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            requestAnimationFrame(animate);
        }

        intro.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = intro.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            targetY = (x / width - 0.5) * 30;
            targetX = (0.5 - y / height) * 30;
        });

        intro.addEventListener('mouseenter', function() {
            intro.style.transition = 'none';
        });

        intro.addEventListener('mouseleave', function() {
            intro.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            targetX = 0;
            targetY = 0;
            rotateX = 0;
            rotateY = 0;
            intro.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
        
        requestAnimationFrame(animate);
    }
});
