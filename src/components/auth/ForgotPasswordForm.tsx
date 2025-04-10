import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';

export const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(email);
        setEmailError(isValid ? '' : 'Veuillez entrer une adresse email valide');
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation de l'email
        if (!validateEmail(email)) return;
        
        setLoading(true);
        setError(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (error) {
            const errorCode = (error as any).code;
            let errorMessage = "Une erreur s'est produite lors de l'envoi de l'email de réinitialisation.";

            switch (errorCode) {
                case 'auth/invalid-email':
                    errorMessage = "L'adresse email est mal formatée.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "Aucun compte ne correspond à cette adresse email.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage = "Problème de connexion réseau. Vérifiez votre connexion internet.";
                    break;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-card w-full max-w-md animate-fade-in">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <Mail className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold font-heading text-gray-800">Mot de passe oublié</h1>
                    <p className="text-gray-500 mt-2 text-center">Nous vous enverrons un lien pour réinitialiser votre mot de passe</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start" role="alert" aria-live="assertive">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-start" role="alert" aria-live="assertive">
                            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            <div>
                                <p>Un email de réinitialisation a été envoyé à <strong>{email}</strong>.</p>
                                <p className="mt-2">Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.</p>
                            </div>
                        </div>
                        <Link 
                            to="/login" 
                            className="btn btn-primary py-2.5 px-4 rounded-md transition-all duration-200 flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white mx-auto"
                            aria-label="Retour à la page de connexion"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Retour à la connexion
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) validateEmail(e.target.value);
                                    }}
                                    onBlur={() => validateEmail(email)}
                                    className={`input pl-10 py-2.5 w-full rounded-md border ${emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'} shadow-sm focus:ring focus:ring-opacity-50`}
                                    placeholder="votre@email.com"
                                    aria-invalid={!!emailError}
                                    aria-describedby={emailError ? "email-error" : undefined}
                                    required
                                />
                            </div>
                            {emailError && (
                                <p id="email-error" className="mt-1 text-sm text-red-600">{emailError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-2.5 px-4 rounded-md transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 hover:bg-primary-600 text-white"
                            aria-busy={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Envoi en cours...
                                </>
                            ) : (
                                'Envoyer le lien de réinitialisation'
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Retour à la connexion
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};