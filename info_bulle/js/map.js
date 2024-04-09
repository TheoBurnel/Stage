// Initialiser la carte
var map = L.map('map').setView([48.8566, 2.3522], 12);

// Ajouter la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Données des marqueurs avec carrousels
var markerData = [
    {
        "latlng": [48.8566, 2.3522],
        "parent": "Parent_001",
        "children": ["Child_001", "Child_002", "Child_003"]
    },
    {
        "latlng": [48.858, 2.349],
        "parent": "Parent_002",
        "children": ["Child_004", "Child_005", "Child_006"]
    }
];

// Ajouter des marqueurs à la carte
markerData.forEach(function(data) {
    var marker = L.marker(data.latlng).addTo(map);

    // Contenu de l'infobulle avec carrousel
    var carouselContent = "<div class='carousel'>";
    carouselContent += "<div class='carousel-content'>";
    data.children.forEach(function(child, index) {
        // Définir le style d'affichage initial pour les enfants (seul le premier est visible)
        var displayStyle = index === 0 ? 'block' : 'none';

        carouselContent += "<div class='slide' style='display: " + displayStyle + ";'>";
        carouselContent += "<h3>Parent: " + data.parent + "</h3>";
        carouselContent += "<p>Child: " + child + "</p>";
        carouselContent += "</div>";
    });
    carouselContent += "</div>";
    carouselContent += "<button class='carousel-prev' onclick='prevSlide(this)'>❮</button>";
    carouselContent += "<button class='carousel-next' onclick='nextSlide(this)'>❯</button>";
    carouselContent += "</div>";

    // Ajouter l'infobulle au marqueur
    marker.bindPopup(carouselContent);
});

// Fonctions pour contrôler le carrousel dans l'infobulle
function prevSlide(button) {
    var carousel = button.parentNode.querySelector('.carousel-content');
    var slides = carousel.querySelectorAll('.slide');
    var currentSlide = Array.from(slides).findIndex(slide => getComputedStyle(slide).display !== 'none');
    var prevSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].style.display = 'none';
    slides[prevSlide].style.display = 'block';

    // Réinitialiser le carrousel au premier enfant si nous atteignons le dernier enfant
    if (prevSlide === slides.length - 1) {
        slides[0].style.display = 'block';  // Afficher le premier enfant
    }
}

function nextSlide(button) {
    var carousel = button.parentNode.querySelector('.carousel-content');
    var slides = carousel.querySelectorAll('.slide');
    var currentSlide = Array.from(slides).findIndex(slide => getComputedStyle(slide).display !== 'none');
    var nextSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.display = 'none';
    slides[nextSlide].style.display = 'block';

    // Réinitialiser le carrousel au premier enfant si nous atteignons le dernier enfant
    if (nextSlide === 0) {
        slides[0].style.display = 'block';  // Afficher le premier enfant
    }
}
