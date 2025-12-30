# 🎓 BaccAnalyst Morocco - Votre Compagnon IA pour le Bac

BaccAnalyst Morocco est une application web intelligente conçue pour aider les élèves marocains à préparer leur Baccalauréat. Grâce à la puissance de **Gemini 2.5 Flash**, l'application analyse vos sujets d'examen et génère des corrigés détaillés, étape par étape, selon les standards du **Bac Maroc (Option Français/BIOF)**.

![Aperçu de l'application](https://github.com/mbf1972/bacmorocco/raw/main/metadata.json) <!-- Optionnel: Vous pouvez ajouter un screenshot ici -->

## 🚀 Fonctionnalités Clés

- **📸 Capture Photo Directe** : Prenez une photo de votre examen directement depuis l'application via la caméra de votre appareil.
- **📄 Support Multi-fichiers** : Importez vos examens au format PDF, JPG ou PNG.
- **🤖 Analyse Intelligente** : Utilise l'IA de pointe (Gemini) pour résoudre des problèmes mathématiques et scientifiques complexes.
- **📝 Solutions Détaillées** : Les réponses sont fournies ligne par ligne avec une explication pédagogique complète.
- **⚛️ LaTeX de Haute Qualité** : Rendu parfait de toutes les formules mathématiques grâce à KaTeX.
- **🌍 Adapté au Maroc** : Conçu spécifiquement pour le cadre référentiel du Baccalauréat Marocain.

## 🛠️ Installation Locale

Suivez ces étapes pour faire tourner le projet sur votre machine :

1. **Cloner le projet** :

   ```bash
   git clone https://github.com/mbf1972/bacmorocco.git
   cd bacmorocco
   ```

2. **Installer les dépendances** :

   ```bash
   npm install
   ```

3. **Configuration de l'API** :
   Créez un fichier `.env.local` à la racine et ajoutez votre clé API Gemini :

   ```env
   GEMINI_API_KEY=votre_cle_api_ici
   ```

4. **Lancer l'application** :
   ```bash
   npm run dev
   ```

## 🧰 Technologies Utilisées

- **Framework** : React + Vite
- **IA** : Google Generative AI (Gemini 2.5 Flash)
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Maths** : KaTeX + ReactMarkdown

---

_Développé pour aider les étudiants marocains dans leur réussite scolaire._ 🇲🇦
