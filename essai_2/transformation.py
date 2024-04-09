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
    if '§' in value_string:
        value = value_string.replace('§', ' – ')  # Remplacer § par " – "
        return value.strip()
    else:
        return value_string  # Retourner la valeur telle quelle si pas de §

def csv_to_json(input_csv_path, output_json_path):
    data = []
    
    with open(input_csv_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            # Coordonnées
            coord_string = row['schema:geographicArea']
            coordinates = extract_coordinates(coord_string)
 
            # Ignorer les lignes sans coordonnées valides
            if coordinates is None:
                continue
            
            #Identifiant_parent
            parent_string = row["crm:P106_forms_part_of"]
            parent = parse_value(parent_string)

            # Identifiant_enfant
            identifiant_string = row["schema:identifier"]
            identifiant = parse_value(identifiant_string)

            #Matérialité
            caracteristique_string = row["dcterms:type"]
            caracteristique = parse_value(caracteristique_string)

            technique_string = row["schema:artMedium"]
            technique = parse_value(technique_string)

            couleur_string = row["schema:color"]
            couleur = parse_value(couleur_string)

            materiaux_string = row["schema:material"]
            materiaux = parse_value(materiaux_string)

            # Créer la structure JSON (Feature) pour chaque ligne
            feature = {
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                },
                "properties": {
                    "Parent": parent,
                    "Identifiant": identifiant,
                    "Caracteristique": caracteristique,
                    "Technique": technique,
                    "Couleur": couleur,
                    "Materiaux": materiaux
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
