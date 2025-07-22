import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Base from '../Base';

export default function Users() {
    const { users, stats, filters, auth, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [formData, setFormData] = useState({
        nom: '',
        identifiant: '',
        role: 'etudiant',
        password: '',
        password_confirmation: ''
    });

    const roles = [
        { value: 'etudiant', label: 'Étudiant', color: 'bg-blue-100 text-blue-800' },
        { value: 'secretaire', label: 'Secrétaire', color: 'bg-green-100 text-green-800' },
        { value: 'scolarite', label: 'Scolarité', color: 'bg-purple-100 text-purple-800' },
        { value: 'directeur', label: 'Directeur', color: 'bg-orange-100 text-orange-800' },
        { value: 'superAdmin', label: 'Super Admin', color: 'bg-red-100 text-red-800' }
    ];

    const handleFilterChange = (role) => {
        router.get(route('superadmin.users'), { role, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('superadmin.users'), { role: filters.role, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            nom: '',
            identifiant: '',
            role: 'etudiant',
            password: '',
            password_confirmation: ''
        });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            nom: user.nom,
            identifiant: user.identifiant,
            role: user.role,
            password: '',
            password_confirmation: ''
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingUser) {
            router.put(route('superadmin.users.update', editingUser.id), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingUser(null);
                }
            });
        } else {
            router.post(route('superadmin.users.store'), formData, {
                onSuccess: () => {
                    setShowModal(false);
                }
            });
        }
    };

    const handleDelete = (user) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ?`)) {
            router.delete(route('superadmin.users.destroy', user.id));
        }
    };

    const handleResetPassword = (user) => {
        if (confirm(`Réinitialiser le mot de passe de "${user.nom}" ?`)) {
            router.patch(route('superadmin.users.reset-password', user.id));
        }
    };

    const getRoleInfo = (role) => {
        return roles.find(r => r.value === role) || roles[0];
    };

    return (
        <Base title="Gestion des Utilisateurs" user={auth.user}>
            <Head title="Utilisateurs - SuperAdmin" />
            
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

                {/* Cards de statistiques par rôle */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div 
                        onClick={() => handleFilterChange('all')}
                        className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                            (!filters.role || filters.role === 'all') 
                                ? 'border-gray-500 bg-gray-50' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                        <div className="text-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                            <div className="text-xs text-gray-600">Tous</div>
                        </div>
                    </div>

                    {roles.map((role) => (
                        <div 
                            key={role.value}
                            onClick={() => handleFilterChange(role.value)}
                            className={`cursor-pointer rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                                filters.role === role.value 
                                    ? `border-${role.color.split('-')[1]}-500 ${role.color.replace('text-', 'bg-').replace('800', '50')}` 
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className="text-center">
                                <div className={`w-8 h-8 ${role.color.replace('text-', 'bg-').replace('800', '100')} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                    <span className={`text-xs font-bold ${role.color.replace('100', '600')}`}>
                                        {role.label.charAt(0)}
                                    </span>
                                </div>
                                <div className="text-lg font-bold text-gray-900">{stats[role.value]}</div>
                                <div className="text-xs text-gray-600">{role.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Barre de recherche et bouton d'ajout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
                        <p className="text-gray-600">Gérez les comptes utilisateurs de la plateforme</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        {/* Barre de recherche */}
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher par nom ou identifiant..."
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

                        {/* Bouton d'ajout */}
                        <button
                            onClick={openCreateModal}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Nouvel utilisateur</span>
                        </button>
                    </div>
                </div>

                {/* Tableau des utilisateurs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Utilisateur
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Identifiant
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Rôle
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date de création
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => {
                                    const roleInfo = getRoleInfo(user.role);
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                        <span className="text-green-600 font-semibold text-sm">
                                                            {user.nom.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                                    {user.identifiant}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleInfo.color}`}>
                                                    {roleInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.email_verified_at 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {user.email_verified_at ? 'Vérifié' : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleResetPassword(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Réinitialiser le mot de passe"
                                                        disabled={user.id === auth.user.id}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 01-2 2m2-2h3m-3 0h-3m-2-5a2 2 0 00-2 2v6a2 2 0 002 2h2M7 7a2 2 0 012-2h2m0 0h2m0 0h2a2 2 0 012 2m0 0v2m0 0v2m0 0a2 2 0 01-2 2" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Supprimer"
                                                        disabled={user.id === auth.user.id}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Message si aucun utilisateur */}
                    {users.data.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                            <p className="text-gray-500">Essayez de modifier vos critères de recherche ou créez un nouvel utilisateur.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {users.links.map((link, index) => (
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

                {/* Modal de création/édition */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                                    </h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Nom */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Ex: Jean Dupont"
                                        required
                                    />
                                </div>

                                {/* Identifiant */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Identifiant
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.identifiant}
                                        onChange={(e) => setFormData({ ...formData, identifiant: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Ex: ETU001, SEC001"
                                        required
                                    />
                                </div>

                                {/* Rôle */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rôle
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    >
                                        {roles.map((role) => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Mot de passe */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="••••••••"
                                        required={!editingUser}
                                    />
                                </div>

                                {/* Confirmation mot de passe */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="••••••••"
                                        required={!editingUser || formData.password}
                                    />
                                </div>

                                {/* Boutons */}
                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        {editingUser ? 'Modifier' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Base>
    );
}