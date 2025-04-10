import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, AlertCircle, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

type ValidationErrors = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

export const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const { signUp, loading, error, user } = useAuthStore();
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const navigate = useNavigate();

    // Critères de mot de passe
    const passwordCriteria = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password)
    };

    useEffect(() => {
        // Rediriger si l'utilisateur est déjà connecté
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        
        // Validation du nom
        if (!name.trim()) {
            errors.name = 'Le nom est requis';
        } else if (name.trim().length < 2) {
            errors.name = 'Le nom doit contenir au moins 2 caractères';
        }
        
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            errors.email = 'L\'email est requis';
        } else if (!emailRegex.test(email)) {
            errors.email = 'Veuillez entrer une adresse email valide';
        }
        
        // Validation du mot de passe
        if (!password) {
            errors.password = 'Le mot de passe est requis';
        } else if (password.length < 8) {
            errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        } else if (!(passwordCriteria.hasUppercase && 
                     passwordCriteria.hasLowercase && 
                     passwordCriteria.hasNumber)) {
            errors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
        }
        
        // Validation de la confirmation du mot de passe
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Nous stockerons le nom d'utilisateur dans un autre endroit après l'inscription
            // car Firebase Auth n'accepte que email et password pour l'inscription
            await signUp(email, password);
            
            // Remarque: en production, il faudrait ensuite mettre à jour le profil de l'utilisateur
            // avec son nom complet après l'inscription
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-card w-full max-w-md animate-fade-in">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold font-heading text-gray-800">Créer un compte Oya</h1>
                    <p className="text-gray-500 mt-2 text-center">Rejoignez la plateforme d'intérim innovante</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start" role="alert" aria-live="assertive">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (validationErrors.name) validateForm();
                                }}
                                onBlur={validateForm}
                                className={`input pl-10 py-2.5 w-full rounded-md border ${
                                    validationErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                                } shadow-sm focus:ring focus:ring-opacity-50`}
                                placeholder="Votre nom complet"
                                aria-invalid={!!validationErrors.name}
                                aria-describedby={validationErrors.name ? "name-error" : undefined}
                                required
                            />
                        </div>
                        {validationErrors.name && (
                            <p id="name-error" className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                        )}
                    </div>

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
                                    if (validationErrors.email) validateForm();
                                }}
                                onBlur={validateForm}
                                className={`input pl-10 py-2.5 w-full rounded-md border ${
                                    validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                                } shadow-sm focus:ring focus:ring-opacity-50`}
                                placeholder="votre@email.com"
                                aria-invalid={!!validationErrors.email}
                                aria-describedby={validationErrors.email ? "email-error" : undefined}
                                required
                            />
                        </div>
                        {validationErrors.email && (
                            <p id="email-error" className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (validationErrors.password) validateForm();
                                }}
                                onBlur={validateForm}
                                className={`input pl-10 pr-10 py-2.5 w-full rounded-md border ${
                                    validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                                } shadow-sm focus:ring focus:ring-opacity-50`}
                                placeholder="••••••••"
                                aria-invalid={!!validationErrors.password}
                                aria-describedby="password-criteria password-error"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <p id="password-error" className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                        )}
                        
                        <div id="password-criteria" className="mt-2 space-y-1">
                            <p className="text-xs text-gray-500 mb-1">Le mot de passe doit contenir :</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className={`text-xs flex items-center ${passwordCriteria.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                    {passwordCriteria.minLength ? <Check className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 rounded-full border border-gray-300" />}
                                    Au moins 8 caractères
                                </div>
                                <div className={`text-xs flex items-center ${passwordCriteria.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    {passwordCriteria.hasUppercase ? <Check className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 rounded-full border border-gray-300" />}
                                    Une majuscule
                                </div>
                                <div className={`text-xs flex items-center ${passwordCriteria.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    {passwordCriteria.hasLowercase ? <Check className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 rounded-full border border-gray-300" />}
                                    Une minuscule
                                </div>
                                <div className={`text-xs flex items-center ${passwordCriteria.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                    {passwordCriteria.hasNumber ? <Check className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1 rounded-full border border-gray-300" />}
                                    Un chiffre
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (validationErrors.confirmPassword) validateForm();
                                }}
                                onBlur={validateForm}
                                className={`input pl-10 pr-10 py-2.5 w-full rounded-md border ${
                                    validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                                } shadow-sm focus:ring focus:ring-opacity-50`}
                                placeholder="••••••••"
                                aria-invalid={!!validationErrors.confirmPassword}
                                aria-describedby={validationErrors.confirmPassword ? "confirm-password-error" : undefined}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        {validationErrors.confirmPassword && (
                            <p id="confirm-password-error" className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
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
                                Inscription en cours...
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5 mr-2" />
                                S'inscrire
                            </>
                        )}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Vous avez déjà un compte ? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Se connecter</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};