# di.si store — état des boutons

Audit initial (étape 1) : 263 éléments cliquables, 237 OK, 19 partiels, 7 sans effet.
Après l'étape 3 : aucun bouton sans effet sur les écrans audités (`e2e/audit.spec.ts`, 14 écrans depuis l'étape 4).

| Bouton                                 | Écran                  | Statut avant                                 | Correction                                                        | Test associé (`e2e/`)            |
| -------------------------------------- | ---------------------- | -------------------------------------------- | ----------------------------------------------------------------- | -------------------------------- |
| Retour                                 | Fiche produit, lecteur | Cassé (lien fixe, perdait l'écran précédent) | Revient à l'écran précédent ; accueil si lien direct              | `boutons` › Retour ×2            |
| Réessayer                              | Hors connexion         | Cassé (rechargeait la page hors-ligne)       | Recharge la page demandée, relance auto au retour du réseau       | `boutons` › Hors connexion       |
| Liens d'une URL inconnue               | 404                    | Cassé (cul-de-sac, page anglaise)            | 404 boutique en fr/ln/en : Accueil, Explorer, WhatsApp            | `boutons` › pages 404            |
| Ajout rapide (+)                       | Accueil, Explorer      | Partiel (aucun retour)                       | Message + état « Ajouté », bouton « Voir »                        | `boutons` › ajout rapide         |
| Ajouter au panier / Acheter maintenant | Fiche produit          | Partiel                                      | Message, vibration, passage au panier                             | `boutons` › Achat                |
| Retirer                                | Panier                 | Partiel (sans annulation)                    | Message avec « Annuler »                                          | `boutons` › Retirer puis Annuler |
| Carte bancaire                         | Panier                 | Partiel (choix sans suite)                   | « Bientôt disponible », Mobile Money reste choisi                 | `boutons` › carte                |
| Payer (Mobile Money)                   | Panier                 | OK (démo)                                    | Erreurs avec « Réessayer », succès avec vibration                 | `boutons` › échecs puis succès   |
| Récupérer le coupon                    | Accueil                | Partiel                                      | Message ; coupon appliqué au panier                               | `boutons` › coupon               |
| Favori                                 | Fiche produit          | Partiel                                      | Message ajout / retrait                                           | `boutons` › favoris              |
| Partager WhatsApp                      | Fiche produit          | OK                                           | —                                                                 | `boutons` › partage              |
| Offrir                                 | Fiche produit          | Partiel                                      | Numéro vérifié, message + « Voir le panier »                      | `boutons` › Offrir               |
| Aperçus                                | Fiche produit          | Sans effet                                   | Agrandissement avec précédent / suivant / fermer                  | `boutons` › aperçus              |
| Télécharger                            | Bibliothèque           | Partiel                                      | Progression + message « Téléchargé »                              | `boutons` › Bibliothèque         |
| Ouvrir                                 | Bibliothèque           | Sans effet                                   | Lecteur : écoute (musique), « Bientôt disponible » (livres, apps) | `boutons` › lecteur              |
| Contrôle parental / code PIN           | Compte                 | Partiel                                      | Message « Code enregistré »                                       | `boutons` › Compte               |
| CDF / USD                              | En-tête                | OK                                           | —                                                                 | `boutons` › devise               |
| Données légères                        | Compte                 | Partiel (effet invisible)                    | Moins d'images, visuels réduits                                   | `boutons` › données légères      |
| Langue                                 | Pied de page           | OK                                           | —                                                                 | `boutons` › langue               |
| Recherche, filtres, Effacer            | Explorer               | OK                                           | —                                                                 | `boutons` › Recherche et filtres |
| Tous les autres boutons                | 10 écrans              | —                                            | Chacun doit produire un effet                                     | `audit` (10 tests)               |

## Nouveaux boutons (étapes 4 et 5)

| Bouton                                                           | Écran                                     | Statut avant                      | Ajout                                                                        | Test associé (`e2e/`)                             |
| ---------------------------------------------------------------- | ----------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| Onglets Accueil · Catégories · Vendre · Panier · Compte          | Barre du bas                              | Explorer / Bibliothèque           | Nouvelle barre, Mes achats dans Compte                                       | `navigation` › Barre du bas                       |
| Recherche permanente, notifications                              | En-tête                                   | Recherche sur l'accueil seulement | Sur tous les onglets ; cloche avec notifications (démo)                      | `navigation` › En-tête                            |
| Recherche vocale, scan                                           | En-tête                                   | Absent                            | Pont Android (voix, lecteur de codes Google) ; masqués si non pris en charge | `recherche-native` (6 tests)                      |
| Filtres type, meublé, contrat, télétravail, secteur, tri         | Pages Immobilier, Emploi, Appels d'offres | Absent                            | Filtres dans l'adresse (partageables)                                        | `annonces` › filtres                              |
| Réserver une visite                                              | Annonce immobilière                       | Absent                            | Jour, créneau, numéro → « Réservé »                                          | `annonces` › visite                               |
| Payer la caution / l'acompte                                     | Annonce immobilière                       | Absent                            | Mobile Money (échecs + Réessayer)                                            | `annonces` › caution                              |
| Voir sur la carte, Contacter sur WhatsApp, Alerte                | Annonce immobilière                       | Absent                            | Google Maps, WhatsApp, alerte enregistrée                                    | `annonces` › carte                                |
| Visite vidéo                                                     | Annonce immobilière                       | Absent                            | « Bientôt disponible »                                                       | `annonces` › carte                                |
| Postuler, Envoyer mon CV, Sauvegarder l'offre                    | Offre d'emploi                            | Absent                            | Champs vérifiés, CV joint, suivi dans Mes activités                          | `annonces` › postuler, CV                         |
| Cahier des charges, Poser une question, Soumissionner            | Appel d'offres                            | Absent                            | Document copiable, WhatsApp, offre avec documents requis                     | `annonces` › soumission                           |
| Demander un devis, Publier un appel d'offres                     | Page Appels d'offres                      | Absent                            | Demande enregistrée ; formulaire Vendre                                      | `annonces` › acheteur                             |
| Lire un extrait, format, lecteur                                 | Livre                                     | Lecteur « bientôt »               | Extrait gratuit, choix du format, pages + reprise                            | `fiches` › Livres, `boutons` › lecteur            |
| Voir les captures, avertissement parental                        | Application                               | Absent                            | Galerie, notes de mise à jour, compatibilité                                 | `fiches` › Applications                           |
| Acheter le titre / l'album, playlist, mini-lecteur               | Musique                                   | Extrait seul                      | Titres, playlist dans Compte, lecteur persistant                             | `fiches` › Musique                                |
| Licence, Télécharger en HD                                       | Images                                    | Absent                            | Filigrane, licence ×3, HD en bibliothèque                                    | `fiches` › Images                                 |
| Partager (WhatsApp, Facebook, copier), Signaler, Contacter, Avis | Toutes les fiches                         | WhatsApp seul                     | Feuille de partage, motif obligatoire, note 1–5                              | `fiches` › Actions communes, `boutons` › partager |
| Publier (brouillon, aperçu), Booster, Supprimer, Répondre        | Vendre                                    | WhatsApp seul                     | Espace vendeur complet                                                       | `vendre` (4 tests)                                |

Restent simulés (démo, sans serveur) : paiement Mobile Money, téléchargement, envoi du cadeau par SMS.
Démo sans serveur : visites, cautions, candidatures, offres, devis, avis, signalements et annonces publiées sont enregistrés sur le téléphone ; « Contacter » ouvre WhatsApp vers le support.

## Mesures avant / après (étape 6)

Avant = APK du début de la mission (commit `60f10c3`) ; après = APK de l'étape 6.
Démarrage mesuré sur le site embarqué dans l'APK, téléphone simulé (Pixel 7, processeur ralenti ×4), médiane de 7 ouvertures de l'accueil.

| Mesure                         | Avant      | Après    | Écart                                                 |
| ------------------------------ | ---------- | -------- | ----------------------------------------------------- |
| Taille de l'APK                | 7,24 Mo    | 16,07 Mo | +122 % (limite +10 % : dépassée, à réduire plus tard) |
| Site embarqué (non compressé)  | 25 Mo      | 54 Mo    | 3 langues × 174 pages, chaque page en 3 fichiers      |
| Code Android (dex compressé)   | —          | 2,0 Mo   | Lecteur de codes Google                               |
| Premier affichage de l'accueil | 204–280 ms | 248 ms   | ≈ identique                                           |
| Accueil chargé                 | 443–479 ms | 516 ms   | +40 à +70 ms                                          |
| JavaScript de l'accueil        | 458 Ko     | 484 Ko   | +6 %                                                  |

Pistes pour revenir sous la limite (non appliquées, à décider) : retirer `/design` et la page hors ligne de l'APK, compresser le code Android (R8), supprimer les fichiers de navigation en double, alléger les textes envoyés à chaque page ; en dernier recours, retirer le scan ou réduire le catalogue de démo.
