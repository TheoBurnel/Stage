var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
    maxZoom: 16,
    minZoom: 4,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var latlng = L.latLng(48.1351253, 11.5819806);

var map = L.map('map', {
    center: latlng,
    zoom: 5,
    layers: [tiles]
});

// Utilisation de L.geoJson pour charger et afficher les données GeoJSON
L.geoJson(geojson_RAMA, {
    // Appel de la fonction popupContent pour chaque feature
    onEachFeature: function (feature, layer) {
        // Définition du contenu du popup pour chaque feature
        var popupContent = "<div style='width: 100%'>" +
                   "<p><h1 style='text-align: center;'>" + feature.properties.Titre + "</h1></p>" +
                   "<p><h2>"+ "Identification" + "</h2><p>" +
                   "<p>" + feature.properties['Type d\'\u0153uvre'] + "</p>" +
                   "<p>" + feature.properties.Commentaire + "</p>" +
                   "<p><h2>"+ "Localisation" + "</h2><p>" +
                   "<p>" + feature.properties['Lieu de conservation'] + "</p>" +
                   "<p>" + feature.properties['Cote / num\u00e9ro'] + "</p>" +
                   "<p><h2>"+ "Création" + "</h2><p>" +
                   "<p>" + feature.properties['Personne(s) liée(s) à l\'œuvre'] + "</p>" +
                   "<p>" + feature.properties.Contributeur + "</p>" +
                   "<p>" + feature.properties.Influence + "</p>" +
                   "<p>" + feature.properties['Période de création'] + "</p>" +
                   "<p>" + feature.properties['Lieu de création'] + "</p>" +
                   "<p><h2>"+ "Imprimé / manuscrit" + "</h2><p>" +
                   "<p>" + feature.properties.Langue + "</p>" +
                   "<p>" + feature.properties.Sujet + "</p>" +     
                   "<p>" + feature.properties.Sujet + "</p>" +                                 
                   "</div>";


        // Liaison du popup au layer
        layer.bindPopup(popupContent);
        
        // Gestion de l'événement click pour ouvrir le popup
        layer.on('click', function (e) {
            this.openPopup();
        });
    },
    pointToLayer: function (feature, latlng) {
        // Création d'un marqueur circulaire pour chaque point
        return L.circleMarker(latlng, {
            color: 'yellow',
            radius: 10,
            fillOpacity: 1
        });
    }
}).addTo(map);


// Création de la sidebar
var sidebar = L.control.sidebar({
    autopan: false,  // Désactiver le déplacement automatique de la carte pour centrer le contenu de la sidebar
    closeButton: true,  // Afficher le bouton de fermeture sur la sidebar
    container: 'sidebar',  // ID de l'élément HTML qui contiendra la sidebar
    position: 'right'  // Position de la sidebar (gauche ou droite)
}).addTo(map);

// Fonction pour mettre à jour le contenu de la sidebar avec les détails de l'élément sélectionné
function updateSidebarContent(properties) {
    var sidebarContent = "<h1>" + properties.Titre + "</h1>" +
                         "<h2>Identification</h2>" +
                         "<p>" + properties['Type d\'\u0153uvre'] + "</p>" +
                         "<p>" + properties.Commentaire + "</p>" +
                         "<h2>Localisation</h2>" +
                         "<p>" + properties['Lieu de conservation'] + "</p>" +
                         "<p>" + properties['Cote / num\u00e9ro'] + "</p>" +
                         "<h2>Création</h2>" +
                         "<p>" + properties['Personne(s) liée(s) à l\'œuvre'] + "</p>" +
                         "<p>" + properties.Contributeur + "</p>" +
                         "<p>" + properties.Influence + "</p>" +
                         "<p>" + properties['Période de création'] + "</p>" +
                         "<p>" + properties['Lieu de création'] + "</p>" +
                         "<h2>Imprimé / manuscrit</h2>" +
                         "<p>" + properties.Langue + "</p>" +
                         "<p>" + properties.Sujet + "</p>";

    // Mettre à jour le contenu de la sidebar
    sidebar.setContent(sidebarContent);
}

// Écouter les événements de clic sur les couches GeoJSON pour mettre à jour la sidebar
map.on('click', function(e) {
    var layer = e.layer;
    if (layer.feature) {
        updateSidebarContent(layer.feature.properties);
        sidebar.show();  // Afficher la sidebar
    }
});

