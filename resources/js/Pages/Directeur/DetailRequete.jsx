import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function DetailRequete() {
    const { requete, auth, flash } = usePage().props;
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showApprobationModal, setShowApprobationModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [formData, setFormData] = useState({
        commentaire_directeur: '',
        motif_rejet_directeur: ''
    });

    const getStatutColor = (statut) => {
        const colors = {
            'validee': 'bg-purple-100 text-purple-800 border-purple-200',
            'approuvee': 'bg-green-100 text-green-800 border-green-200',
            'rejetee_directeur': 'bg-red-100 text-red-800 border-red-200',
            'en_traitement_organisme': 'bg-blue-100 text-blue-800 border-blue-200'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatutLabel = (statut) => {
        const labels = {
            'validee': 'En attente d\'approbation',
            'approuvee': 'Approuvée',
            'rejetee_directeur': 'Rejetée par le directeur',
            'en_traitement_organisme': 'En traitement par l\'organisme'
        };
        return labels[statut] || statut;
    };

    const getPrioriteColor = (priorite) => {
        const colors = {
            'basse': 'bg-gray-100 text-gray-800',
            'normale': 'bg-blue-100 text-blue-800',
            'haute': 'bg-orange-100 text-orange-800',
            'urgente': 'bg-red-100 text-red-800'
        };
        return colors[priorite] || 'bg-gray-100 text-gray-800';
    };

    const previewDocument = (requeteDocument) => {
        setSelectedDocument(requeteDocument);
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
        setSelectedDocument(null);
    };

    const downloadDocument = (requeteDocument) => {
        window.location.href = route('directeur.documents.download', requeteDocument.id);
    };

    const handleApprouver = (e) => {
        e.preventDefault();
        router.patch(route('directeur.requetes.approuver', requete.id), {
            commentaire_directeur: formData.commentaire_directeur
        }, {
            onSuccess: () => {
                setShowApprobationModal(false);
                setFormData({ ...formData, commentaire_directeur: '' });
            }
        });
    };

    const handleRejeter = (e) => {
        e.preventDefault();
        router.patch(route('directeur.requetes.rejeter', requete.id), {
            motif_rejet_directeur: formData.motif_rejet_directeur,
            commentaire_directeur: formData.commentaire_directeur
        }, {
            onSuccess: () => {
                setShowRejectionModal(false);
                setFormData({ commentaire_directeur: '', motif_rejet_directeur: '' });
            }
        });
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.toLowerCase().split('.').pop();
        switch (extension) {
            case 'pdf':
                return (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'jpg':
            case 'jpeg':
            case 'png':
                return (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    const isUrgent = () => {
        const dateLimit = new Date(requete.date_limite);
        const now = new Date();
        const diffDays = Math.ceil((dateLimit - now) / (1000 * 60 * 60 * 24));
        return diffDays <= 2 || requete.priorite === 'urgente';
    };

    const canTakeAction = () => {
        return requete.statut === 'validee';
    };

    return (
        <Base title={`Approbation - ${requete.type_requete.nom}`} user={auth.user}>
            <Head title={`Approbation requête - ${requete.type_requete.nom}`} />
            
            <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link 
                        href={route('directeur.approbations')} 
                        className="hover:text-blue-600 transition-colors"
                    >
                        Approbations des requêtes
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900 font-medium">{requete.type_requete.nom}</span>
                </nav>

                {/* Messages Flash */}
                {flash.success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-green-800 font-medium">{flash.success}</span>
                        </div>
                    </div>
                )}

                {flash.error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-red-800 font-medium">{flash.error}</span>
                        </div>
                    </div>
                )}

                {/* Header de la requête */}
                <div className={`bg-white border rounded-xl p-6 ${
                    isUrgent() ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{requete.type_requete.nom}</h1>
                                {isUrgent() && (
                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Urgent
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-semibold text-sm">
                                            {requete.etudiant.nom.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">{requete.etudiant.nom}</span>
                                        <span className="ml-2 text-gray-500">({requete.etudiant.identifiant})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Créée le {new Date(requete.created_at).toLocaleDateString('fr-FR')}</span>
                                {requete.date_traitement && (
                                    <>
                                        <span>•</span>
                                        <span>Validée le {new Date(requete.date_traitement).toLocaleDateString('fr-FR')}</span>
                                    </>
                                )}
                                {requete.date_limite && (
                                    <>
                                        <span>•</span>
                                        <span className={isUrgent() ? 'text-red-600 font-medium' : ''}>
                                            Échéance: {new Date(requete.date_limite).toLocaleDateString('fr-FR')}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-2 text-sm font-medium rounded-full border ${getStatutColor(requete.statut)}`}>
                                {getStatutLabel(requete.statut)}
                            </span>
                            <span className={`px-3 py-2 text-sm font-medium rounded-full ${getPrioriteColor(requete.priorite)}`}>
                                Priorité {requete.priorite}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions principales */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">Actions disponibles</h2>
                            <p className="text-sm text-gray-600">
                                {requete.statut === 'validee' && 'Examinez la requête et approuvez ou rejetez-la.'}
                                {requete.statut === 'approuvee' && 'Requête approuvée et envoyée à l\'organisme responsable.'}
                                {requete.statut === 'rejetee_directeur' && 'Requête rejetée par vos soins.'}
                                {requete.statut === 'en_traitement_organisme' && 'Requête en cours de traitement par l\'organisme responsable.'}
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {canTakeAction() && (
                                <>
                                    <button
                                        onClick={() => setShowApprobationModal(true)}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Approuver</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowRejectionModal(true)}
                                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Rejeter</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informations sur l'organisme responsable */}
                {requete.type_requete.organisme_responsable && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Organisme responsable du traitement</h2>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H9m0 0H7m2 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{requete.type_requete.organisme_responsable.nom}</h3>
                                <p className="text-sm text-gray-600">{requete.type_requete.organisme_responsable.email}</p>
                                <p className="text-xs text-gray-500">
                                    Cette requête sera automatiquement transférée à cet organisme après approbation
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Documents soumis */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Documents soumis et validés</h2>
                            <p className="text-sm text-gray-600">
                                Documents vérifiés et validés par le secrétaire
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {requete.requete_documents.length} document(s) validé(s)
                        </span>
                    </div>

                    {requete.requete_documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {requete.requete_documents.map((requeteDocument) => (
                                <div key={requeteDocument.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            {getFileIcon(requeteDocument.nom_fichier_original)}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {requeteDocument.document.nom}
                                                </h3>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {requeteDocument.nom_fichier_original}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => previewDocument(requeteDocument)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Prévisualiser"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            
                                            <button
                                                onClick={() => downloadDocument(requeteDocument)}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                title="Télécharger"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center">
                                            <svg className="w-3 h-3 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-green-600 font-medium">Validé par le secrétaire</span>
                                        </div>
                                        <div>Taille: {(requeteDocument.taille_fichier / 1024).toFixed(1)} KB</div>
                                        <div>Soumis le: {new Date(requeteDocument.created_at).toLocaleDateString('fr-FR')}</div>
                                        {requeteDocument.commentaire_validation && (
                                            <div className="text-gray-600 mt-2 text-sm p-2 bg-white rounded">
                                                <strong>Commentaire:</strong> {requeteDocument.commentaire_validation}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500">Aucun document soumis</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal d'approbation */}
            {showApprobationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <form onSubmit={handleApprouver}>
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Approuver la requête</h3>
                                        <p className="text-sm text-gray-600">La requête sera envoyée à l'organisme responsable</p>
                                    </div>
                                </div>
                                
                                {requete.type_requete.organisme_responsable && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Organisme destinataire:</strong> {requete.type_requete.organisme_responsable.nom}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commentaire (optionnel)
                                    </label>
                                    <textarea
                                        value={formData.commentaire_directeur}
                                        onChange={(e) => setFormData({...formData, commentaire_directeur: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Ajoutez un commentaire si nécessaire..."
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-3 p-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowApprobationModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Approuver la requête
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de rejet */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <form onSubmit={handleRejeter}>
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Rejeter la requête</h3>
                                        <p className="text-sm text-gray-600">Indiquez le motif de rejet</p>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motif de rejet <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.motif_rejet_directeur}
                                        onChange={(e) => setFormData({...formData, motif_rejet_directeur: e.target.value})}
                                        rows={3}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Expliquez pourquoi cette requête est rejetée..."
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commentaire additionnel (optionnel)
                                    </label>
                                    <textarea
                                        value={formData.commentaire_directeur}
                                        onChange={(e) => setFormData({...formData, commentaire_directeur: e.target.value})}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Commentaire additionnel..."
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-3 p-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectionModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Rejeter la requête
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Base>
    );
}