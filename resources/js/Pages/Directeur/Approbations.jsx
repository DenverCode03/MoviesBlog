import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function Approbations() {
    const { requetes, stats, typesRequetes, filters, auth, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        router.get(route('directeur.approbations'), newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('directeur.approbations'), { ...filters, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

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

    const isUrgent = (requete) => {
        const dateLimit = new Date(requete.date_limite);
        const now = new Date();
        const diffDays = Math.ceil((dateLimit - now) / (1000 * 60 * 60 * 24));
        return diffDays <= 2 || requete.priorite === 'urgente';
    };

    return (
        <Base title="Approbations des Requêtes" user={auth.user}>
            <Head title="Approbations des Requêtes" />
            
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

                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { key: 'validees', label: 'En attente', color: 'purple', value: stats.validees },
                        { key: 'approuvees', label: 'Approuvées', color: 'green', value: stats.approuvees },
                        { key: 'rejetees_directeur', label: 'Rejetées', color: 'red', value: stats.rejetees_directeur },
                        { key: 'en_traitement_organisme', label: 'En traitement', color: 'blue', value: stats.en_traitement_organisme },
                        { key: 'urgentes', label: 'Urgentes', color: 'orange', value: stats.urgentes }
                    ].map((stat) => (
                        <div 
                            key={stat.key}
                            onClick={() => handleFilterChange('statut', stat.key)}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                                filters.statut === stat.key 
                                    ? `border-${stat.color}-500 bg-${stat.color}-50` 
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
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
                            <h2 className="text-2xl font-bold text-gray-900">Requêtes à approuver</h2>
                            <p className="text-gray-600">Approuvez ou rejetez les requêtes validées par les secrétaires</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            {/* Filtre par priorité */}
                            <select
                                value={filters.priorite}
                                onChange={(e) => handleFilterChange('priorite', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Toutes priorités</option>
                                <option value="urgente">Urgente</option>
                                <option value="haute">Haute</option>
                                <option value="normale">Normale</option>
                                <option value="basse">Basse</option>
                            </select>

                            {/* Filtre par type */}
                            <select
                                value={filters.type_requete}
                                onChange={(e) => handleFilterChange('type_requete', e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Tous types</option>
                                {typesRequetes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.nom}</option>
                                ))}
                            </select>

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
                        <div key={requete.id} className={`bg-white border rounded-xl p-6 hover:shadow-md transition-shadow ${
                            isUrgent(requete) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                {/* Informations principales */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {requete.type_requete.nom}
                                                </h3>
                                                {/* {isUrgent(requete) && (
                                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        Urgent
                                                    </span>
                                                )} */}
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
                                                {requete.date_traitement && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Validée le {new Date(requete.date_traitement).toLocaleDateString('fr-FR')}</span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span>{requete.requete_documents.length} document(s)</span>
                                            </div>

                                            {/* Secrétaire et organisme responsable */}
                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                {requete.secretaire && (
                                                    <div>
                                                        <span className="font-medium">Validé par:</span> {requete.secretaire.nom}
                                                    </div>
                                                )}
                                                {requete.type_requete.organisme_responsable && (
                                                    <div>
                                                        <span className="font-medium">Organisme:</span> {requete.type_requete.organisme_responsable.nom}
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
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('directeur.requetes.show', requete.id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Voir les détails"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </Link>

                                    {requete.statut === 'validee' && (
                                        <Link
                                            href={route('directeur.requetes.show', requete.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span>Examiner</span>
                                        </Link>
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
                            {searchTerm || filters.statut !== 'validee' || filters.priorite !== 'all' || filters.type_requete !== 'all'
                                ? 'Essayez de modifier vos critères de recherche.'
                                : 'Il n\'y a actuellement aucune requête à approuver.'
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