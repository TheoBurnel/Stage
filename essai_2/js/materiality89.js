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
                name: feature.properties.Identifiant,
                caracteristique: feature.properties.Caracteristique,
                technique: feature.properties.Technique,
                materiaux: feature.properties.Materiaux
                // couleur: feature.properties.Couleur,
                // Ajoutez d'autres propriétés d'enfants si nécessaires
            });
        }
    });

    return children;
}

// Fonction pour créer le contenu du carrousel pour les enfants
function createCarousel(parent, identifiant) {
    var carouselContent = "<div class='carousel'>";
    carouselContent += "<div class='carousel-content'>";

    var children = getChildrenByParent(parent);
    children.forEach(function(child, index) {
        var displayStyle = index === 0 ? 'block' : 'none';
    
        carouselContent += "<div class='slide' style='display: " + displayStyle + ";'>";
        carouselContent += "<h3>" + parent + "</h3>"; // Utilisation de la valeur du parent comme titre
        carouselContent += "<p>Identifiant: " + child.name + "</p>";
    
        // Vérification et ajout de la caractéristique si définie
        if (child.caracteristique) {
            carouselContent += "<p>Caractéristique: " + child.caracteristique + "</p>";
        } else {
            carouselContent += "<p>Caractéristique: Donnée non disponible</p>";
        }
    
        // Vérification et ajout de la technique si définie
        if (child.technique) {
            carouselContent += "<p>Technique(s) : " + child.technique + "</p>";
        } else {
            carouselContent += "<p>Technique(s) : Donnée non disponible</p>";
        }
    
        // Vérification et ajout de la couleur si définie
        if (child.couleur) {
            carouselContent += "<p>Couleur(s): " + child.couleur + "</p>";
        } else {
            carouselContent += "<p>Couleur(s): Donnée non disponible</p>";
        }

        // Vérification et ajout du matériau si défini
        if (child.materiaux) {
            carouselContent += "<p>Matériau(x): " + child.materiaux + "</p>";
        } else {
            carouselContent += "<p>Matériau(x): Donnée non disponible</p>";
        }
    
        // Lien vers la slidebar
        carouselContent += "<p class='slidebar-link' onclick='showSlidebar(\"" + identifiant + "\")'>En savoir plus</p>"; // Ajouter une classe au lien

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
        var popupContent = createCarousel(parent, identifiant); // Passer l'identifiant à createCarousel()

        marker.bindPopup(popupContent); // Liaison du popup au marqueur
        markers.addLayer(marker); // Ajout du marqueur au groupe de clusters
    }
});


// Ajout du groupe de clusters à la carte
map.addLayer(markers);

function showSlidebar() {
    // Créer un élément de slidebar
    var slidebar = document.createElement('div');
    slidebar.className = 'slidebar';
    
    // Contenu de la slidebar avec l'icône de fermeture et le contenu personnalisé
    slidebar.innerHTML = `
        <div class="slidebar-content">
        <button class="close-btn" onclick="hideSlidebar()">&raquo;</button>
            <div class="slidebar-header">
                <h2>Valeur parent comme titre</h2>
            </div>
            <div>
                <h3>Valeur enfant comme sous-titre</h2>
            </div>
            <div class="slidebar-body">
                <p>Contenu de la slidebar ici...</p>
                <p>Vous pouvez personnaliser le contenu selon vos besoins.</p>
            </div>
        </div>
    `;
    
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

    // Déplacer la slidebar vers la position visible avec une animation
    setTimeout(function() {
        slidebar.style.transform = 'translateX(0)';
    }, 100); // Délai pour démarrer l'animation
}

// Fonction pour masquer la slidebar
function hideSlidebar() {
    var slidebar = document.querySelector('.slidebar');
    slidebar.style.transform = 'translateX(100%)'; // Cacher la slidebar en la déplaçant hors de l'écran
    setTimeout(function() {
        slidebar.remove(); // Supprimer la slidebar du DOM après la transition
    }, 300); // Délai pour la transition de fermeture (300ms correspond à la durée de l'animation)
}



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
