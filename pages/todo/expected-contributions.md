Ce document identifie les contributions attendues sur le site web et les personnes/projets a priori compétents pour les réaliser.

**Guidelines pour la mise à jour du site en continu** :

- quand un projet ou un utilisateur pose une question, le renvoyer vers la documentation. Si elle n'existe pas, au lieu d'envoyer un contenu par email, remplir la page de documentation correspondante et envoyer le lien vers la page
- lors de la rédaction, reprendre les plans proposés pour les pages existantes (notamment pour les tutoriels)
- essayer de vulgariser les pages fonctionnelles (ne pas faire référence au Java), documenter les API dans la section dédiée


# Sujets généraux

- Cosmétique : 
  - trouver des icônes plus sympa pour les features de la page d'accueil
  - améliorer les icônes de l'index de la documentation

- Ajouter une barre de recherche dans la page de documentation : Jon (OK)

# Home

- Projets utilisateurs : 
  - remplir page de présentation GridSuite : Geoffroy, Michaël, Christine
  - remplir page de présentation SafeT : Michaël, Mathieu, MHP

- Partenaires : demander leur accord aux entreprises citées dans la section de la page d'accueil : Lucian

# Overview

- Roadmap : Lucian et Anne

# Documentation

- Utilisateur
  - configuration : enlever les références en dur aux classes Java, repenser l'organisation pour décider si on fait porter les infos sur la conf par les pages de description des features (ex : load flow) ou par les pages de configuration
  - user story autour de SEA : Sylvain Leclerc, Anne
  - user story autour du merging : équipes core-merging/GridSuite
  - user story autour de l'extraction de réseau : Mathieu, Stéphane Fliscounakis, Benjamin Donnot, Antoine Marot
  - user story autour de ImaGrid : Anne

- Modèle de réseau
  - topologie : Mathieu
  - composantes connexes : Mathieu
  - schémas : Florian
  - extensions : Miora
  - shunts : Miora
  - dangling lines : Anne
  - merging : core merging, GridSuite, Silicom sur la merging view

- Formats d'import-export
  - CGMES : AIA, Anne, Miora
  - UCTE : Sébastien Murgey/équipe core-merging
  - Matpower : TechRain
  - IEEE : Geoffroy
  - PSS/E : JB et Geoffroy, peut-être AIA
  - XIIDM : Miora, Mathieu
  - AMPL : Naza/Ringo ?

- Simulateurs
  - Security analysis : relecture, AS avec parade : SEA
  - Dynawo: AIA, Mathieu, Agnès, équipe Dynawo
  - Open Load Flow : Geoffroy, Anne

- HPC : Sylvain Leclerc, Paul Bui-Quang

- Data management
  - AFS : Paul Bui-Quang

- Microservices
  - architecture : GridSuite
  - documenter chaque microservice pour expliquer à quoi il sert/comment il fonctionne : GridSuite

- Développeur
  - repositories : tenir à jour la liste des repos et les versions : TSC powsybl. Jon a mis des liens qui pointent toujours vers la dernière version des repos mais il faudra tenir la liste des repos à jour et pour les microservices pointer vers les images docker quand il y en aura.
  - artifacts : tenir à jour : TSC powsybl
  - patterns :
    - définir ce qu'on souhaite décrire
    - extensions, computation manager, variant, etc ?
    - comment intégrer un importer : TechRain, AIA ?
    - comment intégrer un exporter : TechRain, AIA ?
  - guide d'API
    - contingences : Mathieu
    - time series : à reprendre par Paul Bui-Quang, peut-être avec un use case ou un tuto ?
    - définir ce qu'on souhaite écrire 
      
  - tutoriels
    - création d'un réseau from scratch basé sur FourSubstationsNodeBreakerFactory
    - création d'une extension
    - manipulation de la topologie
    - import export CSV
    - à compléter

# Download

Créer une nouvelle distribution sur powsybl 3.5.0 : Miora
Finir la release et mettre à jour les liens : Miora

# Community

Evénements : Lucian, Anne, Boris
