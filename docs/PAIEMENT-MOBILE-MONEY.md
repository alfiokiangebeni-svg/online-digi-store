# Paiement Mobile Money

Un seul agrégateur couvrant les trois grands opérateurs (M-Pesa, Airtel Money, Orange Money) + Afrimoney. Accepter un seul opérateur fait perdre la majorité des clients.

## Agrégateurs à évaluer

| Agrégateur | Points connus | À obtenir |
| --- | --- | --- |
| FlexPay | Agrégateur congolais autorisé par la Banque Centrale du Congo ; M-Pesa, Airtel, Orange, Afrimoney | Frais, délai de reversement, API payout |
| CinetPay | Couvre la RDC ; modules e-commerce | Opérateurs RDC actifs, support CDF |
| pawaPay | Intégré à Shopify, plusieurs marchés africains | Couverture RDC exacte, frais |
| MaxiCash | Actif en RDC | API, frais, KYC |

Frais de marché indicatifs : 1,5 à 3,5 % par transaction. Plafond autour de 2 000 à 2 500 USD par paiement selon l'opérateur. **Obtenir une offre écrite d'au moins deux agrégateurs.**

## Prérequis administratifs

- [ ] RCCM
- [ ] Identification nationale
- [ ] NIF
- [ ] Compte bancaire professionnel
- [ ] Dossier KYC marchand validé chez l'agrégateur

## Flux de paiement

1. Le client saisit son numéro → `lib/operators.ts` détecte l'opérateur et affiche son logo.
2. `POST /api/checkout` crée la commande (`status = pending`) et envoie la demande de paiement à l'agrégateur.
3. Le client reçoit la demande sur son téléphone et tape son PIN.
4. L'agrégateur appelle `POST /api/webhooks/payment` :
   - vérifier la signature ;
   - re-vérifier le statut via l'API de l'agrégateur ;
   - ignorer si la transaction est déjà traitée (idempotence).
5. Si payé → commande `paid`, lien signé généré, envoi WhatsApp + SMS, tampon « LIVRÉ » à l'écran.
6. Si échec ou délai dépassé (2 min) → bouton « Réessayer » en un clic.

> Ne jamais livrer sur la base du retour navigateur.

## Cas d'échec à gérer

| Cas | Message au client |
| --- | --- |
| PIN refusé | « Code incorrect. Réessaie. » |
| Solde insuffisant | « Solde insuffisant sur ton compte {opérateur}. » |
| Délai dépassé | « Pas de réponse. Vérifie ton téléphone ou réessaie. » |
| Opérateur indisponible | Proposer un autre opérateur ou la carte bancaire |

## Détection de l'opérateur (à confirmer avec l'agrégateur)

| Opérateur | Préfixes |
| --- | --- |
| Vodacom M-Pesa | 081, 082, 083 |
| Orange Money | 084, 085, 089 |
| Airtel Money | 097, 098, 099 |
| Africell Afrimoney | 090 |

## Devises

- Prix de référence stocké en USD.
- Taux USD → CDF mis à jour chaque jour, arrondi à 50 CDF.
- Le client choisit la devise de paiement.

## Opérations

- **Rapprochement nocturne** : paiements reçus vs commandes livrées, alerte en cas d'écart.
- **Reversement vendeurs (V2)** : API payout de l'agrégateur, après déduction de la commission.
- **Diaspora** : carte Visa / Mastercard via le même agrégateur si possible.

## Tests avant production

- [ ] 20 paiements sandbox par opérateur, en CDF et en USD
- [ ] Webhook reçu deux fois → une seule livraison
- [ ] Webhook avec mauvaise signature → rejeté
- [ ] Délai dépassé → commande annulée proprement
