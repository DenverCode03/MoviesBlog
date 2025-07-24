import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function Historique() {
    const { requetes, statsPersonnelles, filters, auth, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        router.get(route('orgtraitement.historique'), newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('orgtraitement.historique'), { ...filters, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const getStatutColor = (statut) => {
        const colors = {
            'traitee_organisme': 'bg-purple-100 text-purple-800 border-purple-200',
            'terminee': 'bg-green-100 text-green-800 border-green-200',
            'rejetee_organisme': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[statut] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatutLabel = (statut) => {
        const labels = {
            'traitee_organisme': 'Traitée',
            'terminee': 'Terminée',
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

    const getOrganismeName = (role) => {
        const names = {
            'scolarite': 'Scolarité',
            'cellule_infos': 'Cellule Informatique'
        };
        return names[role] || role;
    };

    return (
        <Base title="Historique des Traitements" user={auth.user}>
            <Head title="Historique des Traitements" />
            
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

                {/* Statistiques personnelles */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { key: 'total_traitees', label: 'Total traitées', color: 'blue', value: statsPersonnelles.total_traitees },
                        { key: 'traitees', label: 'Traitées', color: 'purple', value: statsPersonnelles.traitees },
                        { key: 'terminees', label: 'Terminées', color: 'green', value: statsPersonnelles.terminees },
                        { key: 'rejetees', label: 'Rejetées', color: 'red', value: statsPersonnelles.rejetees },
                        { key: 'ce_mois', label: 'Ce mois', color: 'yellow', value: statsPersonnelles.ce_mois }
                    ].map((stat) => (
                        <div 
                            key={stat.key}
                            className={`rounded-xl p-4 border-2 bg-white border-gray-200`}
                        >
                            <div className="text-center">
                                <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                                <div className="text-xs text-gray-600">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Historique de mes traitements - {getOrganismeName(auth.user.role)}</h2>
                            <p className="text-gray-600">Consultez l'historique de toutes les requêtes que vous avez traitées</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            {/* Filtre par statut */}
                            <select
                                value={filters.statut}
                                onChange={(e) => handleFilterChange('statut', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="traitee_organisme">Traitées</option>
                                <option value="terminee">Terminées</option>
                                <option value="rejetee_organisme">Rejetées</option>
                            </select>

                            {/* Filtre par date de début */}
                            <input
                                type="date"
                                value={filters.date_debut}
                                onChange={(e) => handleFilterChange('date_debut', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Date début"
                            />

                            {/* Filtre par date de fin */}
                            <input
                                type="date"
                                value={filters.date_fin}
                                onChange={(e) => handleFilterChange('date_fin', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Date fin"
                            />

                            {/* Barre de recherche */}
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Rechercher étudiant ou type..."
                                    className="px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {requete.type_requete.nom}
                                                </h3>
                                                {requete.document_resultat_path && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Document fourni
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                        <span className="text-blue-600 font-semibold text-xs">
                                                            {requete.etudiant.nom.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span>{requete.etudiant.nom}</span>
                                                    <span className="ml-2 text-gray-400">({requete.etudiant.identifiant})</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                                <span>Créée le {new Date(requete.created_at).toLocaleDateString('fr-FR')}</span>
                                                {requete.date_fin_traitement_organisme && (
                                                    <>
                                                        <span>•</span>
                                                        <span>
                                                            Traitée le {new Date(requete.date_fin_traitement_organisme).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span>{requete.requete_documents.length} document(s)</span>
                                            </div>

                                            {/* Informations sur le traitement */}
                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                {requete.secretaire && (
                                                    <div>
                                                        <span className="font-medium">Validé par:</span> {requete.secretaire.nom}
                                                    </div>
                                                )}
                                                {requete.directeur && (
                                                    <div>
                                                        <span className="font-medium">Approuvé par:</span> {requete.directeur.nom}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatutColor(requete.statut)}`}>
                                                {getStatutLabel(requete.statut)}
                                            </span>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPrioriteColor(requete.priorite)}`}>
                                                {requete.priorite}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Commentaires et motifs */}
                                    {requete.commentaire_organisme && (
                                        <div className="mb-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                                            <strong>Commentaire:</strong> {requete.commentaire_organisme}
                                        </div>
                                    )}
                                    
                                    {requete.motif_rejet_organisme && (
                                        <div className="mb-2 p-2 bg-red-50 rounded text-sm text-red-700">
                                            <strong>Motif de rejet:</strong> {requete.motif_rejet_organisme}
                                        </div>
                                    )}

                                    {/* Document résultat */}
                                    {requete.document_resultat_path && (
                                        <div className="mb-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                                            <strong>Document fourni:</strong> {requete.document_resultat_nom}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('orgtraitement.requetes.show', requete.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Voir les détails"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </Link>

                                    {requete.document_resultat_path && (
                                        <button
                                            onClick={() => window.location.href = route('orgtraitement.requetes.resultat.download', requete.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Télécharger le document résultat"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune requête trouvée</h3>
                        <p className="text-gray-500">
                            {searchTerm || filters.statut !== 'all' || filters.date_debut || filters.date_fin
                                ? 'Essayez de modifier vos critères de recherche.'
                                : 'Vous n\'avez encore traité aucune requête.'
                            }
                        </p>
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
                                            ? 'bg-blue-600 text-white'
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
            </div>
        </Base>
    );
}