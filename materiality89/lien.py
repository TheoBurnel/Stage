import pandas as pd

# Chemin vers vos fichiers CSV
chemin_fichier1 = "donnees/localisation.csv"
chemin_fichier2 = "donnees/localisation_2.csv"

# Charger les fichiers CSV en DataFrames
df1 = pd.read_csv(chemin_fichier1)
df2 = pd.read_csv(chemin_fichier2)

# Concaténer les DataFrames en un seul
df_combined = pd.concat([df1, df2], ignore_index=True)

# Chemin vers le fichier de sortie combiné
chemin_sortie = "donnees/bases.csv"

# Enregistrer le DataFrame combiné dans un nouveau fichier CSV
df_combined.to_csv(chemin_sortie, index=False)

print("Les fichiers CSV ont été combinés avec succès.")
