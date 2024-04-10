
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
                couleur: feature.properties.Couleur,
                materiaux: feature.properties.Materiaux,
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
        carouselContent += "<p class='slidebar-link' onclick='showSlidebar(\"" + parent + "\", \"" + child.name + "\", \"" + child.caracteristique + "\", \"" + child.technique + "\", \"" + child.couleur + "\", \"" + child.materiaux + "\")'>En savoir plus</p>";

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

        // Liaison du popup au marqueur
        marker.bindPopup(popupContent, {
            maxWidth: 400 // Définir une largeur maximale pour l'info-bulle
        });

        // Écouter l'événement de fermeture de l'info-bulle
        marker.on('popupclose', function() {
            hideSlidebar(); // Fermer la slidebar lorsque l'info-bulle est fermée
        });

        markers.addLayer(marker); // Ajout du marqueur au groupe de clusters
    }
});


// Ajout du groupe de clusters à la carte
map.addLayer(markers);

function showSlidebar(parent, name, caracteristique, technique, couleur, materiaux) {
    var slidebar = document.createElement('div');
    slidebar.className = 'slidebar';

    slidebar.innerHTML = `
        <div class="slidebar-content">
            <button class="close-btn" onclick="hideSlidebar()">&raquo;</button>
            <div class="slidebar-header">
                <h2>${parent}</h2> <!-- Utilisation du nom du parent comme titre -->
            </div>
            <div>
                <h3>${name}</h3> <!-- Utilisation du nom de l'enfant comme sous-titre -->
            </div>
            <div class="slidebar-body">
                <p>Caractéristique: ${caracteristique}</p>
                <p>Technique(s): ${technique}</p>
                <p>Couleur(s): ${couleur}</p>
                <p>Matériau(x): ${materiaux}</p>
                <!-- Ajoutez d'autres informations d'enfant si nécessaires -->
            </div>
        </div>
    `;

    document.body.appendChild(slidebar);

    // Appliquer des styles CSS pour positionner et styliser la slidebar
    slidebar.style.position = 'fixed';
    slidebar.style.top = '0';
    slidebar.style.right = '0';
    slidebar.style.width = '300px';
    slidebar.style.height = '100vh';
    slidebar.style.backgroundColor = '#ffffff';
    slidebar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    slidebar.style.zIndex = '1000';
    slidebar.style.overflowY = 'auto';

    setTimeout(function() {
        slidebar.style.transform = 'translateX(0)';
    }, 100);
}

// Fonction pour masquer et supprimer la slidebar
function hideSlidebar() {
    var slidebar = document.querySelector('.slidebar');
    if (slidebar) {
        slidebar.style.transform = 'translateX(100%)'; // Masquer la slidebar
        setTimeout(function() {
            slidebar.remove(); // Supprimer la slidebar du DOM après la transition
        }, 300); // Délai pour la transition de fermeture (300ms correspond à la durée de l'animation)
    }
}

// Fonction pour passer à la diapositive précédente dans le carrousel
function prevSlide(button) {
    var carousel = button.parentNode.querySelector('.carousel-content');
    var slides = carousel.querySelectorAll('.slide');
    var currentSlide = Array.from(slides).findIndex(slide => slide.style.display !== 'none');
    var prevSlide = (currentSlide - 1 + slides.length) % slides.length;

    slides[currentSlide].style.display = 'none';
    slides[prevSlide].style.display = 'block';

    // Fermer la slidebar lorsque l'on change de diapositive
    hideSlidebar();
}

// Fonction pour passer à la diapositive suivante dans le carrousel
function nextSlide(button) {
    var carousel = button.parentNode.querySelector('.carousel-content');
    var slides = carousel.querySelectorAll('.slide');
    var currentSlide = Array.from(slides).findIndex(slide => slide.style.display !== 'none');
    var nextSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].style.display = 'none';
    slides[nextSlide].style.display = 'block';

    // Fermer la slidebar lorsque l'on change de diapositive
    hideSlidebar();
}
