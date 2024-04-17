// Initialiser la carte Leaflet avec une vue sur l'Europe
var map = L.map('map').setView([44, 16], 5);

// Chargement des tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Groupe de clusters pour les marqueurs
var markers = L.markerClusterGroup();

// Fonction pour vérifier si c'est un parent (adulte)
function isParent(titre) {
    return titre && titre.trim() !== ''; // Considérer comme parent si le titre n'est pas vide
}

// Fonction pour récupérer les enfants par parent
function getChildrenByParent(parent) {
    var children = [];

    geojson_RAMA.features.forEach(function (feature) {
        if (feature.properties.Parent === parent) {
            children.push({
                titre: feature.properties.Titre || '?',
                name: feature.properties.Identifiant || '?',
                type: feature.properties.Type || '?',
                attribution: feature.properties.Attribution || '?',
                lieu: feature.properties.Lieu_de_creation || '?',
                realisation: feature.properties.Realisation || '?',
                type_description: feature.properties.Type_description || '?',
                caracteristique: feature.properties.Caracteristique || '?',
                technologie: feature.properties.Technologie || '?',
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

///////////////////////
// CARROUSEL ET SLIDEBAR
// Fonction pour créer le contenu du carrousel pour les enfants
function createCarousel(parent, identifiant) {
    var carouselContent = "<div class='carousel'><div class='carousel-content'>";

    var children = getChildrenByParent(parent);
    children.forEach(function (child, index) {
        var displayStyle = index === 0 ? 'block' : 'none';

        carouselContent += "<div class='slide' style='display: " + displayStyle + "; padding-left: 30px;'>"; // Ajouter un padding à gauche pour décaler le texte
        carouselContent += "<h3>" + child.titre + "</h3>";
        carouselContent += "<p>Identifiant : " + child.name + "</p>";
        carouselContent += "<p><u>Caractéristique</u>: " + (child.caracteristique || 'Donnée non disponible') + "</p>";
        carouselContent += "<p><u>Technique(s)</u>: " + (child.technique || 'Donnée non disponible') + "</p>";
        carouselContent += "<p><u>Couleur(s)</u>: " + (child.couleur || 'Donnée non disponible') + "</p>";
        carouselContent += "<p><u>Matériau(x)</u>: " + (child.materiaux || 'Donnée non disponible') + "</p>";
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
                <p><b>Identification</b></p>
                <p><u>Identifiant :</u> ${child.name || '?'}</p>
                <p><u>Type d'œuvre :</u> ${child.type || '?'}</p>
                <p><u>Attribution :</u> ${child.attribution || '?'}</p>
                <p><u>Lieu de création :</u> ${child.lieu || '?'}</p>
                <p><u>Date de réalisation :</u> ${child.realisation || '?'}</p>
                <p><b>Description</b></p>
                <p><u>Type :</u> ${child.type_description || '?'}</p>
                <p><u>Caractéristique :</u> ${child.caracteristique || '?'}</p>
                <p><u>Technologie(s) :</u> ${child.technologie || '?'}</p>
                <p><u>Couleur(s) :</u> ${child.couleur || '?'}</p>
                <p><u>Matériau(x) :</u> ${child.materiaux || '?'}</p>
                <p><u>Certitude :</u> ${child.certitude || '?'}</p>
                <p><u>Mesure :</u> ${child.mesure || '?'}</p>
                <p><u>Date :</u> ${child.date || '?'}</p>
                <p><u>Rapport de l'analyse :</u> ${child.rapport || '?'}</p>
                <p><u>Source du rapport :</u> ${child.source || '?'}</p>
                <p><b>Lieu de conservation</b></p>
                <p><u>Localisation :</u> ${child.localisation || '?'}</p>
                <p><u>Cote / numéro :</u> ${child.cote || '?'}</p>
            </div>
        </div>`;

    document.body.appendChild(slidebar);
    setTimeout(function () {
        slidebar.style.transform = 'translateX(0)';
    }, 100);
}

// Fonction pour masquer et supprimer la slidebar
function hideSlidebar() {
    var slidebar = document.querySelector('.slidebar');
    if (slidebar) {
        slidebar.style.transform = 'translateX(100%)';
        setTimeout(function () {
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

////////////////////////
// FILTRES
// Variables pour les filtres par date
var yearFilterMin = 400;
var yearFilterMax = 1860;
var currentYearFilter = yearFilterMin;

// Variables pour le filtre par type d'œuvre
var currentTypeFilter = '';

// Variables pour le filtre par couleur d'œuvre
var currentColorFilter = '';

// Fonction pour mettre à jour le filtre par année de réalisation
function updateYearFilter(value) {
    currentYearFilter = parseInt(value);
    document.getElementById('selectedYear').textContent = currentYearFilter;
    filterMarkersByDateTypeAndColorAndTechnique(currentYearFilter, currentTypeFilter, currentColorFilter);
}

// Fonction pour mettre à jour le filtre par type d'œuvre
function updateTypeFilter(value) {
    currentTypeFilter = value;
    filterMarkersByDateTypeAndColorAndTechnique(currentYearFilter, currentTypeFilter, currentColorFilter);
}

// Fonction pour mettre à jour le filtre par couleur
function updateColorFilter(value) {
    currentColorFilter = value;
    filterMarkersByDateTypeAndColorAndTechnique(currentYearFilter, currentTypeFilter, currentColorFilter);
}


// Ajout du contrôle de sélection avec jauge pour filtrer par année de réalisation
var controlSlider = L.control({ position: 'topright' });

controlSlider.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'year-filter-control');
    div.innerHTML = '<h4>Filtrer par année de réalisation</h4>';

    // Bouton pour diminuer l'année
    var decreaseButton = L.DomUtil.create('button', 'year-decrease-btn');
    decreaseButton.innerHTML = '-';
    decreaseButton.onclick = function () {
        decrementYear();
    };

    // Bouton pour augmenter l'année
    var increaseButton = L.DomUtil.create('button', 'year-increase-btn');
    increaseButton.innerHTML = '+';
    increaseButton.onclick = function () {
        incrementYear();
    };

    // Jauge d'année
    var yearRangeInput = L.DomUtil.create('input', 'year-range-input');
    yearRangeInput.type = 'range';
    yearRangeInput.min = yearFilterMin;
    yearRangeInput.max = yearFilterMax;
    yearRangeInput.value = currentYearFilter;
    yearRangeInput.step = 10; // Utilisation d'un pas de 10 pour l'année
    yearRangeInput.onchange = function () {
        updateYearFilter(this.value);
    };

    // Étiquette pour afficher l'année sélectionnée
    var selectedYearLabel = L.DomUtil.create('span', 'selected-year-label');
    selectedYearLabel.id = 'selectedYear';
    selectedYearLabel.textContent = currentYearFilter;

    // Ajout des éléments au div du contrôle
    div.appendChild(decreaseButton);
    div.appendChild(yearRangeInput);
    div.appendChild(increaseButton);
    div.appendChild(selectedYearLabel);

    return div;
};

controlSlider.addTo(map);

// Fonction pour augmenter l'année filtrée de 10 ans
function incrementYear() {
    if (currentYearFilter < yearFilterMax) {
        currentYearFilter += 10; // Ajout de 10 années à la fois
        updateYearFilter(currentYearFilter);
    }
}

// Fonction pour diminuer l'année filtrée de 10 ans
function decrementYear() {
    if (currentYearFilter > yearFilterMin) {
        currentYearFilter -= 10; // Soustraction de 10 années à la fois
        updateYearFilter(currentYearFilter);
    }
}

// Définition des types d'œuvres avec leurs clés et libellés
var typesOfWork = {
    manuscrit: 'manuscrit',
    ['carte géographique']: 'carte géographique',
    enluminure: 'enluminure',
    bréviaire: 'bréviaire',
    dessin: 'dessin',
    peinture: 'peinture',
    estampe: 'estampe'
};

// Ajout d'un contrôle de sélection pour filtrer par type d'œuvre
var controlSelect = L.control({ position: 'topright' });

controlSelect.onAdd = function (map) {
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

// Définition des couleurs possibles avec leurs clés et libellés
var colors = {
    blanc: 'blanc',
    noir: 'noir',
    rouge: 'rouge',
    vert: 'vert',
    bleu: 'bleu',
    jaune: 'jaune'
    // Ajoutez d'autres couleurs si nécessaire
};

// Ajout d'un contrôle de sélection pour filtrer par couleur
var colorFilterControl = L.control({ position: 'topright' });

colorFilterControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'color-filter-control');
    div.innerHTML = '<h4>Filtrer par couleur</h4>';

    var selectHTML = '<select onchange="updateColorFilter(this.value)">';
    selectHTML += '<option value="">Toutes les couleurs</option>';
    for (var key in colors) {
        selectHTML += '<option value="' + key + '">' + colors[key] + '</option>';
    }
    selectHTML += '</select>';

    div.innerHTML += selectHTML;

    return div;
};

colorFilterControl.addTo(map);

///////////////////////
// FONCTION POUR RÉCUPÉRER LES DONNÉES
function filterMarkersByDateTypeAndColorAndTechnique(yearFilter, typeFilter, colorFilter) {
    markers.clearLayers();

    var parentMarkers = {}; // Dictionnaire pour suivre les parents pour lesquels nous avons ajouté un marqueur

    geojson_RAMA.features.forEach(function (feature) {
        var dateYear = parseInt(feature.properties.Date_filtre.split("-")[0]);
        var type = feature.properties.Type;
        var couleur = feature.properties.Couleur;
        var parent = feature.properties.Parent;
        var titre = feature.properties.Titre;

        // Filtrer sur la base de la date, du type d'œuvre, de la couleur et de la technique
        if (isParent(feature.properties.Identifiant)) {
            if (
                dateYear <= yearFilter &&
                (typeFilter === '' || type.includes(typeFilter)) &&
                (colorFilter === '' || couleur.toLowerCase().includes(colorFilter.toLowerCase()))
            ) {
                if (!(parent in parentMarkers)) {
                    // Si ce parent n'a pas encore de marqueur, ajoutons-en un
                    var coordinates = feature.geometry.coordinates;
                    var marker = L.marker([coordinates[1], coordinates[0]]);
                    var identifiant = feature.properties.Identifiant;
                    var popupContent = createCarousel(parent, identifiant);

                    // Ajouter une infobulle au marqueur
                    var tooltip = L.tooltip().setContent(titre); // Utiliser le parent comme contenu de l'infobulle

                    marker.bindTooltip(tooltip); // Lier l'infobulle au marqueur

                        // Ajouter une fenêtre contextuelle (popup) au marqueur pour le carrousel complet
                        marker.bindPopup(popupContent, {
                            maxWidth: 400
                        });

                        marker.on('popupclose', function () {
                            hideSlidebar();
                        });

                        markers.addLayer(marker);

                        // Marquer ce parent comme ayant un marqueur ajouté
                        parentMarkers[parent] = true;
                    }
            }
            }
        });

    map.addLayer(markers);
}
