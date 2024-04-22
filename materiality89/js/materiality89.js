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
        if (child.caracteristique && child.caracteristique !== '?') {
            carouselContent += "<p><u>Caractéristique</u>: " + child.caracteristique + "</p>";
        }
        if (child.technique && child.technique !== '?') {
            carouselContent += "<p><u>Technique(s)</u>: " + child.technique + "</p>";
        }
        if (child.couleur && child.couleur !== '?') {
            carouselContent += "<p><u>Couleur(s)</u>: " + child.couleur + "</p>";
        }
        if (child.materiaux && child.materiaux !== '?') {
            carouselContent += "<p><u>Matériau(x)</u>: " + child.materiaux + "</p>";
        }
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

    // Création du contenu HTML de la slidebar en vérifiant les valeurs
    var slidebarContent = `
        <div class="slidebar-content">
            <button class="close-btn" onclick="hideSlidebar()">&raquo;</button>
            <div class="slidebar-header">
                <h2>${child.titre || '?'}</h2>
            </div>
            <div class="slidebar-body">
                <p><b>Identification</b></p>
                <p><u>Identifiant :</u> ${child.name || '?'}</p>`;

    if (child.type && child.type !== '?') {
        slidebarContent += `<p><u>Type d'œuvre :</u> ${child.type}</p>`;
    }
    if (child.attribution && child.attribution !== '?') {
        slidebarContent += `<p><u>Attribution :</u> ${child.attribution}</p>`;
    }
    if (child.lieu && child.lieu !== '?') {
        slidebarContent += `<p><u>Lieu de création :</u> ${child.lieu}</p>`;
    }
    if (child.realisation && child.realisation !== '?') {
        slidebarContent += `<p><u>Date de réalisation :</u> ${child.realisation}</p>`;
    }

    slidebarContent += `<p><b>Description</b></p>`;

    if (child.type_description && child.type_description !== '?') {
        slidebarContent += `<p><u>Type :</u> ${child.type_description}</p>`;
    }
    if (child.caracteristique && child.caracteristique !== '?') {
        slidebarContent += `<p><u>Caractéristique :</u> ${child.caracteristique}</p>`;
    }
    if (child.technologie && child.technologie !== '?') {
        slidebarContent += `<p><u>Technologie(s) :</u> ${child.technologie}</p>`;
    }
    if (child.couleur && child.couleur !== '?') {
        slidebarContent += `<p><u>Couleur(s) :</u> ${child.couleur}</p>`;
    }
    if (child.materiaux && child.materiaux !== '?') {
        slidebarContent += `<p><u>Matériau(x) :</u> ${child.materiaux}</p>`;
    }
    if (child.certitude && child.certitude !== '?') {
        slidebarContent += `<p><u>Certitude :</u> ${child.certitude}</p>`;
    }
    if (child.mesure && child.mesure !== '?') {
        slidebarContent += `<p><u>Mesure :</u> ${child.mesure}</p>`;
    }
    if (child.date && child.date !== '?') {
        slidebarContent += `<p><u>Date :</u> ${child.date}</p>`;
    }
    if (child.rapport && child.rapport !== '?') {
        slidebarContent += `<p><u>Rapport de l'analyse :</u> ${child.rapport}</p>`;
    }
    if (child.source && child.source !== '?') {
        slidebarContent += `<p><u>Source du rapport :</u> ${child.source}</p>`;
    }

    slidebarContent += `
                <p><b>Lieu de conservation</b></p>`;

    if (child.localisation && child.localisation !== '?') {
        slidebarContent += `<p><u>Localisation :</u> ${child.localisation}</p>`;
    }
    if (child.cote && child.cote !== '?') {
        slidebarContent += `<p><u>Cote / numéro :</u> ${child.cote}</p>`;
    }

    slidebarContent += `
            </div>
        </div>`;

    slidebar.innerHTML = slidebarContent;

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

// Variables pour le filtre par materiau
var currentMateriauFilter = '';

// Variables pour le filtre par couleur d'œuvre
var currentColorFilter = '';

// Fonction pour mettre à jour le filtre par année de réalisation
function updateYearFilter(value) {
    currentYearFilter = parseInt(value);
    document.getElementById('selectedYear').textContent = currentYearFilter;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter);
}

// Fonction pour mettre à jour le filtre par materiau
function updateMateriauFilter(value) {
    currentMateriauFilter = value;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter);
}


// Fonction pour mettre à jour le filtre par couleur
function updateColorFilter(value) {
    currentColorFilter = value;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter);
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

// Définition des matériaux avec leurs clés et libellés
var matériaux = {
    'blanc de plomb': 'blanc de plomb',
    vermillon: 'vermillon',
    or: 'or',
    'lapis-lazuli': 'lapis-lazuli',
    indigo: 'indigo',
    'oxyde de plomb': 'oxyde de plomb'
};

// Texte constant pour afficher "tous les matériaux"
var nettoyage = {
    '': 'Nettoyer le filtre'
};

// Fonction pour mettre à jour l'affichage en fonction du texte saisi
function searchMateriau(searchText) {
    // Sélectionner tous les éléments de matériau
    var materialElements = document.querySelectorAll('.material-item');

    // Nettoyer le texte saisi en minuscules
    var cleanSearchText = searchText.trim().toLowerCase();

    // Parcourir chaque élément et déterminer s'il doit être affiché ou non
    materialElements.forEach(function(element) {
        var materialName = element.textContent.toLowerCase(); // Récupérer le nom du matériau en minuscules
        var isVisible = materialName.includes(cleanSearchText); // Vérifier si le texte est présent dans le nom du matériau

        // Afficher ou masquer l'élément en fonction de la visibilité
        element.style.display = isVisible ? 'block' : 'none';
    });

    // Si le champ de recherche est vide après nettoyage
    if (cleanSearchText === '') {
        // Cacher tous les éléments matériau
        materialElements.forEach(function(element) {
            element.style.display = 'none';
        });
    }
}

// Ajout d'un contrôle de recherche de matériau
var controlSelect = L.control({ position: 'topright' });

controlSelect.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'material-filter-control h4');
    div.innerHTML = '<h4>Filtrer par matériau</h4>';

    // Champ d'entrée pour rechercher un matériau
    var inputHTML = '<input type="text" placeholder="Rechercher" onkeyup="searchMateriau(this.value)">';
    div.innerHTML += inputHTML;

    // Liste des matériaux à afficher avec une classe pour le filtrage
    div.innerHTML += '<ul id="material-list">';
    // Ajouter les autres matériaux à partir de votre objet 'matériaux'
    for (var key in matériaux) {
        div.innerHTML += '<li class="material-item" onclick="selectMaterial(\'' + key + '\')">' + matériaux[key] + '</li>';
    }
    div.innerHTML += '</ul>';
    
    // Ajouter l'élément pour "tous les matériaux" 
    div.innerHTML += '<p class="all-materials-item" onclick="selectMaterial(\'\')">' + nettoyage[''] + '</p>';


    return div;
};

// Fonction d'initialisation pour cacher les éléments matériau au chargement de la page
function initMaterialItems() {
    var materialElements = document.querySelectorAll('.material-item');

    // Parcourir chaque élément et les cacher
    materialElements.forEach(function(element) {
        element.style.display = 'none';
    });
}

// Appeler la fonction d'initialisation une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initMaterialItems();
});

// Fonction appelée lors de la sélection d'un matériau dans la liste
function selectMaterial(material) {
    updateMateriauFilter(material);
    // Sélectionner le champ de recherche
    var searchInput = document.querySelector('input[type="text"][placeholder="Rechercher"]');
    // Mettre à jour la valeur du champ de recherche avec le matériau sélectionné
    if (searchInput) {
        searchInput.value = matériaux[material] || nettoyage[material]; // Utiliser le libellé correspondant à la clé sélectionnée
    }
}

// Ajouter le contrôle de recherche à la carte
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
function filterMarkersByDateTypeAndColorAndMateriau(yearFilter, materiauFilter, colorFilter) {
    markers.clearLayers();

    var parentMarkers = {};

    geojson_RAMA.features.forEach(function (feature) {
        var dateYear = parseInt(feature.properties.Date_filtre.split("-")[0]);
        var type = feature.properties.Type;
        var couleur = feature.properties.Couleur;
        var parent = feature.properties.Parent;
        var titre = feature.properties.Titre;

        // Debugging: Log information for each feature
        console.log("Feature:", feature.properties);

        // Filter based on date, material, and color
        if (isParent(feature.properties.Identifiant)) {
            if (
                dateYear <= yearFilter &&
                (materiauFilter === '' || feature.properties.Materiaux.toLowerCase().includes(materiauFilter.toLowerCase())) &&
                (colorFilter === '' || couleur.toLowerCase().includes(colorFilter.toLowerCase()))
            ) {
                if (!(parent in parentMarkers)) {
                    var coordinates = feature.geometry.coordinates;
                    var marker = L.marker([coordinates[1], coordinates[0]]);
                    var identifiant = feature.properties.Identifiant;
                    var popupContent = createCarousel(parent, identifiant);

                    var tooltip = L.tooltip().setContent(titre);

                    marker.bindTooltip(tooltip);

                    marker.bindPopup(popupContent, {
                        maxWidth: 400
                    });

                    marker.on('popupclose', function () {
                        hideSlidebar();
                    });

                    markers.addLayer(marker);

                    parentMarkers[parent] = true;
                }
            }
        }
    });

    map.addLayer(markers);
}
