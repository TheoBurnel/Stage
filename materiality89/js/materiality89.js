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
                image: feature.properties.Image || '?',
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
                date_filtre: feature.properties.Date_filtre || '?',
                projet: feature.properties.Projet || '?',
                coordinates: feature.geometry.coordinates || '?'
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

        carouselContent += "<div class='slide' style='display: " + displayStyle + "; padding-left: 30px;'>";
        if (child.coordinates && child.coordinates.length === 2 && child.coordinates[0] === -8 && child.coordinates[1] === 48) {
            carouselContent += "<p><h4><u>Lieu de création inconnu</u></h4></p>";
        }
        carouselContent += "<h3>" + child.titre + "</h3>";

        if (child.image && child.image !== '?') {
            carouselContent += "<img id='carousel-image-" + index + "' src='" + child.image + "' onclick='expandImage(this)' />";
        }
        carouselContent += "<p class='carousel-legend'>Identifiant de la photo :<br>" + child.name + "</p>";

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

function expandImage(img) {
    // Créer un overlay pour afficher l'image agrandie
    var overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';

    // Créer l'élément de l'image agrandie
    var enlargedImg = new Image();
    enlargedImg.src = img.src;
    enlargedImg.className = 'enlarged-image';
    enlargedImg.style.maxWidth = '80%';
    enlargedImg.style.maxHeight = '80%';
    enlargedImg.style.cursor = 'zoom-in'; // Utiliser le symbole de loupe "+" pour le zoom in

    // Ajouter l'image agrandie à l'overlay
    overlay.appendChild(enlargedImg);

    // Fonction pour gérer le zoom au clic
    enlargedImg.onclick = function (e) {
        e.stopPropagation(); // Arrêter la propagation du clic pour éviter la fermeture de l'overlay

        if (enlargedImg.style.cursor === 'zoom-in') {
            // Calculer les coordonnées du clic par rapport à l'image agrandie
            var rect = enlargedImg.getBoundingClientRect();
            var x = e.clientX - rect.left; // Position X du clic par rapport à l'image
            var y = e.clientY - rect.top; // Position Y du clic par rapport à l'image

            // Zoomer à l'endroit du clic
            enlargedImg.style.cursor = 'zoom-out'; // Utiliser le symbole de loupe "-" pour le zoom out
            enlargedImg.style.transformOrigin = `${x}px ${y}px`; // Définir l'origine du zoom
            enlargedImg.style.transform = 'scale(4)'; // Facteur de zoom
        } else {
            // Annuler le zoom
            enlargedImg.style.cursor = 'zoom-in'; // Revenir au symbole de loupe "+" pour le zoom in
            enlargedImg.style.transform = 'scale(1)';
        }
    };

    // Fermer l'image agrandie en cliquant à l'extérieur de l'image
    overlay.onclick = function () {
        document.body.removeChild(overlay);
    };

    // Ajouter l'overlay à la page
    document.body.appendChild(overlay);
}


// Fonction pour afficher la slidebar avec les détails de l'élément sélectionné
function showSlidebar(child) {
    var slidebar = document.createElement('div');
    slidebar.className = 'slidebar';

    // Création du contenu HTML de la slidebar en vérifiant les valeurs
    var slidebarContent = `
    <div class="slidebar-content">
        <button class="close-btn" onclick="hideSlidebar()">&raquo;</button>
        <div class="slidebar-header">`;

    // Vérifier les coordonnées et afficher le message approprié si les coordonnées correspondent à [-8, 48]
    if (child.coordinates && Array.isArray(child.coordinates) && child.coordinates[0] === -8 && child.coordinates[1] === 48) {
        slidebarContent += `
        <h4><u>Lieu de création inconnu</u></h4>`;
    }

    // Ajouter le titre de l'enfant à la section de l'en-tête
    slidebarContent += `
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
    if (child.projet && child.projet !== '?') {
        slidebarContent += `<p><u>Projet :</u> ${child.projet}</p>`;
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
///////////////
//BASES
// Ajout d'un contrôle de sélection avec des boutons radio pour filtrer par projet
var baseFilterControl = L.control({ position: 'topright' });

baseFilterControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'base-filter-control');
    div.innerHTML = '<h4>Filtrer par projet</h4>';

    // Définition des bases avec leurs libellés
    var bases = {
        '': 'Tous les projets',
        'Couleurs et matériaux': 'Couleurs et matériaux de l\'enluminure',
        'Panneaux peints': 'Panneaux peints en Méditerranée'
    };

    // Générer des boutons radio à partir des bases définies
    for (var key in bases) {
        var label = bases[key];

        // Créer un bouton radio avec un événement onchange pour mettre à jour le filtre
        var radioButton = '<input type="radio" id="' + key + '" name="base-filter" value="' + key + '" onchange="updateBaseFilter(this.value)"> ';
        radioButton += '<label for="' + key + '">' + label + '</label><br>';

        div.innerHTML += radioButton;
    }

    // Sélectionner le bouton radio "Tous les projets" par défaut
    var defaultRadioButton = div.querySelector('input[value=""]');
    if (defaultRadioButton) {
        defaultRadioButton.checked = true;
    }

    return div;
};

// Fonction pour mettre à jour le filtre par projet en fonction de la valeur sélectionnée
function updateBaseFilter(value) {
    currentBaseFilter = value;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter, currentBaseFilter);
}

// Ajouter le contrôle de sélection avec des boutons radio à la carte
baseFilterControl.addTo(map);


///////////////
//DATE
// Variables pour les filtres par date
var yearFilterMin = 400;
var yearFilterMax = 1860;
var currentYearFilter = 1130;

// Variables pour le filtre par materiau
var currentMateriauFilter = '';

// Variables pour le filtre par couleur d'œuvre
var currentColorFilter = '';

// Variables pour le filtre par projet
var currentBaseFilter = '';

filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter, currentBaseFilter);

// Fonction pour mettre à jour le filtre par année de réalisation
function updateYearFilter(value) {
    currentYearFilter = parseInt(value);
    document.getElementById('selectedYear').textContent = currentYearFilter;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter, currentBaseFilter);
}

// Fonction pour mettre à jour le filtre par materiau
function updateMateriauFilter(value) {
    currentMateriauFilter = value;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter, currentBaseFilter);
}

// Fonction pour mettre à jour le filtre par couleur
function updateColorFilter(value) {
    currentColorFilter = value;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter, currentBaseFilter);
}

// Fonction pour mettre à jour le filtre par projet
function updateBaseFilter(value) {
    currentBaseFilter = value;
    filterMarkersByDateTypeAndColorAndMateriau(currentYearFilter, currentMateriauFilter, currentColorFilter, currentBaseFilter);
}

var controlSlider = L.control({ position: 'topright' });

controlSlider.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'year-filter-control');
    div.innerHTML = '<h4>Filtrer par année de réalisation</h4>';

    // Bouton pour diminuer l'année
    var decreaseButton = L.DomUtil.create('button', 'year-decrease-btn');
    decreaseButton.innerHTML = '-';
    decreaseButton.onclick = function (e) {
        decrementYear();
    };

    // Bouton pour augmenter l'année
    var increaseButton = L.DomUtil.create('button', 'year-increase-btn');
    increaseButton.innerHTML = '+';
    increaseButton.onclick = function (e) {
        incrementYear();
    };

    // Jauge d'année
    var yearRangeInput = L.DomUtil.create('input', 'year-range-input');
    yearRangeInput.type = 'range';
    yearRangeInput.min = yearFilterMin;
    yearRangeInput.max = yearFilterMax;
    yearRangeInput.value = currentYearFilter;
    yearRangeInput.step = 10; // Utilisation d'un pas de 10 pour l'année
    yearRangeInput.oninput = function (e) {
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

    L.DomEvent.on(yearRangeInput, 'mousedown', function () {
        map.dragging.disable();
    });

    L.DomEvent.on(yearRangeInput, 'mouseup', function () {
        map.dragging.enable();
    });

    L.DomEvent.on(increaseButton, 'dblclick', function (e) {
        e.stopPropagation();
    });

    L.DomEvent.on(decreaseButton, 'dblclick', function (e) {
        e.stopPropagation();
    });

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

///////////////
//MATERIAUX
// Utiliser un ensemble pour stocker les valeurs uniques de Materiaux
var uniqueMaterials = new Set();

// Parcourir les données geojson_RAMA.features pour collecter les valeurs uniques
geojson_RAMA.features.forEach(function (feature) {
    var materiaux = feature.properties.Materiaux || '?'; // Valeur par défaut si Materiaux est vide

    // Séparer les matériaux si la valeur contient des caractères spécifiques comme '-'
    var materialList = materiaux.split(' – ').join(',').split(','); // Diviser sur ' – ' et ','

    // Ajouter chaque matériau à l'ensemble uniqueMaterials
    materialList.forEach(function (material) {
        uniqueMaterials.add(material.trim()); // Ajouter le matériau sans espaces inutiles
    });
});

// Créer le tableau matériaux à partir de l'ensemble uniqueMaterials
var matériaux = {};
uniqueMaterials.forEach(function (material) {
    matériaux[material] = material; // Utiliser le matériau comme clé et valeur dans l'objet matériaux
});

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
    materialElements.forEach(function (element) {
        var materialName = element.textContent.toLowerCase(); // Récupérer le nom du matériau en minuscules
        var isVisible = materialName.includes(cleanSearchText); // Vérifier si le texte est présent dans le nom du matériau

        // Afficher ou masquer l'élément en fonction de la visibilité
        element.style.display = isVisible ? 'block' : 'none';
    });

    // Si le champ de recherche est vide après nettoyage
    if (cleanSearchText === '') {
        // Cacher tous les éléments matériau
        materialElements.forEach(function (element) {
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
    materialElements.forEach(function (element) {
        element.style.display = 'none';
    });
}

// Appeler la fonction d'initialisation une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', function () {
    initMaterialItems();
});

// Fonction pour réinitialiser le filtre de recherche de matériau
function resetMaterialFilter() {
    var materialElements = document.querySelectorAll('.material-item');

    // Cacher tous les éléments matériau
    materialElements.forEach(function (element) {
        element.style.display = 'none';
    });
}

// Fonction appelée lors de la sélection d'un matériau dans la liste
function selectMaterial(material) {
    updateMateriauFilter(material);
    // Réinitialiser le filtre après la sélection d'un matériau
    resetMaterialFilter();

    // Sélectionner le champ de recherche
    var searchInput = document.querySelector('input[type="text"][placeholder="Rechercher"]');
    // Mettre à jour la valeur du champ de recherche avec le matériau sélectionné
    if (searchInput) {
        searchInput.value = matériaux[material] || ""; // Utiliser le libellé correspondant à la clé sélectionnée
    }
}

// Fonction pour nettoyer le filtre de recherche de matériau
function clearMaterialFilter() {
    // Réinitialiser le champ de recherche
    var searchInput = document.querySelector('input[type="text"][placeholder="Rechercher"]');
    if (searchInput) {
        searchInput.value = ''; // Effacer le texte du champ de recherche
    }

    // Réinitialiser et afficher tous les éléments matériau
    var materialElements = document.querySelectorAll('.material-item');
    materialElements.forEach(function (element) {
        element.style.display = 'block'; // Afficher tous les éléments matériau
    });
}

// Ajouter le contrôle de recherche à la carte
controlSelect.addTo(map);


///////////////
//COULEURS
// Définition des couleurs possibles avec leurs clés et libellés
var colors = {
    argenté: 'argenté',
    beige: 'beige',
    blanc: 'blanc',
    bleu: 'bleu',
    brun: 'brun',
    cuivré: 'cuivré',
    doré: 'doré',
    gris: 'gris',
    jaune: 'jaune',
    noir: 'noir',
    orange: 'orange',
    rose: 'rose',
    rouge: 'rouge',
    vert: 'vert',
    violet: 'violet'
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
function filterMarkersByDateTypeAndColorAndMateriau(yearFilter, materiauFilter, colorFilter, baseFilter) {
    // Nettoie les anciens marqueurs de la carte
    markers.clearLayers();

    // Utilisation d'un objet pour suivre les marqueurs parent déjà ajoutés
    var parentMarkers = {};

    // Parcours de chaque entité (feature) dans les données géographiques (geojson)
    geojson_RAMA.features.forEach(function (feature) {
        // Extraction de l'année à partir de la propriété 'Date_filtre' de l'entité
        var dateYear = parseInt(feature.properties.Date_filtre.split("-")[0]);
        // Récupération des autres propriétés de l'entité
        var type = feature.properties.Type;
        var couleur = feature.properties.Couleur;
        var parent = feature.properties.Parent;
        var projet = feature.properties.Projet;
        var titre = feature.properties.Titre;

        // Nettoyer la valeur du filtre de base en mettant en minuscule et en supprimant les apostrophes
        var cleanedBaseFilter = baseFilter.toLowerCase().replace(/'/g, '');

        // Vérifier si l'entité est un parent en fonction de son identifiant
        if (isParent(feature.properties.Identifiant)) {
            // Appliquer les filtres : année, matériau, couleur et filtre de base
            if (
                dateYear <= yearFilter &&
                (materiauFilter === '' || feature.properties.Materiaux.toLowerCase().includes(materiauFilter.toLowerCase())) &&
                (colorFilter === '' || couleur.toLowerCase().includes(colorFilter.toLowerCase())) &&
                (cleanedBaseFilter === '' || projet.toLowerCase().includes(cleanedBaseFilter))
            ) {
                // Vérifier si le parent n'a pas encore été ajouté comme marqueur
                if (!(parent in parentMarkers)) {
                    // Récupérer les coordonnées de l'entité pour créer un marqueur Leaflet
                    var coordinates = feature.geometry.coordinates;
                    var marker = L.marker([coordinates[1], coordinates[0]]);
                    var identifiant = feature.properties.Identifiant;

                    // Créer le contenu de la fenêtre contextuelle (popup) à afficher
                    var popupContent = createCarousel(parent, identifiant);

                    // Créer et attacher une infobulle (tooltip) au marqueur
                    var tooltip = L.tooltip().setContent(titre);
                    marker.bindTooltip(tooltip);

                    // Attacher le contenu de la fenêtre contextuelle (popup) au marqueur
                    marker.bindPopup(popupContent, {
                        maxWidth: 400
                    });

                    // Cacher la barre latérale lorsque la fenêtre contextuelle se ferme
                    marker.on('popupclose', function () {
                        hideSlidebar();
                    });

                    // Ajouter le marqueur à la couche de marqueurs (markers)
                    markers.addLayer(marker);

                    // Marquer le parent comme ayant été ajouté
                    parentMarkers[parent] = true;
                }
            }
        }
    });

    // Ajouter la couche de marqueurs à la carte
    map.addLayer(markers);
}

