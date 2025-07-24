import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function DetailRequete() {
    const { requete, auth, flash } = usePage().props;
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showTraitementModal, setShowTraitementModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [showFinalisationModal, setShowFinalisationModal] = useState(false);
    const [formData, setFormData] = useState({
        commentaire_organisme: '',
        motif_rejet_organisme: '',
        document_resultat: null
    });

    const getStatutColor = (statut) => {
        const colors = {
            'en_traitement_organisme': 'bg-blue-100 text-blue-800 border-blue-200',
            'en_cours_organisme': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'traitee_organisme': 'bg-purple-100 text-purple-800 border-purple-200',
            'terminee': 'bg-green-100 text-green-800 border-green-200',
            'rejetee_organisme': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatutLabel = (statut) => {
        const labels = {
            'en_traitement_organisme': 'À traiter',
            'en_cours_organisme': 'En cours de traitement',
            'traitee_organisme': 'Traitée - En attente de finalisation',
            'terminee': 'Terminée - Document prêt',
            'rejetee_organisme': 'Rejetée'
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
        window.location.href = route('orgtraitement.documents.download', requeteDocument.id);
    };

    const handlePrendreEnCharge = () => {
        router.patch(route('orgtraitement.requetes.prendre', requete.id));
    };

    const handleTraiter = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('commentaire_organisme', formData.commentaire_organisme);
        if (formData.document_resultat) {
            formDataToSend.append('document_resultat', formData.document_resultat);
        }

        router.post(route('orgtraitement.requetes.traiter', requete.id), formDataToSend, {
            onSuccess: () => {
                setShowTraitementModal(false);
                setFormData({ ...formData, commentaire_organisme: '', document_resultat: null });
            }
        });
    };

    const handleRejeter = (e) => {
        e.preventDefault();
        router.patch(route('orgtraitement.requetes.rejeter', requete.id), {
            motif_rejet_organisme: formData.motif_rejet_organisme,
            commentaire_organisme: formData.commentaire_organisme
        }, {
            onSuccess: () => {
                setShowRejectionModal(false);
                setFormData({ commentaire_organisme: '', motif_rejet_organisme: '', document_resultat: null });
            }
        });
    };

    const handleFinaliser = (e) => {
        e.preventDefault();
        router.patch(route('orgtraitement.requetes.finaliser', requete.id), {
            commentaire_organisme: formData.commentaire_organisme
        }, {
            onSuccess: () => {
                setShowFinalisationModal(false);
                setFormData({ ...formData, commentaire_organisme: '' });
            }
        });
    };

    const downloadResultat = () => {
        window.location.href = route('orgtraitement.requetes.resultat.download', requete.id);
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
        return ['en_traitement_organisme', 'en_cours_organisme'].includes(requete.statut);
    };

    const getOrganismeName = (role) => {
        const names = {
            'scolarite': 'Scolarité',
            'cellule_infos': 'Cellule Informatique'
        };
        return names[role] || role;
    };

    return (
        <Base title={`Traitement - ${requete.type_requete.nom}`} user={auth.user}>
            <Head title={`Traitement requête - ${requete.type_requete.nom}`} />
            
            <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link 
                        href={route('orgtraitement.traitement')} 
                        className="hover:text-blue-600 transition-colors"
                    >
                        Traitement des requêtes
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
                                {requete.date_envoi_organisme && (
                                    <>
                                        <span>•</span>
                                        <span>Reçue le {new Date(requete.date_envoi_organisme).toLocaleDateString('fr-FR')}</span>
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
                                {requete.statut === 'en_traitement_organisme' && 'Prenez cette requête en charge pour commencer le traitement.'}
                                {requete.statut === 'en_cours_organisme' && 'Traitez la requête et fournissez le document résultat.'}
                                {requete.statut === 'traitee_organisme' && 'Requête traitée, finalisez-la pour la rendre disponible à l\'étudiant.'}
                                {requete.statut === 'terminee' && 'Requête terminée, document disponible pour récupération.'}
                                {requete.statut === 'rejetee_organisme' && 'Requête rejetée par vos soins.'}
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {requete.statut === 'en_traitement_organisme' && (
                                <button
                                    onClick={handlePrendreEnCharge}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>Prendre en charge</span>
                                </button>
                            )}

                            {requete.statut === 'en_cours_organisme' && (
                                <>
                                    <button
                                        onClick={() => setShowTraitementModal(true)}
                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Traiter</span>
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

                            {requete.statut === 'traitee_organisme' && (
                                <button
                                    onClick={() => setShowFinalisationModal(true)}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Finaliser</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Document résultat */}
                {requete.document_resultat_path && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document résultat</h2>
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Document traité</h3>
                                    <p className="text-sm text-gray-600">{requete.document_resultat_nom}</p>
                                </div>
                            </div>
                            <button
                                onClick={downloadResultat}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Télécharger</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Documents soumis */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Documents soumis par l'étudiant</h2>
                            <p className="text-sm text-gray-600">
                                Documents validés par le secrétaire et approuvés par la direction
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
                                            <span className="text-green-600 font-medium">Validé</span>
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

                {/* Historique des actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique du traitement</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900">Requête créée</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(requete.created_at).toLocaleDateString('fr-FR')} à {new Date(requete.created_at).toLocaleTimeString('fr-FR')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">Par {requete.etudiant.nom}</p>
                            </div>
                        </div>

                        {requete.secretaire && (
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">Requête validée</span>
                                        <span className="text-sm text-gray-500">
                                            {requete.date_traitement && new Date(requete.date_traitement).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Par {requete.secretaire.nom}</p>
                                    {requete.commentaire_secretaire && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                            <strong>Commentaire:</strong> {requete.commentaire_secretaire}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {requete.directeur && (
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">Requête approuvée</span>
                                        <span className="text-sm text-gray-500">
                                            {requete.date_approbation && new Date(requete.date_approbation).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Par {requete.directeur.nom}</p>
                                    {requete.commentaire_directeur && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                            <strong>Commentaire:</strong> {requete.commentaire_directeur}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {requete.date_envoi_organisme && (
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">Envoyée à {getOrganismeName(auth.user.role)}</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(requete.date_envoi_organisme).toLocaleDateString('fr-FR')} à {new Date(requete.date_envoi_organisme).toLocaleTimeString('fr-FR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Requête transférée pour traitement</p>
                                </div>
                            </div>
                        )}

                        {requete.date_fin_traitement_organisme && (
                            <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    requete.statut === 'terminee' ? 'bg-green-100' : 
                                    requete.statut === 'rejetee_organisme' ? 'bg-red-100' : 'bg-purple-100'
                                }`}>
                                    <svg className={`w-4 h-4 ${
                                        requete.statut === 'terminee' ? 'text-green-600' : 
                                        requete.statut === 'rejetee_organisme' ? 'text-red-600' : 'text-purple-600'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {requete.statut === 'terminee' && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        )}
                                        {requete.statut === 'rejetee_organisme' && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        )}
                                        {(requete.statut === 'traitee_organisme') && (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        )}
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">
                                            {requete.statut === 'terminee' && 'Requête finalisée'}
                                            {requete.statut === 'rejetee_organisme' && 'Requête rejetée'}
                                            {requete.statut === 'traitee_organisme' && 'Requête traitée'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(requete.date_fin_traitement_organisme).toLocaleDateString('fr-FR')} à {new Date(requete.date_fin_traitement_organisme).toLocaleTimeString('fr-FR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Par {getOrganismeName(auth.user.role)}</p>
                                    {requete.commentaire_organisme && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                            <strong>Commentaire:</strong> {requete.commentaire_organisme}
                                        </div>
                                    )}
                                    {requete.motif_rejet_organisme && (
                                        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                                            <strong>Motif de rejet:</strong> {requete.motif_rejet_organisme}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>   
         {/* Modal de prévisualisation */}
            {showPreview && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] w-full flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.document.nom}</h3>
                                <p className="text-sm text-gray-600">{selectedDocument.nom_fichier_original}</p>
                            </div>
                            <button
                                onClick={closePreview}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 p-6 overflow-auto">
                            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                                {selectedDocument.nom_fichier_original.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        src={`/storage/${selectedDocument.chemin_stockage}`}
                                        className="w-full h-full rounded-lg"
                                        title="Prévisualisation PDF"
                                    />
                                ) : selectedDocument.nom_fichier_original.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                    <img
                                        src={`/storage/${selectedDocument.chemin_stockage}`}
                                        alt="Prévisualisation"
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-500 mb-4">Prévisualisation non disponible pour ce type de fichier</p>
                                        <button
                                            onClick={() => downloadDocument(selectedDocument)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Télécharger le fichier
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-3 p-6 border-t">
                            <button
                                onClick={() => downloadDocument(selectedDocument)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Télécharger</span>
                            </button>
                            <button
                                onClick={closePreview}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de traitement */}
            {showTraitementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <form onSubmit={handleTraiter}>
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Traiter la requête</h3>
                                        <p className="text-sm text-gray-600">Marquer la requête comme traitée</p>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Document résultat (optionnel)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setFormData({...formData, document_resultat: e.target.files[0]})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Formats acceptés: PDF, JPG, PNG (max 5MB)
                                    </p>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commentaire (optionnel)
                                    </label>
                                    <textarea
                                        value={formData.commentaire_organisme}
                                        onChange={(e) => setFormData({...formData, commentaire_organisme: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Ajoutez un commentaire sur le traitement..."
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-3 p-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowTraitementModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Traiter la requête
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
                                        value={formData.motif_rejet_organisme}
                                        onChange={(e) => setFormData({...formData, motif_rejet_organisme: e.target.value})}
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
                                        value={formData.commentaire_organisme}
                                        onChange={(e) => setFormData({...formData, commentaire_organisme: e.target.value})}
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

            {/* Modal de finalisation */}
            {showFinalisationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <form onSubmit={handleFinaliser}>
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Finaliser la requête</h3>
                                        <p className="text-sm text-gray-600">Rendre le document disponible à l'étudiant</p>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Commentaire final (optionnel)
                                    </label>
                                    <textarea
                                        value={formData.commentaire_organisme}
                                        onChange={(e) => setFormData({...formData, commentaire_organisme: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Commentaire final sur le traitement..."
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-3 p-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowFinalisationModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Finaliser
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Base>
    );
}