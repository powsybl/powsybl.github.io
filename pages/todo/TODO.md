# TODO

## CSS
- Nettoyer les classes non définies dans les différents fichiers HTML
- Supprimer les CSS non utilisées
- Trouver un template pygments compatibles avec les daltoniens
    - https://pygments.org/demo/
    - https://github.com/richleland/pygments-css
- Peaufiner le style:
    - Hamburger menu en mode mobile
    
## JS
- Nettoyer le script du template
- Supprimer les scripts JS non utilisés

## Template / Layout 
- _includes/head.html
    - Ajouter les meta informations **keywords** et **description**
- _includes/navbar.html
    - Améliorer le rendu du menu hamburger

## Index
- Ajouter dans le bandeau bleu des pictos de features
Projets:
     - 5è = votre projet ici pour référencer un nouveau projet
Ajouter une section Partners
     - logo des prestataires
     - lien vers leurs sites
     ==> demander l'autorisation
     ==> PARTIELLEMENT FAIT

## Overview > About
- powsybl-afs: voir ci-dessous

## Overview > Roadmap
- Travailler la roadmap (Debut 2021)

## Documentation
- Ajouter une barre de recherche

Index:
- Trouver des icones --> Faire des icones
- Finaliser les description

## Documentation > User stories
- Améliorer le rendu des images
- Ecrire user-stories sur:
     - Extraction THT + export pour envoie ENTSOE (TSO)
     - Merging Function (RSC)
     ==> essayer de trouver des images pertinentes pour illustrer les US

## Documentation > Grid Model
- Mettre un lien vers les extensions dans le paragraphe des equipements
- Faire une 1/2 journée de workshop dédiée pour passer en revue tous les TODO

## Documentation > Grid Extensions
- Regrouper les extensions par extendable

## Download
- Changer la largeur du tableau de la page download

## powsybl-afs
Description: ajouter le fait que les données sont "métier"
(input/output) de l'ecosysteme powsybl, organisées hierarchiquement mais
aussi avec des dependances fonctionnelles. Sert à construire une étude
de réseau sous la forme d'un graphe de dépendances fonctionnelles
     ==> faire un résumé

## Configuration
- déplacer les fichiers dans les bonnes sections "fonctionnelles"
- retravailler le contenu pour supprimer toutes les références aux classes
- créer un index global
- Faire des issues pour nettoyer la configuration des noms complets de
classes

Ajouter les conventions d'écriture dans le README du site
- chemin <PREFIX> vs $PREFIX
- répertoires d'images (img/nom_de_la_page)
- liens invalides [texte]()
- referencer les artefacts: com.powsybl:powsybl-iidm-scripting
- Créer un SVG pour avoir les pictos des equipements

