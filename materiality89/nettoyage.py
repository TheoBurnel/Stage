import csv

def nettoyer_identifiant(identifiant):
    # Trouver la position du premier § dans l'identifiant
    index_section = identifiant.find('§')
    if index_section != -1:
        # Retourner l'identifiant tronqué jusqu'au premier §
        return identifiant[:index_section]
    else:
        # Retourner l'identifiant tel quel s'il n'y a pas de §
        return identifiant

def nettoyer_fichier_entree_sortie(fichier_entree, fichier_sortie):
    # Liste pour stocker les lignes modifiées
    lignes_modifiees = []

    # Lecture du fichier CSV d'entrée et modification des identifiants
    with open(fichier_entree, 'r', newline='') as csvfile_entree:
        lecteur_csv = csv.DictReader(csvfile_entree)
        colonnes = lecteur_csv.fieldnames

        for ligne in lecteur_csv:
            identifiant_original = ligne['dcterms:identifier']
            identifiant_nettoye = nettoyer_identifiant(identifiant_original)
        
            # Modifier la valeur de l'identifiant dans la même colonne
            ligne['dcterms:identifier'] = identifiant_nettoye
        
            # Ajouter la ligne modifiée à la liste
            lignes_modifiees.append(ligne)

    # Écriture des lignes modifiées dans le fichier CSV de sortie
    with open(fichier_sortie, 'w', newline='') as csvfile_sortie:
        ecrivain_csv = csv.DictWriter(csvfile_sortie, fieldnames=colonnes)
        ecrivain_csv.writeheader()
        ecrivain_csv.writerows(lignes_modifiees)

    print(f"Modification terminée. Les identifiants ont été nettoyés dans le fichier de sortie : {fichier_sortie}")

# Fichier d'entrée et de sortie pour materiality89.csv
fichier_entree_89 = 'donnees/materiality89.csv'
fichier_sortie_89 = 'donnees/materiality_net.csv'

# Nettoyage du fichier materiality89.csv
nettoyer_fichier_entree_sortie(fichier_entree_89, fichier_sortie_89)

# Fichier d'entrée et de sortie pour materiality88.csv
fichier_entree_88 = 'donnees/materiality88.csv'
fichier_sortie_88 = 'donnees/materiality_net2.csv'

# Nettoyage du fichier materiality88.csv
nettoyer_fichier_entree_sortie(fichier_entree_88, fichier_sortie_88)
