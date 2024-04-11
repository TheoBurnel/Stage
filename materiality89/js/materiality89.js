// Initialiser la carte Leaflet avec une vue sur l'Europe
var map = L.map('map').setView([44, 16], 5);

// Chargement des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Groupe de clusters pour les marqueurs
var markers = L.markerClusterGroup();

// Fonction pour vérifier si c'est un parent (adulte)
function isParent(identifiant) {
    return identifiant.endsWith("_001");
}

// Fonction pour récupérer les enfants par parent
function getChildrenByParent(parent) {
    var children = [];

    geojson_RAMA.features.forEach(function(feature) {
        if (feature.properties.Parent === parent) {
            children.push({
                titre: feature.properties.Titre || '?',
                name: feature.properties.Identifiant || '?',
                type: feature.properties.Type || '?',
                representation: feature.properties.Representation || '?',
                attribution: feature.properties.Attribution || '?',
                lieu: feature.properties.Lieu_de_creation || '?',
                realisation: feature.properties.Realisation || '?',
                caracteristique: feature.properties.Caracteristique || '?',
                technique: feature.properties.Technique || '?',
                couleur: feature.properties.Couleur || '?',
                materiaux: feature.properties.Materiaux || '?',
                certitude: feature.properties.Certitude || '?',
                mesure: feature.properties.Mesure || '?',
                date: feature.properties.Date || '?',
                rapport: feature.properties.Rapport || '?',
                source: feature.properties.Source || '?',
                localisation: feature.properties.Localisation || '?',
                cote: feature.properties.Cote || '?',
                date_filtre: feature.properties.Date_filtre || '?'
            });
        }
    });

    return children;
}

// Fonction pour créer le contenu du carrousel pour les enfants
function createCarousel(parent, identifiant) {
    var carouselContent = "<div class='carousel'><div class='carousel-content'>";

    var children = getChildrenByParent(parent);
    children.forEach(function(child, index) {
        var displayStyle = index === 0 ? 'block' : 'none';

        carouselContent += "<div class='slide' style='display: " + displayStyle + ";'>";
        carouselContent += "<h3>" + child.titre + "</h3>";
        carouselContent += "<p>Identifiant: " + child.name + "</p>";
        carouselContent += "<p>Caractéristique: " + (child.caracteristique || 'Donnée non disponible') + "</p>";
        carouselContent += "<p>Technique(s): " + (child.technique || 'Donnée non disponible') + "</p>";
        carouselContent += "<p>Couleur(s): " + (child.couleur || 'Donnée non disponible') + "</p>";
        carouselContent += "<p>Matériau(x): " + (child.materiaux || 'Donnée non disponible') + "</p>";
        carouselContent += "<p class='slidebar-link' onclick='showSlidebar(" + JSON.stringify(child) + ")'>En savoir plus</p>";
        carouselContent += "</div>";
    });

    carouselContent += "</div><button class='carousel-prev' onclick='prevSlide(this)'>❮</button><button class='carousel-next' onclick='nextSlide(this)'>❯</button></div>";

    return carouselContent;
}

// Fonction pour afficher la slidebar avec les détails de l'élément sélectionné
function showSlidebar(child) {
    var slidebar = document.createElement('div');
    slidebar.className = 'slidebar';
    slidebar.innerHTML = `
        <div class="slidebar-content">
            <button class="close-btn" onclick="hideSlidebar()">&raquo;</button>
            <div class="slidebar-header">
                <h2>${child.titre || '?'}</h2>
            </div>
            <div class="slidebar-body">
                <p><u>Identification</u></p>
                <p>Identifiant: ${child.name || '?'}</p>
                <p>Type d'œuvre: ${child.type || '?'}</p>
                <p>Représentation: ${child.representation || '?'}</p>
                <p>Attribution: ${child.attribution || '?'}</p>
                <p>Lieu de création: ${child.lieu || '?'}</p>
                <p>Date de réalisation: ${child.realisation || '?'}</p>
                <p><u>Description</u></p>
                <p>Caractéristique: ${child.caracteristique || '?'}</p>
                <p>Technique(s): ${child.technique || '?'}</p>
                <p>Couleur(s): ${child.couleur || '?'}</p>
                <p>Matériau(x): ${child.materiaux || '?'}</p>
                <p>Certitude: ${child.certitude || '?'}</p>
                <p>Mesure: ${child.mesure || '?'}</p>
                <p>Date: ${child.date || '?'}</p>
                <p>Rapport de l'analyse: ${child.rapport || '?'}</p>
                <p>Source du rapport: ${child.source || '?'}</p>
                <p><u>Lieu de conservation</u></p>
                <p>Localisation: ${child.localisation || '?'}</p>
                <p>Cote / numéro: ${child.cote || '?'}</p>
            </div>
        </div>`;

    document.body.appendChild(slidebar);
    setTimeout(function() {
        slidebar.style.transform = 'translateX(0)';
    }, 100);
}

// Fonction pour masquer et supprimer la slidebar
function hideSlidebar() {
    var slidebar = document.querySelector('.slidebar');
    if (slidebar) {
        slidebar.style.transform = 'translateX(100%)';
        setTimeout(function() {
            slidebar.remove();
        }, 300);
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

    hideSlidebar();
}

// Définition des types d'œuvres avec leurs clés et libellés
var typesOfWork = {
    manuscrit: 'manuscrit',
    enluminure: 'enluminure',
    bréviaire: 'bréviaire',
    dessin: 'dessin',
    peinture: 'peinture',
    estampe: 'estampe'
};

// Ajout d'un contrôle de sélection pour filtrer par type d'œuvre
var controlSelect = L.control({ position: 'topright' });

controlSelect.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'type-filter-control');
    div.innerHTML = '<h4>Filtrer par type d\'œuvre</h4>';

    var selectHTML = '<select onchange="updateTypeFilter(this.value)">';
    selectHTML += '<option value="">Tous les types</option>';
    for (var key in typesOfWork) {
        selectHTML += '<option value="' + key + '">' + typesOfWork[key] + '</option>';
    }
    selectHTML += '</select>';

    div.innerHTML += selectHTML;

    return div;
};

controlSelect.addTo(map);

// Fonction pour filtrer les marqueurs par date de réalisation et type d'œuvre
function filterMarkersByDateAndType(yearFilter, typeFilter) {
    markers.clearLayers();

    geojson_RAMA.features.forEach(function(feature) {
        var identifiant = feature.properties.Identifiant;
        var dateYear = parseInt(feature.properties.Date_filtre.split("-")[0]);
        var type = feature.properties.Type;

        // Vérifie si le type de l'œuvre contient le type filtré
        if (isParent(identifiant) && dateYear <= yearFilter && (typeFilter === '' || type.includes(typeFilter))) {
            var coordinates = feature.geometry.coordinates;
            var marker = L.marker([coordinates[1], coordinates[0]]);
            var parent = feature.properties.Parent;
            var popupContent = createCarousel(parent, identifiant);

            marker.bindPopup(popupContent, {
                maxWidth: 400
            });

            marker.on('popupclose', function() {
                hideSlidebar();
            });

            markers.addLayer(marker);
        }
    });

    map.addLayer(markers);
}

// Variables pour les filtres par date
var yearFilterMin = 400;
var yearFilterMax = 1860;
var currentYearFilter = yearFilterMin;

// Fonction pour mettre à jour le filtre par année de réalisation
function updateYearFilter(value) {
    currentYearFilter = parseInt(value);
    document.getElementById('selectedYear').textContent = currentYearFilter;
    filterMarkersByDateAndType(currentYearFilter, currentTypeFilter);
}

// Variables pour le filtre par type d'œuvre
var currentTypeFilter = '';

// Fonction pour mettre à jour le filtre par type d'œuvre
function updateTypeFilter(value) {
    currentTypeFilter = value;
    filterMarkersByDateAndType(currentYearFilter, currentTypeFilter);
}

// Ajout d'un contrôle de sélection pour filtrer par année de réalisation
var controlSlider = L.control({ position: 'topright' });

controlSlider.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'year-filter-control');
    div.innerHTML = '<h4>Filtrer par année de réalisation</h4>';
    div.innerHTML += '<input type="range" min="' + yearFilterMin + '" max="' + yearFilterMax + '" value="' + currentYearFilter + '" step="1" onchange="updateYearFilter(this.value)">';
    div.innerHTML += '<span id="selectedYear">' + currentYearFilter + '</span>';
    return div;
};

controlSlider.addTo(map);
