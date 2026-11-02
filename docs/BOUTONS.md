# di.si store — état des boutons

Audit initial (étape 1) : 263 éléments cliquables, 237 OK, 19 partiels, 7 sans effet.
Après l'étape 3 : aucun bouton sans effet sur les 10 écrans audités (`e2e/audit.spec.ts`).

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

Restent simulés (démo, sans serveur) : paiement Mobile Money, téléchargement, envoi du cadeau par SMS.
« Devenir vendeur » ouvre WhatsApp en attendant l'onglet Vendre (étapes 4–5).
