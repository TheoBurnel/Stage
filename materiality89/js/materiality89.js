// Initialiser la carte Leaflet avec une vue sur l'Europe
var map = L.map('map').setView([44, 16], 5); // Utilisation de coordonnées centrées sur l'Europe avec un zoom de niveau 4

// Chargement des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Groupe de clusters pour les marqueurs
var markers = L.markerClusterGroup();

// Fonction pour vérifier si c'est un parent

// Chargement des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Groupe de clusters pour les marqueurs
var markers = L.markerClusterGroup();

// Fonction pour vérifier si c'est un parent (adulte)
function isParent(identifiant) {
    return identifiant.endsWith("_001"); // Vérifier si l'identifiant se termine par "_001"
}

// Fonction pour récupérer les enfants par parent
function getChildrenByParent(parent) {
    var children = [];

    geojson_RAMA.features.forEach(function(feature) {
        if (feature.properties.Parent === parent) {
            children.push({
                titre: feature.properties.Titre,
                name: feature.properties.Identifiant,
                type: feature.properties.Type,
                representation: feature.properties.Representation,
                attribution: feature.properties.Attribution,
                lieu: feature.properties.Lieu_de_creation,
                realisation: feature.properties.Realisation,
                caracteristique: feature.properties.Caracteristique,
                technique: feature.properties.Technique,
                couleur: feature.properties.Couleur,
                materiaux: feature.properties.Materiaux,
                certitude: feature.properties.Certitude,
                mesure: feature.properties.Mesure,
                date: feature.properties.Date,
                rapport: feature.properties.Rapport,
                source: feature.properties.Source,
                localisation: feature.properties.Localisation,
                cote: feature.properties.Cote,
                date_filtre: feature.properties.Date_filtre
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
        carouselContent += "<h3>" + child.titre + "</h3>";
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
        carouselContent += "<p class='slidebar-link' onclick='showSlidebar(\"" + child.titre + "\", \"" + parent + "\", \"" + child.name + "\", \"" + child.type + "\", \"" + child.representation + "\", \"" + child.attribution + "\", \"" + child.lieu + "\", \"" + child.realisation + "\", \"" + child.caracteristique + "\", \"" + child.technique + "\", \"" + child.couleur + "\", \"" + child.materiaux + "\", \"" + child.certitude + "\", \"" + child.technique + "\", \"" + child.mesure + "\", \"" + child.date + "\", \"" + child.rapport + "\", \"" + child.source + "\", \"" + child.localisation + "\", \"" + child.cote + "\", \"" + child.Date_filtre + "\")'>En savoir plus</p>";

        carouselContent += "</div>";
    });

    carouselContent += "</div>";
    carouselContent += "<button class='carousel-prev' onclick='prevSlide(this)'>❮</button>";
    carouselContent += "<button class='carousel-next' onclick='nextSlide(this)'>❯</button>";
    carouselContent += "</div>";

    return carouselContent;
}

// Fonction pour afficher la slidebar avec les détails de l'élément sélectionné
function showSlidebar(titre, parent, name, type, representation, attribution, lieu, realisation, caracteristique, technique, couleur, materiaux, certitude, mesure, date, rapport, source, localisation, cote, date_filtre) {
    var slidebar = document.createElement('div');
    slidebar.className = 'slidebar';

    slidebar.innerHTML = `
        <div class="slidebar-content">
            <button class="close-btn" onclick="hideSlidebar()">&raquo;</button>
            <div class="slidebar-header">
                <h2>${titre || '?'}</h2> <!-- Utilisation du titre comme en-tête -->
            </div>
            <div class="slidebar-body">
                <p><u>Identification</u></p>
                <p>Identifiant: ${name || '?'}</p>
                <p>Type d'œuvre: ${type || '?'}</p>
                <p>Représentation: ${representation || '?'}</p>
                <p>Attribution: ${attribution || '?'}</p>
                <p>Lieu de création: ${lieu || '?'}</p>
                <p>Date de réalisation: ${realisation || '?'}</p>
                <p><u>Description</u></p>
                <p>Caractéristique: ${caracteristique || '?'}</p>
                <p>Technique(s): ${technique || '?'}</p>
                <p>Couleur(s): ${couleur || '?'}</p>
                <p>Matériau(x): ${materiaux || '?'}</p>
                <p>Certitude: ${certitude || '?'}</p>
                <p>Mesure: ${mesure || '?'}</p>
                <p>Date: ${date || '?'}</p>
                <p>Rapport de l'analyse: ${rapport || '?'}</p>
                <p>Source du rapport: ${source || '?'}</p>
                <p><u>Lieu de conservation</u></p>
                <p>Localisation: ${localisation || '?'}</p>
                <p>Cote / numéro: ${cote || '?'}</p>
            </div>
        </div>
    `;

    document.body.appendChild(slidebar);

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

// Fonction pour filtrer les marqueurs par date de réalisation
function filterMarkersByDate(yearFilter) {
    markers.clearLayers(); // Effacer tous les marqueurs du groupe de clusters

    geojson_RAMA.features.forEach(function(feature) {
        var coordinates = feature.geometry.coordinates;
        var identifiant = feature.properties.Identifiant;
        var DateYear = parseInt(feature.properties.Date_filtre.split("-")[0]); // Extraire l'année de la date de réalisation

        // Vérifier si c'est un parent (adulte) et si l'année de réalisation est supérieure au filtre
        if (isParent(identifiant) && DateYear < yearFilter) {
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

    map.addLayer(markers); // Ajouter les marqueurs filtrés à la carte
}

// Ajouter un contrôle de filtre avec une jauge (slider) pour les années
var yearFilterMin = 400; // Année minimale pour la jauge (par exemple)
var yearFilterMax = 1860; // Année maximale pour la jauge (par exemple)
var currentYearFilter = yearFilterMin; // Valeur initiale de la jauge

// Calculer les étapes de la jauge par intervalles de 20 ans
var yearStep = 20;
var sliderSteps = [];
for (var year = yearFilterMin; year <= yearFilterMax; year += yearStep) {
    sliderSteps.push(year);
}

var controlSlider = L.control({ position: 'topright' });

controlSlider.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'year-filter-control');
    div.innerHTML += '<h4>Existant à la date de </h4>';

    // Ajouter un bouton de réduction d'année
    div.innerHTML += '<button onclick="decreaseYearFilter()" style="margin-right: 5px;">-</button>';

    // Ajouter une jauge (slider) pour filtrer par année avec des étapes
    div.innerHTML += '<input type="range" min="' + yearFilterMin + '" max="' + yearFilterMax + '" value="' + currentYearFilter + '" step="' + yearStep + '" class="year-slider" oninput="updateYearFilter(this.value)">';

    // Ajouter un bouton d'augmentation d'année
    div.innerHTML += '<button onclick="increaseYearFilter()" style="margin-left: 5px;">+</button>';

    // Ajouter un champ texte pour afficher l'année sélectionnée
    div.innerHTML += '<span id="selectedYear">' + currentYearFilter + '</span>';

    return div;
};

controlSlider.addTo(map);

// Fonction pour augmenter l'année de filtrage de 10 ans
function increaseYearFilter() {
    var newYear = Math.min(currentYearFilter + yearStep, yearFilterMax);
    updateYearFilter(newYear);
}

// Fonction pour réduire l'année de filtrage de 10 ans
function decreaseYearFilter() {
    var newYear = Math.max(currentYearFilter - yearStep, yearFilterMin);
    updateYearFilter(newYear);
}

// Fonction pour mettre à jour le filtre d'année en fonction de la valeur de la jauge
function updateYearFilter(value) {
    currentYearFilter = parseInt(value);
    document.getElementById('selectedYear').textContent = currentYearFilter;
    filterMarkersByDate(currentYearFilter); // Appliquer le filtre avec la nouvelle année sélectionnée
}

// Fonction pour filtrer les marqueurs par date de réalisation avec un intervalle de 10 ans
function filterMarkersByDate(yearFilter) {
    markers.clearLayers(); // Effacer tous les marqueurs du groupe de clusters

    geojson_RAMA.features.forEach(function(feature) {
        var coordinates = feature.geometry.coordinates;
        var identifiant = feature.properties.Identifiant;
        var dateYear = parseInt(feature.properties.Date_filtre.split("-")[0]); // Extraire l'année de la date de réalisation

        // Vérifier si c'est un parent (adulte) et si l'année de réalisation est supérieure ou égale au filtre
        if (isParent(identifiant) && dateYear <= yearFilter) {
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

    map.addLayer(markers); // Ajouter les marqueurs filtrés à la carte
}
