import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Base from "../Base";

export default function Requetes() {
    const { typeRequetes, documents, stats, filters, auth, flash } =
        usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [editingType, setEditingType] = useState(null);
    const [formData, setFormData] = useState({
        nom: "",
        description: "",
        delai_traitement_jours: 7,
        documents: [],
    });

    const handleFilterChange = (status) => {
        router.get(
            route("superadmin.requetes"),
            { status },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const openCreateModal = () => {
        setEditingType(null);
        setFormData({
            nom: "",
            description: "",
            delai_traitement_jours: 7,
            documents: [],
        });
        setShowModal(true);
    };

    const openEditModal = (typeRequete) => {
        setEditingType(typeRequete);
        setFormData({
            nom: typeRequete.nom,
            description: typeRequete.description,
            delai_traitement_jours: typeRequete.delai_traitement_jours,
            documents: typeRequete.documents.map((doc) => doc.id),
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingType) {
            router.put(
                route("superadmin.type-requetes.update", editingType.id),
                formData,
                {
                    onSuccess: () => {
                        setShowModal(false);
                        setEditingType(null);
                    },
                }
            );
        } else {
            router.post(route("superadmin.type-requetes.store"), formData, {
                onSuccess: () => {
                    setShowModal(false);
                },
            });
        }
    };

    const handleDelete = (typeRequete) => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le type "${typeRequete.nom}" ?`
            )
        ) {
            router.delete(
                route("superadmin.type-requetes.destroy", typeRequete.id)
            );
        }
    };

    const toggleStatus = (typeRequete) => {
        router.patch(
            route("superadmin.type-requetes.toggle-status", typeRequete.id)
        );
    };

    const handleDocumentChange = (documentId) => {
        const newDocuments = formData.documents.includes(documentId)
            ? formData.documents.filter((id) => id !== documentId)
            : [...formData.documents, documentId];

        setFormData({ ...formData, documents: newDocuments });
    };

    const toggleCardExpansion = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <Base title="Gestion des Types de Requêtes" user={auth.user}>
            <Head title="Types de Requêtes - SuperAdmin" />

            <div className="space-y-6">
                {/* Messages Flash */}
                {flash.success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-green-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="text-green-800 font-medium">
                                {flash.success}
                            </span>
                        </div>
                    </div>
                )}

                {flash.error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-red-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="text-red-800 font-medium">
                                {flash.error}
                            </span>
                        </div>
                    </div>
                )}

                {/* Cards de filtrage */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        onClick={() => handleFilterChange("all")}
                        className={`cursor-pointer rounded-xl p-6 border-2 transition-all hover:shadow-md ${
                            !filters.status || filters.status === "all"
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                    >
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Tous les types
                            </h3>
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.total}
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => handleFilterChange("active")}
                        className={`cursor-pointer rounded-xl p-6 border-2 transition-all hover:shadow-md ${
                            filters.status === "active"
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white hover:border-green-300"
                        }`}
                    >
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Types traitables
                            </h3>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.active}
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => handleFilterChange("inactive")}
                        className={`cursor-pointer rounded-xl p-6 border-2 transition-all hover:shadow-md ${
                            filters.status === "inactive"
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 bg-white hover:border-red-300"
                        }`}
                    >
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Types non traitables
                            </h3>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.inactive}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Titre et bouton d'ajout */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Types de requêtes
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span>Ajouter un type</span>
                    </button>
                </div>

                {/* Grille des types de requêtes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeRequetes.data.map((typeRequete) => (
                        <div
                            key={typeRequete.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                {/* Header de la card */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {typeRequete.nom}
                                        </h3>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    typeRequete.est_actif
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {typeRequete.est_actif
                                                    ? "Actif"
                                                    : "Inactif"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {
                                                    typeRequete.delai_traitement_jours
                                                }{" "}
                                                jour(s)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {typeRequete.description}
                                </p>

                                {/* Documents requis (si card étendue) */}
                                {expandedCard === typeRequete.id && (
                                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                            Documents requis :
                                        </h4>
                                        {typeRequete.documents &&
                                        typeRequete.documents.length > 0 ? (
                                            <ul className="space-y-1">
                                                {typeRequete.documents.map(
                                                    (doc) => (
                                                        <li
                                                            key={doc.id}
                                                            className="text-sm text-gray-600 flex items-center"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 text-green-500 mr-2"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            {doc.nom}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                Aucun document requis
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Boutons d'action */}
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() =>
                                            toggleCardExpansion(typeRequete.id)
                                        }
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Voir les détails"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() =>
                                            toggleStatus(typeRequete)
                                        }
                                        className={`p-2 rounded-lg transition-colors ${
                                            typeRequete.est_actif
                                                ? "text-red-600 hover:bg-red-50"
                                                : "text-green-600 hover:bg-green-50"
                                        }`}
                                        title={
                                            typeRequete.est_actif
                                                ? "Désactiver"
                                                : "Activer"
                                        }
                                    >
                                        {typeRequete.est_actif ? (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        )}
                                    </button>

                                    <button
                                        onClick={() =>
                                            openEditModal(typeRequete)
                                        }
                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                        title="Modifier"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(typeRequete)
                                        }
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Supprimer"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {typeRequetes.last_page > 1 && (
                    <div className="flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {typeRequetes.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    disabled={!link.url}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        link.active
                                            ? "bg-green-600 text-white"
                                            : link.url
                                            ? "text-gray-700 hover:bg-gray-100"
                                            : "text-gray-400 cursor-not-allowed"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </nav>
                    </div>
                )}

                {/* Modal de création/édition */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {editingType
                                            ? "Modifier le type de requête"
                                            : "Créer un nouveau type de requête"}
                                    </h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="p-6 space-y-6"
                            >
                                {/* Nom */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nom du type de requête
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nom}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nom: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Ex: Attestation de scolarité"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Décrivez ce type de requête..."
                                        required
                                    />
                                </div>

                                {/* Délai de traitement */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Délai de traitement (jours)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={formData.delai_traitement_jours}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                delai_traitement_jours:
                                                    parseInt(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                {/* Documents requis */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Documents requis
                                    </label>
                                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 space-y-2">
                                        {documents.map((document) => (
                                            <label
                                                key={document.id}
                                                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.documents.includes(
                                                        document.id
                                                    )}
                                                    onChange={() =>
                                                        handleDocumentChange(
                                                            document.id
                                                        )
                                                    }
                                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {document.nom}
                                                    </div>
                                                    {document.description && (
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                document.description
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
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
                                        {editingType ? "Modifier" : "Créer"}
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
