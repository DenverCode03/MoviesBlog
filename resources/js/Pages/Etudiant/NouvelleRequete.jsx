import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function NouvelleRequete() {
    const { typeRequetes, auth, errors } = usePage().props;
    const [selectedType, setSelectedType] = useState(null);
    const [formData, setFormData] = useState({
        type_requete_id: '',
        priorite: 'normale',
        commentaire: 'aucun',
        documents: {}
    });
    const [uploadedFiles, setUploadedFiles] = useState({});

    // Pré-sélectionner un type si passé en paramètre
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const typeId = urlParams.get('type');
        if (typeId && typeRequetes) {
            const preSelectedType = typeRequetes.find(t => t.id === typeId);
            if (preSelectedType) {
                setSelectedType(preSelectedType);
                setFormData(prev => ({
                    ...prev,
                    type_requete_id: preSelectedType.id
                }));
            }
        }
    }, [typeRequetes]);

    const handleTypeSelect = (typeRequete) => {
        setSelectedType(typeRequete);
        setFormData({
            ...formData,
            type_requete_id: typeRequete.id
        });
        // Reset uploaded files when changing type
        setUploadedFiles({});
    };

    const handleFileUpload = (documentId, file) => {
        if (file) {
            setUploadedFiles({
                ...uploadedFiles,
                [documentId]: file
            });
            setFormData({
                ...formData,
                documents: {
                    ...formData.documents,
                    [documentId]: file
                }
            });
        }
    };

    const removeFile = (documentId) => {
        const newUploadedFiles = { ...uploadedFiles };
        const newDocuments = { ...formData.documents };
        delete newUploadedFiles[documentId];
        delete newDocuments[documentId];
        
        setUploadedFiles(newUploadedFiles);
        setFormData({
            ...formData,
            documents: newDocuments
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Vérifier que tous les documents requis sont fournis
        const missingDocuments = selectedType.documents.filter(doc => !uploadedFiles[doc.id]);
        if (missingDocuments.length > 0) {
            alert(`Veuillez fournir les documents suivants :\n${missingDocuments.map(doc => `- ${doc.nom}`).join('\n')}`);
            return;
        }
        
        const submitData = new FormData();
        submitData.append('type_requete_id', formData.type_requete_id);
        submitData.append('priorite', formData.priorite);
        if (formData.commentaire) {
            submitData.append('commentaire', formData.commentaire);
        }
        
        // Ajouter les fichiers
        Object.entries(formData.documents).forEach(([documentId, file]) => {
            submitData.append(`documents[${documentId}]`, file);
        });
        
        router.post(route('etudiant.requetes.store'), submitData, {
            forceFormData: true,
            onSuccess: () => {
                // Redirection gérée par le controller
            }
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Base title="Nouvelle Requête" user={auth.user}>
            <Head title="Nouvelle Requête" />
            
            <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link 
                        href={route('etudiant.mes-requetes')} 
                        className="hover:text-green-600 transition-colors"
                    >
                        Mes requêtes
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900 font-medium">Nouvelle requête</span>
                </nav>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer une nouvelle requête</h1>
                    <p className="text-gray-600">Sélectionnez le type de document dont vous avez besoin</p>
                </div>

                {/* Étape 1: Sélection du type de requête */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        1. Choisissez le type de requête
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {typeRequetes.map((type) => (
                            <div
                                key={type.id}
                                onClick={() => handleTypeSelect(type)}
                                className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                                    selectedType?.id === type.id
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-green-300'
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        selectedType?.id === type.id ? 'bg-green-600' : 'bg-gray-100'
                                    }`}>
                                        <svg className={`w-4 h-4 ${
                                            selectedType?.id === type.id ? 'text-white' : 'text-gray-600'
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">{type.nom}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                                        <div className="text-xs text-gray-500">
                                            Délai: {type.delai_traitement_jours} jour(s)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {errors.type_requete_id && (
                        <p className="mt-2 text-sm text-red-600">{errors.type_requete_id}</p>
                    )}
                </div>

                {/* Étape 2: Formulaire de requête */}
                {selectedType && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informations de la requête */}
                        {/* <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                2. Informations de la requête
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                                {/* Priorité */}
                                {/* <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Priorité
                                    </label>
                                    <select
                                        value={formData.priorite}
                                        onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="basse">Basse</option>
                                        <option value="normale">Normale</option>
                                        <option value="haute">Haute</option>
                                        <option value="urgente">Urgente</option>
                                    </select>
                                </div> */}

                                {/* Date limite estimée */}
                                {/* <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date limite estimée
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700">
                                        {new Date(Date.now() + selectedType.delai_traitement_jours * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </div> */}

                            {/* Commentaire */}
                            {/* <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Commentaire (optionnel)
                                </label>
                                <textarea
                                    value={formData.commentaire}
                                    onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Ajoutez des informations supplémentaires si nécessaire..."
                                />
                                {errors.commentaire && (
                                    <p className="mt-2 text-sm text-red-600">{errors.commentaire}</p>
                                )}
                            </div>
                        </div> */}

                        {/* Étape 3: Documents requis */}
                        {selectedType.documents && selectedType.documents.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        2. Documents requis
                                    </h2>
                                    <div className="text-sm text-gray-600">
                                        {Object.keys(uploadedFiles).length} / {selectedType.documents.length} documents fournis
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {selectedType.documents.map((document) => (
                                        <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{document.nom}</h3>
                                                    {document.description && (
                                                        <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                                                    )}
                                                </div>
                                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                    Requis
                                                </span>
                                            </div>
                                            
                                            {uploadedFiles[document.id] ? (
                                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <div className="flex items-center space-x-3">
                                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-sm font-medium text-green-800">
                                                                {uploadedFiles[document.id].name}
                                                            </p>
                                                            <p className="text-xs text-green-600">
                                                                {formatFileSize(uploadedFiles[document.id].size)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(document.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                                                    <input
                                                        type="file"
                                                        id={`file-${document.id}`}
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                        onChange={(e) => handleFileUpload(document.id, e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor={`file-${document.id}`}
                                                        className="cursor-pointer flex flex-col items-center"
                                                    >
                                                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Cliquez pour télécharger
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            PDF, JPG, PNG, DOC, DOCX (max 5MB)
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                            
                                            {errors[`documents.${document.id}`] && (
                                                <p className="mt-2 text-sm text-red-600">{errors[`documents.${document.id}`]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Boutons d'action */}
                        <div className="flex justify-between items-center">
                            <Link
                                href={route('etudiant.mes-requetes')}
                                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </Link>
                            
                            <button
                                type="submit"
                                className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <span>Soumettre la requête</span>
                            </button>
                        </div>
                    </form>
                )}

                {/* Message si aucun type de requête disponible */}
                {typeRequetes.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun type de requête disponible</h3>
                        <p className="text-gray-500">
                            Il n'y a actuellement aucun type de requête actif. Contactez l'administration.
                        </p>
                    </div>
                )}
            </div>
        </Base>
    );
}