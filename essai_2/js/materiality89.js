// Initialiser la carte Leaflet
var map = L.map('map').setView([39.56939, 2.65024], 12);

// Chargement des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Groupe de clusters pour les marqueurs
var markers = L.markerClusterGroup();

// Fonction pour vérifier si c'est un parent (adulte)
function isParent(identifiant) {
    return identifiant.endsWith("_001"); // Par exemple, si l'identifiant se termine par "_001"
}

// Fonction pour récupérer les enfants par parent
function getChildrenByParent(parent) {
    var children = [];

    geojson_RAMA.features.forEach(function(feature) {
        if (feature.properties.Parent === parent) {
            children.push({
                name: feature.properties.Identifiant
                // Ajoutez d'autres propriétés d'enfants si nécessaires
            });
        }
    });

    return children;
}

// Fonction pour créer le contenu du carrousel pour les enfants
function createCarousel(parent) {
    var carouselContent = "<div class='carousel'>";
    carouselContent += "<div class='carousel-content'>";

    var children = getChildrenByParent(parent);
    children.forEach(function(child, index) {
        var displayStyle = index === 0 ? 'block' : 'none';

        carouselContent += "<div class='slide' style='display: " + displayStyle + ";'>";
        carouselContent += "<h3>" + parent + "</h3>"; // Utilisation de la valeur du parent comme titre
        carouselContent += "<p>Identifiant: " + child.name + "</p>";
        // Ajoutez d'autres informations sur les enfants ici
        carouselContent += "</div>";
    });

    carouselContent += "</div>";
    carouselContent += "<button class='carousel-prev' onclick='prevSlide(this)'>❮</button>";
    carouselContent += "<button class='carousel-next' onclick='nextSlide(this)'>❯</button>";
    carouselContent += "</div>";

    return carouselContent;
}

// Ajout des marqueurs à partir des données GeoJSON
geojson_RAMA.features.forEach(function(feature) {
    var coordinates = feature.geometry.coordinates;
    var identifiant = feature.properties.Identifiant;

    // Vérifier si c'est un parent (adulte)
    if (isParent(identifiant)) {
        var marker = L.marker([coordinates[1], coordinates[0]]);
        var parent = feature.properties.Parent;
        var popupContent = createCarousel(parent);

        marker.bindPopup(popupContent); // Liaison du popup au marqueur
        markers.addLayer(marker); // Ajout du marqueur au groupe de clusters
    }
});

// Ajout du groupe de clusters à la carte
map.addLayer(markers);

// Fonction pour passer à la diapositive précédente dans le carrousel
function prevSlide(button) {
    var carousel = button.parentNode.querySelector('.carousel-content');
    var slides = carousel.querySelectorAll('.slide');
    var currentSlide = Array.from(slides).findIndex(slide => slide.style.display !== 'none');
    var prevSlide = (currentSlide - 1 + slides.length) % slides.length;

    slides[currentSlide].style.display = 'none';
    slides[prevSlide].style.display = 'block';
}

// Fonction pour passer à la diapositive suivante dans le carrousel
function nextSlide(button) {
    var carousel = button.parentNode.querySelector('.carousel-content');
    var slides = carousel.querySelectorAll('.slide');
    var currentSlide = Array.from(slides).findIndex(slide => slide.style.display !== 'none');
    var nextSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].style.display = 'none';
    slides[nextSlide].style.display = 'block';

    // Réinitialiser le carrousel au premier slide si nous atteignons le dernier slide
    if (nextSlide === 0) {
        slides[0].style.display = 'block';
    }
}
