import csv
import json

def extract_coordinates(coord_string):
    if not coord_string.strip():
        return None
    
    if '§' in coord_string:
        coord_pair = coord_string.split('§')[0]
    else:
        coord_pair = coord_string
    
    try:
        lat, lon = map(float, coord_pair.split(','))
        return [lon, lat]
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
            coord_string = row['schema:geographicAera']
            coordinates = extract_coordinates(coord_string)
            
            if coordinates is None:
                continue  # Passer à la ligne suivante si les coordonnées ne sont pas valides
            
            # Récupérer le titre de la propriété dans la colonne 'dcterms:title'
            title = parse_value(row['dcterms:title'])
            lieu_conservation = parse_value(row['crm:P54_has_current_permanent_location'])
            cote = parse_value(row['crm:P1_is_identified_by'])
            commentaire = parse_value(row['dcterms:alternative'])
            
            # Récupérer les types d'œuvre dans la colonne 'schema:artform'
            artform_string = row['schema:artform']
            types_oeuvre = ", ".join(parse_value(artform) for artform in artform_string.split('§'))
            
            # Récupérer la période de création dans la colonne 'crm:P7_took_place_at'
            creation_period_string = row['crm:P7_took_place_at']
            creation_period = parse_value(creation_period_string)
            
            # Récupérer le lieu de création dans la colonne 'schema:locationCreated'
            creation_location_string = row['schema:locationCreated']
            creation_location = parse_value(creation_location_string)

            creation_personne_string = row['schema:creator']
            creation_personne = parse_value(creation_personne_string)

            creation_contributeur_string = row['schema:contributor']
            creation_contributeur = parse_value(creation_contributeur_string)

            creation_influence_string = row['crm:P15_was_influenced_by']
            creation_influence = parse_value(creation_influence_string)
            
            imprime_langue_string = row["crm:P72_has_language"]
            imprime_langue = parse_value(imprime_langue_string)

            imprime_sujet_string = row['dcterms:subject']
            imprime_sujet = parse_value(imprime_sujet_string)

            imprime_condition_string = row['schema:itemCondition']
            imprime_condition = parse_value(imprime_condition_string)

            # Créer la structure JSON (Feature) pour chaque ligne
            feature = {
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                },
                "properties": {
                    "Titre": title,
                    "Type d'œuvre": types_oeuvre,
                    "Commentaire": commentaire,
                    "Lieu de conservation": lieu_conservation,
                    "Cote / numéro": cote,
                    "Période de création": creation_period,
                    "Lieu de création": creation_location,
                    "Personne(s) liée(s) à l'œuvre" : creation_personne,
                    "Contributeur" : creation_contributeur,
                    "Influence": creation_influence,
                    "Langue": imprime_langue,
                    "Sujet": imprime_sujet,
                    "Condition": imprime_condition,
                },
                "type": "Feature"
            }
            
            # Ajouter la donnée à la liste des features
            data.append(feature)
    
    # Écrire les données au format JSON dans un fichier de sortie
    with open(output_json_path, 'w') as json_file:
        json_file.write('var geojson_RAMA = ')
        json.dump({"features": data}, json_file, indent=4, ensure_ascii=False)

# Spécifiez le chemin du fichier CSV en entrée et du fichier JSON en sortie
csv_input_path = '../bases/artwork89.csv'
json_output_path = 'data/artwork89.js'

# Appeler la fonction pour convertir le fichier CSV en JSON
csv_to_json(csv_input_path, json_output_path)

print("Conversion CSV vers JSON réussie !")
