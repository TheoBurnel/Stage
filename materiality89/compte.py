import pandas as pd
from collections import Counter

# Chemin vers votre fichier CSV
chemin_fichier_csv = "../../bases/materiality89.csv"

# Charger le fichier CSV dans un DataFrame pandas
df = pd.read_csv(chemin_fichier_csv)

# Vérifier le nom exact de la colonne contenant les données d'artMedium
colonne_art_medium = 'dcterms:references'

# Initialiser un compteur pour les noms d'artMedium
compteur_noms = Counter()

# Parcourir chaque ligne du DataFrame
for index, row in df.iterrows():
    if isinstance(row[colonne_art_medium], str):  # S'assurer que la valeur est une chaîne de caractères
        noms = row[colonne_art_medium].split('§')  # Séparer les noms par '§'
        compteur_noms.update(noms)  # Mettre à jour le compteur avec les noms

# Afficher les noms d'artMedium et leurs occurrences
print("Noms d'artMedium et leurs occurrences :")
for nom, occurrence in compteur_noms.items():
    print(f"{nom.strip()}: {occurrence}")

# Nombre de résultats différents (noms d'artMedium uniques)
nombre_resultats_differents = len(compteur_noms)

print(f"\nNombre de résultats différents : {nombre_resultats_differents}")
