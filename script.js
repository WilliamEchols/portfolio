const quotes = [
    {
        text: "Mathematics is a game played according to certain simple rules with meaningless marks on paper.",
        author: "David Hilbert"
    },
    {
        text: "The shortest path between two truths in the real domain passes through the complex domain.",
        author: "Jacques Hadamard"
    },
    {
      text: "Mathematics, rightly viewed, possesses not only truth, but supreme beauty - a beauty cold and austere, like that of sculpture, without appeal to any part of our weaker nature, without the gorgeous trappings of painting or music, yet sublimely pure, and capable of a stern perfection such as only the greatest art can show.",
      author: "Bertrand Russell"
    },
    {
      text: "Mathematics reveals its secrets only to those who approach it with pure love, for its own beauty.",
      author: "Archimedes"
    },
]; 

const images = [
    "berkeley-675.png",
];

function displayRandomQuote() {
    const quoteElement = document.querySelector('blockquote p');
    const citeElement = document.querySelector('blockquote cite');
    
    if (quoteElement && citeElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteElement.textContent = `"${randomQuote.text}"`;
        citeElement.textContent = `— ${randomQuote.author}`;
    }
}

function displayRandomImage() {
  const imageElement = document.querySelector('img.header-image');
  
  if (imageElement) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const randomImage = images[randomIndex];
      imageElement.src = "assets/" + randomImage;
  }
}

document.addEventListener('DOMContentLoaded', function() {
    displayRandomQuote();
    displayRandomImage();
    console.log(`╔═════════════════════════════════════════╗\n║ I don't know what you are looking for,  ║\n║ but here's a cat:                       ║\n║                                         ║\n║                 /\\\_/\\                   ║\n║                 >^,^<                   ║\n║                  / \\                    ║\n║                 (___)_/                 ║\n║                                         ║\n╚═════════════════════════════════════════╝`);
});
