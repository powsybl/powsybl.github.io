---
title: Proposition de menu
layout: default
---

# Navbar:
- Documentation (index vers les différentes parties de la documentation sous la forme de cartes)
- Download (mettre à disposition un package itools)
- [Community](../community/index.md)
- Démo? Ajouter un lien sur la page d'accueil?

# Home
- Overview (Présentation du projet powsybl, qu'est-ce que c'est ? A quoi ca sert ? A qui est-ce destiné ?)
- Architecture
    - Présentation des différents repository sous forme de cartes
        - [powsybl-core](../documentation/developer/repositories/powsybl-core.md)
    - Présentation des différents artifacts ?
- [Governance](../overview/governance.md)
- License
- [Contributing](../contributing/index.md)
- Roadmap

# Getting started
- From binaries: expliquer comment lancer une premiere commande iTools à partir du package téléchargeable
- From sources: expliquer comment lancer une première commande iTools à partir des sources
    - Lister les différents pré-requis pour les différents OS
    - Lister toutes les étapes nécessaires pour générer la distribution iTools
- Créer sa propre distribution iTools
    - Quels artifacts pour quelle fonction?


# User documentation
Présentation des différentes (principales?) commandes itools.
- convert-network
- loadflow
- security-analysis
- sensitivity calculation
- dynamic-simulation

==> faire un package avec uniquement ces commandes à chaque release, avec les modules nécessaires et la configuration. On ajoutera le support de quelques formats, des fichiers de données (IEEE , réseaux de tests), basé sur openLF.

# Functional documentation
- Grid modelling
    - Expliquer la modélisation complète du réseau IIDM: caractéristiques, equations...
    - Expliquer les différentes topologies et le concept de vue
    - Donner des exemples de code (Java & C++) sur l'utilisation de l'API
    
- Support grid format
    - Décrire le format ou fournir un lien vers la spécification
    - Indiquer les limitations de l'import/export
    - Expliquer les différences de modélisation et les conversions effectuées
    - Expliquer la configuration

- Simulations:
    - Expliquer les différentes familles de simulation
    - Donner la liste des implémentations disponibles (page dédiée)
    - Donner des exemples de lancement avec iTools
    - Expliquer les différentes entrées / sorties avec spécification des formats (notamment DSL)


- Fonctions avancées
    - Extraction de réseau
    - 
 
# Technical documentation
- OpenLF: documentation complète à écrire
- AFS
- Timeseries
- Computation manager


# Developer documentation
- Lister les différents artifacts
- Expliquer tous les design d'implémentation
    - API de calcul (provider, runner)
    - Extension IIDM
- DSL
- Tutoriels


# A TRIER
- AFS?
- HPC?
- Webservice?
- Configuration?
    ==> Pour la configuration, on pourrait mettre la configuration "classique" dans les différentes pages et un lien vers la description exhaustive du module.
