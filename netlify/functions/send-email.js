const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  // Gérer les requêtes OPTIONS (preflight CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Vérifier la clé API
    if (!process.env.RESEND_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Clé API Resend manquante dans les variables d\'environnement' 
        })
      };
    }

    // Parser le body de la requête
    const body = JSON.parse(event.body);
    const {
      candidateEmail,
      candidateName,
      position,
      interviewDate,
      interviewTime,
      duration,
      joinLink,
      recruiterName,
      companyName,
      type = 'invitation' // 'invitation' ou 'reminder'
    } = body;

    // Validation des champs requis
    if (!candidateEmail || !candidateName || !position || !interviewDate || !interviewTime) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Champs requis manquants' 
        })
      };
    }

    let emailData;

    if (type === 'reminder') {
      // Email de rappel
      emailData = {
        from: 'OYA Intelligence <oya@instantmov.fr>',
        to: [candidateEmail],
        subject: `Rappel - Entretien demain à ${interviewTime}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #223049;">Rappel de votre entretien</h2>
            <p>Bonjour ${candidateName},</p>
            <p>Nous vous rappelons que votre entretien pour le poste de <strong>${position}</strong> est prévu demain, ${interviewDate} à ${interviewTime}.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${joinLink}" style="background-color: #ff6a3d; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Rejoindre l'entretien
              </a>
            </div>
            <p>À demain !</p>
            <p>Équipe ${companyName}</p>
          </div>
        `
      };
    } else {
      // Email d'invitation
      emailData = {
        from: 'OYA Intelligence <oya@instantmov.fr>',
        to: [candidateEmail],
        subject: `Invitation entretien - ${position} chez ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-flex; items-center; gap: 12px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ff6a3d, #9b6bff); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 16px; height: 16px; background: white; border-radius: 50%;"></div>
                </div>
                <div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #223049;">oya</h1>
                  <p style="margin: 0; font-size: 14px; color: #666; margin-top: -4px;">intelligence</p>
                </div>
              </div>
            </div>
            
            <h2 style="color: #223049; text-align: center;">Invitation à un entretien</h2>
            
            <p>Bonjour ${candidateName},</p>
            
            <p>Nous avons le plaisir de vous inviter à un entretien pour le poste de <strong>${position}</strong> chez ${companyName}.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #223049;">Détails de l'entretien :</h3>
              <p><strong>📅 Date :</strong> ${interviewDate}</p>
              <p><strong>🕐 Heure :</strong> ${interviewTime}</p>
              <p><strong>⏱️ Durée :</strong> ${duration} minutes</p>
              <p><strong>👤 Recruteur :</strong> ${recruiterName}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${joinLink}" style="background-color: #ff6a3d; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Rejoindre l'entretien
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px;"><strong>💡 Conseils :</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
                <li>Testez votre connexion internet et votre caméra avant l'entretien</li>
                <li>Préparez vos questions sur le poste et l'entreprise</li>
                <li>Ayez votre CV à portée de main</li>
              </ul>
            </div>
            
            <p>Nous avons hâte de vous rencontrer !</p>
            
            <p>Cordialement,<br>
            ${recruiterName}<br>
            Équipe ${companyName}</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              Cet email a été envoyé par OYA Intelligence. Si vous avez des questions, contactez-nous.
            </p>
          </div>
        `
      };
    }

    // Envoyer l'email
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Erreur Resend:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: error.message 
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        messageId: data?.id 
      })
    };

  } catch (error) {
    console.error('Erreur fonction:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Erreur interne du serveur' 
      })
    };
  }
};