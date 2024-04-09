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
        carouselContent += "<p class='slidebar-link' onclick='showSlidebar()'>Lien vers la slidebar</p>"; // Ajouter une classe au lien
        carouselContent += "</div>";
    });
    carouselContent += "</div>";
    carouselContent += "<button class='carousel-prev' onclick='prevSlide(this)'>❮</button>";
    carouselContent += "<button class='carousel-next' onclick='nextSlide(this)'>❯</button>";
    carouselContent += "</div>";

    // Ajouter l'infobulle au marqueur
    marker.bindPopup(carouselContent);
});

function showSlidebar() {
    // Créer un élément de slidebar
    var slidebar = document.createElement('div');
    slidebar.className = 'slidebar';
    slidebar.innerHTML = 'Contenu de la slidebar ici'; // Contenu de la slidebar

    // Ajouter la slidebar à l'élément body (ou à un autre conteneur approprié)
    document.body.appendChild(slidebar);

    // Appliquer des styles CSS pour positionner et styliser la slidebar
    slidebar.style.position = 'fixed';        // Utiliser un positionnement fixe par rapport à la fenêtre
    slidebar.style.top = '0';                  // Positionner la slidebar en haut de la fenêtre
    slidebar.style.right = '0';                // Positionner la slidebar tout à droite
    slidebar.style.width = '300px';            // Définir la largeur de la slidebar
    slidebar.style.height = '100vh';           // Définir la hauteur de la slidebar
    slidebar.style.backgroundColor = '#ffffff'; // Couleur de fond de la slidebar (blanc)
    slidebar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)'; // Ombre légère pour la slidebar
    slidebar.style.zIndex = '1000';            // Assurer que la slidebar est au-dessus de la carte
    slidebar.style.overflowY = 'auto';         // Ajouter une barre de défilement si nécessaire

    // Styles pour le contenu de la slidebar
    slidebar.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 10px;">Titre de la Slidebar</h2>
            <p>Contenu de la slidebar ici...</p>
            <p>Vous pouvez personnaliser le contenu selon vos besoins.</p>
        </div>
    `;

    // Déplacer la slidebar vers la position visible avec une animation
    setTimeout(function() {
        slidebar.style.transform = 'translateX(0)';
    }, 100); // Délai pour démarrer l'animation
}



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
