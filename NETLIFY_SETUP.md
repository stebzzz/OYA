# Configuration Netlify pour l'envoi d'emails

Ce guide explique comment déployer votre application sur Netlify avec la fonction d'envoi d'emails sécurisée.

## 🚀 Déploiement sur Netlify

### 1. Préparer le repository
```bash
# Assurez-vous que votre code est dans un repository Git
git add .
git commit -m "Add Netlify email function"
git push origin main
```

### 2. Connecter à Netlify
1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur "New site from Git"
3. Connectez votre repository GitHub/GitLab/Bitbucket
4. Sélectionnez votre projet

### 3. Configuration du build
Netlify détectera automatiquement la configuration grâce au fichier `netlify.toml` :
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

## 🔐 Configuration des variables d'environnement

### 1. Régénérer la clé API Resend
⚠️ **IMPORTANT**: L'ancienne clé API a été exposée et doit être régénérée !

1. Allez sur [resend.com](https://resend.com)
2. Connectez-vous à votre compte
3. Allez dans "API Keys"
4. Supprimez l'ancienne clé : `re_c62Xs2p3_BhdxRx8HGqEo86LaYPfFmAxY`
5. Créez une nouvelle clé API

### 2. Configurer sur Netlify
1. Dans votre dashboard Netlify, allez dans votre site
2. Cliquez sur "Site settings"
3. Allez dans "Environment variables"
4. Ajoutez la variable :
   - **Key**: `RESEND_API_KEY`
   - **Value**: Votre nouvelle clé API Resend
5. Cliquez sur "Save"

## 📧 Test de la fonction

Une fois déployé, votre fonction sera accessible à :
```
https://votre-site.netlify.app/.netlify/functions/send-email
```

### Test avec curl
```bash
curl -X POST https://votre-site.netlify.app/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "candidateEmail": "test@example.com",
    "candidateName": "Test User",
    "position": "Développeur",
    "interviewDate": "2024-01-15",
    "interviewTime": "14:00",
    "duration": 60,
    "joinLink": "https://meet.example.com/test",
    "recruiterName": "John Doe",
    "companyName": "Test Company",
    "type": "invitation"
  }'
```

## 🔧 Développement local

Pour tester les fonctions Netlify en local :

### 1. Installer Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Créer un fichier .env.local
```bash
# .env.local (ne pas commiter !)
RESEND_API_KEY=votre_nouvelle_cle_api
```

### 3. Démarrer le serveur de développement
```bash
netlify dev
```

Cela démarrera :
- Votre application sur `http://localhost:8888`
- Les fonctions sur `http://localhost:8888/.netlify/functions/`

## 🛡️ Sécurité

✅ **Avantages de cette solution** :
- Clé API sécurisée côté serveur
- Pas de problème CORS
- Validation des données côté serveur
- Logs d'erreur centralisés

⚠️ **Points d'attention** :
- Régénérez toujours les clés API exposées
- Ne commitez jamais les clés dans le code
- Utilisez des variables d'environnement

## 🐛 Dépannage

### Erreur 500 - Missing API Key
- Vérifiez que `RESEND_API_KEY` est bien configurée dans Netlify
- Redéployez le site après avoir ajouté la variable

### Erreur CORS
- Les headers CORS sont configurés dans la fonction
- Vérifiez que vous appelez `/.netlify/functions/send-email`

### Fonction non trouvée
- Vérifiez que le fichier est dans `netlify/functions/`
- Vérifiez que le build s'est bien passé
- Consultez les logs de déploiement Netlify

## 📝 Logs

Pour voir les logs des fonctions :
1. Dashboard Netlify > Votre site
2. "Functions" dans le menu
3. Cliquez sur "send-email"
4. Consultez les logs en temps réel