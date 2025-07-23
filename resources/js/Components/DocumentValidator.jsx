import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function DocumentValidator({ requete, onValidationComplete }) {
    const [validationStates, setValidationStates] = useState(
        requete.requete_documents.reduce((acc, doc) => {
            acc[doc.id] = {
                isValid: doc.est_valide || false,
                comment: doc.commentaire_validation || ''
            };
            return acc;
        }, {})
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleValidationChange = (documentId, isValid) => {
        setValidationStates(prev => ({
            ...prev,
            [documentId]: {
                ...prev[documentId],
                isValid
            }
        }));
    };

    const handleCommentChange = (documentId, comment) => {
        setValidationStates(prev => ({
            ...prev,
            [documentId]: {
                ...prev[documentId],
                comment
            }
        }));
    };

    const handleSubmitValidation = async () => {
        setIsSubmitting(true);
        
        const documentsValides = {};
        const commentaires = {};
        
        Object.entries(validationStates).forEach(([docId, state]) => {
            documentsValides[docId] = state.isValid;
            if (state.comment) {
                commentaires[docId] = state.comment;
            }
        });

        router.post(route('secretaire.requetes.validate-documents', requete.id), {
            documents_valides: documentsValides,
            commentaires: commentaires
        }, {
            onSuccess: (response) => {
                setIsSubmitting(false);
                if (onValidationComplete) {
                    onValidationComplete(response.props.flash);
                }
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const getValidationSummary = () => {
        const total = requete.requete_documents.length;
        const validated = Object.values(validationStates).filter(state => state.isValid).length;
        return { total, validated };
    };

    const { total, validated } = getValidationSummary();
    const allValidated = validated === total;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Validation des documents</h2>
                    <p className="text-sm text-gray-600">
                        Vérifiez chaque document individuellement
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        allValidated 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {validated}/{total} validés
                    </span>
                    <button
                        onClick={handleSubmitValidation}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isSubmitting
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : allValidated
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder validation'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {requete.requete_documents.map((requeteDocument) => {
                    const validationState = validationStates[requeteDocument.id];
                    const isRequired = requete.type_requete.documents.some(doc => doc.id === requeteDocument.document_id);
                    
                    return (
                        <div key={requeteDocument.id} className={`border rounded-lg p-4 ${
                            validationState.isValid 
                                ? 'border-green-200 bg-green-50' 
                                : 'border-gray-200 bg-white'
                        }`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        validationState.isValid 
                                            ? 'bg-green-100' 
                                            : 'bg-gray-100'
                                    }`}>
                                        {validationState.isValid ? (
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {requeteDocument.document.nom}
                                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                                        </h3>
                                        <p className="text-sm text-gray-600">{requeteDocument.nom_fichier_original}</p>
                                        <p className="text-xs text-gray-500">
                                            Taille: {(requeteDocument.taille_fichier / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => window.open(route('secretaire.documents.preview', requeteDocument.id), '_blank')}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Prévisualiser"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    
                                    <button
                                        onClick={() => window.location.href = route('secretaire.documents.download', requeteDocument.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Télécharger"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Contrôles de validation */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-gray-700">Statut de validation:</span>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`validation_${requeteDocument.id}`}
                                                checked={validationState.isValid === true}
                                                onChange={() => handleValidationChange(requeteDocument.id, true)}
                                                className="mr-2 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm text-green-700">Valide</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`validation_${requeteDocument.id}`}
                                                checked={validationState.isValid === false}
                                                onChange={() => handleValidationChange(requeteDocument.id, false)}
                                                className="mr-2 text-red-600 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-red-700">Non valide</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Commentaire de validation (optionnel)
                                    </label>
                                    <textarea
                                        value={validationState.comment}
                                        onChange={(e) => handleCommentChange(requeteDocument.id, e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ajoutez un commentaire sur ce document..."
                                    />
                                </div>
                                
                                {requeteDocument.date_validation && (
                                    <div className="text-xs text-gray-500">
                                        Validé le {new Date(requeteDocument.date_validation).toLocaleDateString('fr-FR')} 
                                        {requeteDocument.validateur && ` par ${requeteDocument.validateur.nom}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Résumé de validation */}
            <div className={`mt-6 p-4 rounded-lg ${
                allValidated 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
            }`}>
                <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                        allValidated ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                        {allValidated ? (
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${
                            allValidated ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                            {allValidated 
                                ? 'Tous les documents ont été validés' 
                                : `${validated} sur ${total} documents validés`
                            }
                        </p>
                        <p className={`text-xs ${
                            allValidated ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                            {allValidated 
                                ? 'La requête peut maintenant être approuvée' 
                                : 'Validez tous les documents pour pouvoir approuver la requête'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}