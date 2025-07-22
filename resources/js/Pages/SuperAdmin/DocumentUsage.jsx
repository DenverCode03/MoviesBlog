import { Head, Link, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function DocumentUsage() {
    const { document, auth } = usePage().props;

    return (
        <Base title={`Utilisation - ${document.nom}`} user={auth.user}>
            <Head title={`Utilisation du document: ${document.nom}`} />
            
            <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link 
                        href={route('superadmin.documents')} 
                        className="hover:text-green-600 transition-colors"
                    >
                        Documents
                    </Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-gray-900 font-medium">{document.nom}</span>
                </nav>

                {/* Header du document */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.nom}</h1>
                            {document.description && (
                                <p className="text-gray-600 mb-4">{document.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Créé le {new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
                                <span>•</span>
                                <span>Utilisé dans {document.type_requetes.length} type(s) de requête</span>
                                <span>•</span>
                                <span>{document.requete_documents.length} fichier(s) uploadé(s)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiques d'utilisation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-green-600">{document.type_requetes.length}</div>
                            <div className="text-sm text-gray-600">Types de requêtes</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">{document.requete_documents.length}</div>
                            <div className="text-sm text-gray-600">Fichiers uploadés</div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {[...new Set(document.requete_documents.map(rd => rd.requete.etudiant.id))].length}
                            </div>
                            <div className="text-sm text-gray-600">Étudiants uniques</div>
                        </div>
                    </div>
                </div>

                {/* Types de requêtes utilisant ce document */}
                {document.type_requetes.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Types de requêtes utilisant ce document</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {document.type_requetes.map((typeRequete) => (
                                    <div key={typeRequete.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 mb-1">{typeRequete.nom}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{typeRequete.description}</p>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        typeRequete.est_actif 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {typeRequete.est_actif ? 'Actif' : 'Inactif'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {typeRequete.delai_traitement_jours} jour(s)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Fichiers récemment uploadés */}
                {document.requete_documents.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Fichiers récemment uploadés</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Fichier
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Étudiant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Requête
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date d'upload
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {document.requete_documents.slice(0, 10).map((requeteDocument) => (
                                        <tr key={requeteDocument.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {requeteDocument.nom_fichier_original || 'Fichier sans nom'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {requeteDocument.chemin_stockage.split('/').pop()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                        <span className="text-green-600 font-semibold text-xs">
                                                            {requeteDocument.requete.etudiant.nom.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {requeteDocument.requete.etudiant.nom}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {requeteDocument.requete.etudiant.identifiant}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    requeteDocument.requete.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                                                    requeteDocument.requete.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                                                    requeteDocument.requete.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                                                    requeteDocument.requete.statut === 'rejetee' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {requeteDocument.requete.statut.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(requeteDocument.created_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {document.requete_documents.length > 10 && (
                            <div className="p-4 text-center border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Affichage des 10 fichiers les plus récents sur {document.requete_documents.length} au total
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Message si aucune utilisation */}
                {document.type_requetes.length === 0 && document.requete_documents.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Document non utilisé</h3>
                        <p className="text-gray-500 mb-4">
                            Ce document n'est actuellement utilisé par aucun type de requête et aucun fichier n'a été uploadé.
                        </p>
                        <Link
                            href={route('superadmin.requetes')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Associer à un type de requête
                        </Link>
                    </div>
                )}

                {/* Bouton retour */}
                <div className="flex justify-start">
                    <Link
                        href={route('superadmin.documents')}
                        className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour aux documents
                    </Link>
                </div>
            </div>
        </Base>
    );
}