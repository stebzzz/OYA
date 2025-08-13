import * as React from 'react';

interface EmailTemplateProps {
  candidateName: string;
  position: string;
  interviewDate: string;
  interviewTime: string;
  duration: number;
  joinLink: string;
  recruiterName: string;
  companyName: string;
}

export const InterviewInvitationTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  candidateName,
  position,
  interviewDate,
  interviewTime,
  duration,
  joinLink,
  recruiterName,
  companyName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9' }}>
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #ff6a3d, #9b6bff)', borderRadius: '50%', marginRight: '15px' }}></div>
          <div>
            <h1 style={{ color: '#223049', fontSize: '24px', margin: '0', fontWeight: 'bold' }}>OYA</h1>
            <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>intelligence</p>
          </div>
        </div>
        <h2 style={{ color: '#223049', fontSize: '24px', margin: '0' }}>Invitation à un entretien</h2>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Bonjour <strong>{candidateName}</strong>,
        </p>
        
        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Nous avons le plaisir de vous inviter à un entretien pour le poste de <strong>{position}</strong> chez {companyName}.
        </p>

        {/* Interview Details */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', margin: '20px 0', border: '1px solid #e9ecef' }}>
          <h3 style={{ color: '#223049', margin: '0 0 15px 0', fontSize: '18px' }}>Détails de l'entretien</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#666', minWidth: '80px', fontSize: '14px' }}>📅 Date:</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{interviewDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#666', minWidth: '80px', fontSize: '14px' }}>🕐 Heure:</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{interviewTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#666', minWidth: '80px', fontSize: '14px' }}>⏱️ Durée:</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{duration} minutes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#666', minWidth: '80px', fontSize: '14px' }}>💻 Type:</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>Visioconférence</span>
            </div>
          </div>
        </div>

        {/* Join Button */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a 
            href={joinLink}
            style={{
              display: 'inline-block',
              backgroundColor: '#ff6a3d',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(255, 106, 61, 0.3)'
            }}
          >
            🎥 Rejoindre l'entretien
          </a>
        </div>

        {/* Instructions */}
        <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4 style={{ color: '#1976d2', margin: '0 0 10px 0', fontSize: '16px' }}>Instructions importantes:</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#333' }}>
            <li style={{ marginBottom: '5px' }}>Cliquez sur le lien 5 minutes avant l'heure prévue</li>
            <li style={{ marginBottom: '5px' }}>Assurez-vous d'avoir une connexion internet stable</li>
            <li style={{ marginBottom: '5px' }}>Testez votre caméra et microphone au préalable</li>
            <li>Préparez vos questions sur le poste et l'entreprise</li>
          </ul>
        </div>

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Si vous avez des questions ou un empêchement, n'hésitez pas à me contacter directement.
        </p>

        <p style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
          Nous avons hâte de vous rencontrer !
        </p>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '30px' }}>
        <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
          Cordialement,<br/>
          <strong>{recruiterName}</strong><br/>
          Équipe Recrutement - {companyName}
        </p>
      </div>

      {/* Powered by */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
          Entretien alimenté par OYA Intelligence
        </p>
      </div>
    </div>
  </div>
);