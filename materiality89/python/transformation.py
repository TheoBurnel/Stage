import csv
import json
import os

def extract_coordinates(coord_string):
    if not coord_string.strip():
        return [-8, 48]  # Retourner les coordonnées par défaut : longitude -8, latitude 48
    
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
    parent_suffix_count = {}  # Dictionnaire pour suivre les suffixes numériques des parents

    with open(input_csv_path, 'r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            # Coordonnées
            coord_string = row['schema:geographicArea']
            coordinates = extract_coordinates(coord_string)

            # Si les coordonnées sont None (par exemple, champ vide), utiliser les coordonnées par défaut
            if coordinates is None:
                coordinates = [-8, 48]  # Coordonnées par défaut : longitude -8, latitude 48
            
            # Parse et échapper les valeurs de chaînes de caractères
            titre = escapeApostrophes(parse_value(row["dcterms:title"]))
            parent = escapeApostrophes(parse_value(row["crm:P106i_forms_part_of"]))
            
            # Vérifier si le parent existe déjà dans le dictionnaire
            if parent in parent_suffix_count:
                # Parent existe, vérifier les coordonnées
                if parent_suffix_count[parent]["coordinates"] != coordinates:
                    # Coordonnées différentes, incrémenter le suffixe numérique du parent
                    parent_suffix_count[parent]["suffix"] += 1
                    new_parent = f"{parent}_{parent_suffix_count[parent]['suffix']}"
                    parent_suffix_count[new_parent] = {
                        "coordinates": coordinates,
                        "suffix": 0  # Réinitialiser le suffixe pour le nouveau parent
                    }
                    parent = new_parent
                else:
                    parent_suffix_count[parent]["coordinates"] = coordinates
                    parent_suffix_count[parent] = {
                    "coordinates": coordinates,
                    "suffix": 0
                }
            else:
                # Nouveau parent, initialiser le suffixe à 0
                parent_suffix_count[parent] = {
                    "coordinates": coordinates,
                    "suffix": 0
                }
                
            # Parse et échapper les valeurs de chaînes de caractères
            type = escapeApostrophes(parse_value(row["schema:artform"]))
            attribution = escapeApostrophes(parse_value(row['schema:creator']))
            ville = escapeApostrophes(parse_value(row["schema:locationCreated"]))
            realisation = escapeApostrophes(parse_value(row["crm:P4_has_time-span"]))
            date_filtre = escapeApostrophes(pour_filtre(row["crm:P4_has_time-span"]))
            identifiant = escapeApostrophes(parse_value(row["dcterms:identifier"]))
            image = escapeApostrophes(parse_value(row["dcterms:image"]))
            type_description = escapeApostrophes(parse_value(row['crm:P2_has_type']))
            caracteristique = escapeApostrophes(parse_value(row["dcterms:type"]))
            motif = escapeApostrophes(parse_value(row['dcterms:subject']))
            technique = escapeApostrophes(parse_value(row["schema:artMedium"]))
            couleur = escapeApostrophes(parse_value(row["schema:color"]))
            materiaux = escapeApostrophes(parse_value(row["schema:material"]))
            certitude = escapeApostrophes(parse_value(row['schema:status']))
            technologie = escapeApostrophes(parse_value(row["schema:measurementMethod"]))
            mesure = escapeApostrophes(parse_value(row["schema:hasMeasurement"]))
            date = escapeApostrophes(parse_value(row["schema:observationDate"]))
            rapport = escapeApostrophes(parse_value(row['dcterms:abstract']))
            source = escapeApostrophes(parse_value(row['dcterms:isReferencedBy']))
            localisation = escapeApostrophes(parse_value(row['crm:P54_has_current_permanent_location']))
            cote = escapeApostrophes(parse_value(row['crm:P1_is_identified_by']))
            projet = escapeApostrophes(parse_value(row['dcterms:references']))

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
                    "Attribution": attribution,
                    "Lieu_de_creation": ville,
                    "Realisation": realisation,
                    "Identifiant": identifiant,
                    "Image": image,
                    "Type_description": type_description,
                    "Caracteristique": caracteristique,
                    "Motif": motif,
                    "Technique": technique,
                    "Couleur": couleur,
                    "Materiaux": materiaux,
                    "Certitude": certitude,
                    "Technologie": technologie,
                    "Mesure": mesure,
                    "Date": date,
                    "Rapport": rapport,
                    "Source": source,
                    "Localisation": localisation,
                    "Cote": cote,
                    "Date_filtre": date_filtre,
                    "Projet": projet
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
csv_input_path = 'donnees/bases_images_merged.csv'
json_output_path = 'data/materiality89.js'

# Appeler la fonction pour convertir le fichier CSV en JSON
csv_to_json(csv_input_path, json_output_path)

print("Conversion CSV vers JSON réussie !")
