import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function MesRequetes() {
    const { requetes, stats, typesDisponibles, filters, auth, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [searchTypes, setSearchTypes] = useState(filters.search_types || '');

    const handleFilterChange = (statut) => {
        router.get(route('etudiant.mes-requetes'), { statut, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('etudiant.mes-requetes'), { statut: filters.statut, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const getStatutColor = (statut) => {
        const colors = {
            'en_attente': 'bg-yellow-100 text-yellow-800',
            'en_cours': 'bg-blue-100 text-blue-800',
            'validee': 'bg-purple-100 text-purple-800',
            'terminee': 'bg-green-100 text-green-800',
            'rejetee': 'bg-red-100 text-red-800',
            'recuperee': 'bg-gray-100 text-gray-800'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800';
    };

    const getStatutLabel = (statut) => {
        const labels = {
            'en_attente': 'En attente',
            'en_cours': 'En cours',
            'validee': 'Validée',
            'terminee': 'Terminée',
            'rejetee': 'Rejetée',
            'recuperee': 'Récupérée'
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

    const handleCancel = (requete) => {
        if (confirm(`Êtes-vous sûr de vouloir annuler la requête "${requete.type_requete.nom}" ?`)) {
            router.delete(route('etudiant.requetes.cancel', requete.id));
        }
    };

    const handleMarkAsRecupere = (requete) => {
        router.patch(route('etudiant.requetes.recuperer', requete.id));
    };

    const handleSearchTypes = (e) => {
        e.preventDefault();
        router.get(route('etudiant.mes-requetes'), { 
            statut: filters.statut, 
            search: searchTerm,
            search_types: searchTypes 
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const createRequeteFromType = (typeRequete) => {
        router.get(route('etudiant.requetes.create'), { type: typeRequete.id });
    };

    return (
        <Base title="Mes Requêtes" user={auth.user}>
            <Head title="Mes Requêtes" />
            
            <div className="space-y-6">
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

                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div 
                        onClick={() => handleFilterChange('all')}
                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                            (!filters.statut || filters.statut === 'all') 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                    >
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{stats.total}</div>
                            <div className="text-xs text-gray-600">Toutes</div>
                        </div>
                    </div>

                    {[
                        { key: 'en_attente', label: 'En attente', color: 'yellow' },
                        { key: 'en_cours', label: 'En cours', color: 'blue' },
                        { key: 'validees', label: 'Validées', color: 'purple' },
                        { key: 'terminees', label: 'Terminées', color: 'green' },
                        { key: 'rejetees', label: 'Rejetées', color: 'red' },
                        { key: 'recuperees', label: 'Récupérées', color: 'gray' }
                    ].map((stat) => (
                        <div 
                            key={stat.key}
                            onClick={() => handleFilterChange(stat.key)}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                                filters.statut === stat.key 
                                    ? `border-${stat.color}-500 bg-${stat.color}-50` 
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className="text-center">
                                <div className={`text-lg font-bold text-${stat.color}-600`}>{stats[stat.key]}</div>
                                <div className="text-xs text-gray-600">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Header avec recherche et bouton nouveau */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mes requêtes</h2>
                        <p className="text-gray-600">Suivez l'état de vos demandes administratives</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        {/* Barre de recherche */}
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher une requête..."
                                className="px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl hover:bg-gray-200 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {/* Bouton nouvelle requête */}
                        <Link
                            href={route('etudiant.requetes.create')}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Nouvelle requête</span>
                        </Link>
                    </div>
                </div>

                {/* Liste des requêtes */}
                <div className="space-y-4">
                    {requetes.data.map((requete) => (
                        <div key={requete.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                {/* Informations principales */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {requete.type_requete.nom}
                                            </h3>
                                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                                <span>Créée le {new Date(requete.created_at).toLocaleDateString('fr-FR')}</span>
                                                {requete.date_limite && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Échéance: {new Date(requete.date_limite).toLocaleDateString('fr-FR')}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatutColor(requete.statut)}`}>
                                                {getStatutLabel(requete.statut)}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrioriteColor(requete.priorite)}`}>
                                                {requete.priorite}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Informations de traitement */}
                                    {(requete.secretaire || requete.directeur) && (
                                        <div className="text-sm text-gray-600 mb-3">
                                            {requete.secretaire && (
                                                <span>Traité par: {requete.secretaire.nom}</span>
                                            )}
                                            {requete.directeur && (
                                                <span className="ml-4">Validé par: {requete.directeur.nom}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Motif de rejet */}
                                    {requete.motif_rejet && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                            <p className="text-sm text-red-800">
                                                <strong>Motif de rejet:</strong> {requete.motif_rejet}
                                            </p>
                                        </div>
                                    )}

                                    {/* Documents */}
                                    {requete.requete_documents && requete.requete_documents.length > 0 && (
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Documents:</span>
                                            <span className="ml-2">{requete.requete_documents.length} fichier(s) joint(s)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href={route('etudiant.requetes.show', requete.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Voir les détails"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </Link>

                                    {requete.statut === 'terminee' && (
                                        <button
                                            onClick={() => handleMarkAsRecupere(requete)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Marquer comme récupérée"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    )}

                                    {requete.statut === 'en_attente' && (
                                        <button
                                            onClick={() => handleCancel(requete)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Annuler la requête"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message si aucune requête */}
                {requetes.data.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune requête trouvée</h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filters.statut !== 'all' 
                                ? 'Essayez de modifier vos critères de recherche.' 
                                : 'Vous n\'avez pas encore soumis de requête.'
                            }
                        </p>
                        <Link
                            href={route('etudiant.requetes.create')}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                        >
                            Créer ma première requête
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {requetes.last_page > 1 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {requetes.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        link.active
                                            ? 'bg-green-600 text-white'
                                            : link.url
                                            ? 'text-gray-700 hover:bg-gray-100'
                                            : 'text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}

                {/* Section des types de requêtes disponibles */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Types de requêtes disponibles</h2>
                            <p className="text-gray-600">Découvrez tous les documents que vous pouvez demander</p>
                        </div>
                        
                        {/* Barre de recherche pour les types */}
                        <form onSubmit={handleSearchTypes} className="flex">
                            <input
                                type="text"
                                value={searchTypes}
                                onChange={(e) => setSearchTypes(e.target.value)}
                                placeholder="Rechercher un type de requête..."
                                className="px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl hover:bg-gray-200 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Grille des types de requêtes */}
                    {typesDisponibles && typesDisponibles.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {typesDisponibles.data.map((typeRequete) => (
                                    <div key={typeRequete.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{typeRequete.nom}</h3>
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{typeRequete.description}</p>
                                                
                                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {typeRequete.delai_traitement_jours} jour(s)
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        {typeRequete.requetes_count} demande(s)
                                                    </span>
                                                </div>

                                                {/* Documents requis */}
                                                {typeRequete.documents && typeRequete.documents.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Documents requis :</h4>
                                                        <div className="space-y-1">
                                                            {typeRequete.documents.slice(0, 3).map((document) => (
                                                                <div key={document.id} className="flex items-center text-xs text-gray-600">
                                                                    <svg className="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                    {document.nom}
                                                                </div>
                                                            ))}
                                                            {typeRequete.documents.length > 3 && (
                                                                <div className="text-xs text-gray-500 ml-5">
                                                                    +{typeRequete.documents.length - 3} autre(s) document(s)
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bouton d'action */}
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => createRequeteFromType(typeRequete)}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span>Demander</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination pour les types */}
                            {typesDisponibles.last_page > 1 && (
                                <div className="flex justify-center mt-6">
                                    <nav className="flex items-center space-x-2">
                                        {typesDisponibles.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : link.url
                                                        ? 'text-gray-700 hover:bg-gray-100'
                                                        : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun type de requête trouvé</h3>
                            <p className="text-gray-500">
                                {searchTypes 
                                    ? 'Essayez de modifier vos critères de recherche.' 
                                    : 'Il n\'y a actuellement aucun type de requête disponible.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Base>
    );
}