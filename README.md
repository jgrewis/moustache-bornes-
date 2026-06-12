# Moustache — Site de location de bornes photo

Site vitrine multi-pages avec demande de devis, pour la location de bornes photo à Mulhouse et dans un rayon de 100 km (Alsace).

🔗 **Démo en ligne : [jgrewis.github.io/moustache-bornes](https://jgrewis.github.io/moustache-bornes/)**

---

## Stack technique

- **Astro 4** — générateur de site statique (SSG), zéro JS par défaut
- **CSS vanilla** organisé en design tokens + modules
- **Polices** — Playfair Display (titres) + Inter (corps), via Google Fonts
- **Formulaire** — prêt pour Netlify Forms ou Formspree (un seul attribut à changer)
- **Pas de dépendance lourde** (pas de framework UI, pas de Tailwind, pas de tracker)

---

## Installation & lancement

Pré-requis : **Node.js ≥ 18.17** et npm.

```bash
npm install        # installe Astro
npm run dev        # serveur de dev sur http://localhost:4321
npm run build      # génère le site statique dans /dist
npm run preview    # sert /dist localement (test prod)
```

---

## Structure du projet

```
public/
├── _headers              # en-têtes HTTP Netlify (CSP, HSTS, XFO…)
├── favicon.svg
├── robots.txt
└── scripts/site.js       # JS unique (nav, FAQ, form, scroll reveal)

src/
├── layouts/BaseLayout.astro     # HTML, SEO, header/footer, scripts
├── components/                  # composants Astro réutilisables
│   ├── SeoHead.astro            # meta, OG, JSON-LD LocalBusiness
│   ├── Header.astro / Footer.astro
│   ├── Hero.astro / CtaBanner.astro
│   ├── BorneCard.astro / FormuleCard.astro
│   ├── ParcoursStep.astro / FaqItem.astro
│   ├── GalerieGrid.astro / DevisForm.astro
├── data/                        # données du site (édition rapide)
│   ├── site.js                  # nom, contact, villes, navigation
│   ├── bornes.js                # 3 modèles : Classique, Miroir, Open-Air
│   ├── formules.js              # 3 formules : envoi, sur place, entreprise
│   └── faq.js                   # 8 questions/réponses
├── styles/
│   ├── tokens.css               # variables : couleurs, typo, espacements
│   ├── reset.css / base.css / utilities.css
│   └── components/              # un fichier CSS par groupe de composants
└── pages/                       # une page = un fichier .astro
    ├── index.astro              # Accueil
    ├── bornes.astro             # Catalogue
    ├── comment-ca-marche.astro  # Les 2 parcours (livraison / sur place)
    ├── tarifs.astro
    ├── galerie.astro
    ├── faq.astro
    ├── contact.astro            # Formulaire de devis
    ├── mentions-legales.astro   # À compléter
    ├── cgv.astro                # À compléter
    ├── confidentialite.astro    # À compléter
    └── 404.astro

netlify.toml                     # config Netlify (build + headers)
astro.config.mjs                 # config Astro
```

---

## Personnalisation rapide

Tout le contenu modifiable rapidement vit dans **`src/data/`** :

- **Coordonnées, villes, navigation** : `src/data/site.js` — remplacer `[email à compléter]` et `[téléphone à compléter]` dès que disponibles.
- **Modèles de bornes** : `src/data/bornes.js`
- **Formules & tarifs** : `src/data/formules.js` — remplacer `[tarif]` par les vrais prix.
- **FAQ** : `src/data/faq.js`

Les couleurs et polices sont dans **`src/styles/tokens.css`** (variables CSS).

---

## Brancher le formulaire de devis

Le formulaire (`src/components/DevisForm.astro`) est prêt à recevoir un endpoint. Deux options :

### Option A — Netlify Forms (recommandé, gratuit jusqu'à 100 soumissions/mois)

Dans `DevisForm.astro`, sur la balise `<form>`, ajouter l'attribut `data-netlify="true"` et garder `name="devis"`. Le honeypot `bot-field` est déjà en place. Configurer l'adresse de notification dans le dashboard Netlify une fois le site déployé.

### Option B — Formspree

Remplacer `action="#"` par `action="https://formspree.io/f/VOTRE_ID"` dans `<form>`.

Dans les deux cas, **mettre à jour la CSP** dans `public/_headers` et `netlify.toml` (`form-action` autorise déjà `https://formspree.io`).

---

## Sécurité

- **CSP stricte** appliquée via `public/_headers` (Netlify) et `netlify.toml` : `default-src 'self'`, pas de JS inline, sources Google Fonts limitées.
- **HSTS**, **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**, **Referrer-Policy** configurés.
- **Honeypot** anti-spam + validation côté client. Validation serveur déléguée à Netlify Forms / Formspree.
- **JSON-LD** échappé contre injection.
- Aucun secret en dur, aucun analytics, aucun cookie tiers → pas de bandeau RGPD nécessaire au lancement.

---

## Accessibilité

- HTML sémantique, `<html lang="fr">`, skip-link, `aria-current` sur la nav, `aria-expanded`/`aria-controls` sur FAQ et menu mobile.
- Contraste WCAG AA validé (texte muted assombri à `#595959`).
- Focus ring 2 couches (doré + halo sombre) pour 3:1 sur tous les fonds.
- Cibles tactiles ≥ 44 px partout, formulaire validé clavier + lecteur d'écran.
- Respect de `prefers-reduced-motion`.

---

## Déploiement

### GitHub Pages (démo actuelle)

Le site est déployé sur la branche `gh-pages` (build statique avec chemins préfixés `/moustache-bornes/`).

### Netlify (recommandé pour la production)

1. Sur Netlify : "New site from Git" → sélectionner le repo.
2. Build command : `npm run build`. Publish directory : `dist/`.
3. Tout est déjà configuré (`netlify.toml`, `_headers`, formulaire).
4. Ajouter le domaine custom + HTTPS automatique.

### Autres hébergeurs (Cloudflare Pages, Vercel, OVH...)

- Build : `npm run build`
- Output : dossier `dist/`
- Pour appliquer les headers de sécurité hors Netlify : adapter `_headers` au format de l'hébergeur (Cloudflare Pages lit aussi `_headers`, Vercel utilise `vercel.json`).

---

## TODO avant mise en ligne

- [ ] Renseigner email + téléphone dans `src/data/site.js`
- [ ] Compléter les tarifs dans `src/data/formules.js`
- [ ] Rédiger les pages légales : `mentions-legales.astro`, `cgv.astro`, `confidentialite.astro`
- [ ] Remplacer les placeholders photos par les vraies images (bornes, galerie)
- [ ] Créer une image Open Graph 1200×630 dans `public/images/og-image.jpg` (mettre à jour `SeoHead.astro`)
- [ ] Brancher le formulaire (Netlify Forms ou Formspree) + configurer la notification email
- [ ] (Optionnel) Self-host les polices Google Fonts pour zéro fuite RGPD

---

## Pistes d'évolution

- **Galerie photo** — passer les placeholders en vraies images optimisées (composant `<Image>` d'Astro pour WebP/AVIF automatique).
- **Analytics privacy-friendly** — Plausible ou Umami si besoin de mesurer le trafic, sans bandeau cookies.
- **Calendrier de disponibilité** — affichage public des dates libres (lecture d'un Google Calendar ou base type Notion).
- **Espace admin léger** — gestion des demandes de devis (Airtable, Notion ou un petit back Astro SSR).
- **Multilingue FR/DE** — pertinent vu la proximité avec Bâle / Allemagne (Astro i18n natif).
- **Témoignages clients** — section avec verbatims et photos d'événements.

---

© Moustache — Tous droits réservés.
