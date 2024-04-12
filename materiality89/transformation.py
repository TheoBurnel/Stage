
import csv
import json
import os

def extract_coordinates(coord_string):
    if not coord_string.strip():
        return None
    
    if '§' in coord_string:
        coord_pair = coord_string.split('§')[0]
    else:
        coord_pair = coord_string
    
    try:
        lat, lon = map(float, coord_pair.split(','))
        return [lon, lat]  # Inverser l'ordre pour [longitude, latitude]
    except (ValueError, IndexError):
        return None
    
def parse_value(value_string):
    if not value_string.strip() or value_string == "Null":
        return "?"

    if '§' in value_string:
        value = value_string.replace('§', ' – ')  # Remplacer § par " – "
        return value.strip()
    else:
        return value_string  # Retourner la valeur telle quelle si pas de §

def pour_filtre(filtre):
    if not filtre.strip() or filtre == "Null":
        return "?"

    if '§' in filtre:
        # Extraire seulement l'année de début (avant le délimiteur '§')
        value = filtre.split('§')[0]
    else:
        value = filtre  # Utiliser la valeur telle quelle si pas de délimiteur '§'
        
    # Si la valeur contient une date au format 'YYYY-MM-DD AD', extraire seulement l'année
    if ' ' in value:
        year = value.split()[0]  # Récupérer l'année avant le premier espace
    else:
        year = value  # Si pas de date précise, utiliser la valeur telle quelle
        
    return year.strip()

def escapeApostrophes(text):
    return text.replace("'", '&#39;')

def csv_to_json(input_csv_path, output_json_path):
    data = []
    
    with open(input_csv_path, 'r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            # Coordonnées
            coord_string = row['schema:geographicArea']
            coordinates = extract_coordinates(coord_string)

            # Ignorer les lignes sans coordonnées valides
            if coordinates is None:
                continue
            
            # Parse et échapper les valeurs de chaînes de caractères
            titre = escapeApostrophes(parse_value(row["dcterms:title"]))
            parent = escapeApostrophes(parse_value(row["crm:P106_forms_part_of"]))
            type = escapeApostrophes(parse_value(row["schema:artform"]))
            representation = escapeApostrophes(parse_value(row['dcterms:subject']))
            attribution = escapeApostrophes(parse_value(row['schema:creator']))
            ville = escapeApostrophes(parse_value(row["schema:locationCreated"]))
            realisation = escapeApostrophes(parse_value(row["crm:P4_has_time-span"]))
            date_filtre = escapeApostrophes(pour_filtre(row["crm:P4_has_time-span"]))
            identifiant = escapeApostrophes(parse_value(row["schema:identifier"]))
            caracteristique = escapeApostrophes(parse_value(row["dcterms:type"]))
            technique = escapeApostrophes(parse_value(row["schema:artMedium"]))
            couleur = escapeApostrophes(parse_value(row["schema:color"]))
            materiaux = escapeApostrophes(parse_value(row["schema:material"]))
            certitude = escapeApostrophes(parse_value(row['schema:status']))
            technique = escapeApostrophes(parse_value(row["schema:measurementMethod"]))
            mesure = escapeApostrophes(parse_value(row["schema:hasMeasurement"]))
            date = escapeApostrophes(parse_value(row["schema:observationDate"]))
            rapport = escapeApostrophes(parse_value(row['dcterms:abstract']))
            source = escapeApostrophes(parse_value(row['dcterms:isReferencedBy']))
            localisation = escapeApostrophes(parse_value(row['crm:P54_has_current_permanent_location']))
            cote = escapeApostrophes(parse_value(row['crm:P1_is_identified_by']))

            # Créer la structure JSON (Feature) pour chaque ligne
            feature = {
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                },
                "properties": {
                    "Titre": titre,
                    "Parent": parent,
                    "Type": type,
                    "Representation": representation,
                    "Attribution": attribution,
                    "Lieu_de_creation": ville,
                    "Realisation": realisation,
                    "Identifiant": identifiant,
                    "Caracteristique": caracteristique,
                    "Technique": technique,
                    "Couleur": couleur,
                    "Materiaux": materiaux,
                    "Certitude": certitude,
                    "Technique": technique,
                    "Mesure": mesure,
                    "Date": date,
                    "Rapport": rapport,
                    "Source": source,
                    "Localisation": localisation,
                    "Cote": cote,
                    "Date_filtre": date_filtre
                },
                "type": "Feature"
            }
            
            # Ajouter la donnée à la liste des features
            data.append(feature)
    
    # Créer le répertoire de sortie s'il n'existe pas
    output_dir = os.path.dirname(output_json_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Écrire les données au format JSON dans un fichier de sortie
    with open(output_json_path, 'w') as json_file:
        json_file.write('var geojson_RAMA = ')
        json.dump({"type": "FeatureCollection", "features": data}, json_file, indent=4, ensure_ascii=False)

# Spécifiez le chemin du fichier CSV en entrée et du fichier JSON en sortie
csv_input_path = '../../bases/materiality89.csv'
json_output_path = 'data/materiality89.js'

# Appeler la fonction pour convertir le fichier CSV en JSON
csv_to_json(csv_input_path, json_output_path)

print("Conversion CSV vers JSON réussie !")

