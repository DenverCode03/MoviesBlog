import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Base from "../Base";

export default function DetailRequete() {
    const { requete, auth, flash } = usePage().props;
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const getStatutColor = (statut) => {
        const colors = {
            en_attente: "bg-yellow-100 text-yellow-800 border-yellow-200",
            en_cours: "bg-blue-100 text-blue-800 border-blue-200",
            validee: "bg-purple-100 text-purple-800 border-purple-200",
            terminee: "bg-green-100 text-green-800 border-green-200",
            rejetee: "bg-red-100 text-red-800 border-red-200",
            recuperee: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return colors[statut] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const getStatutLabel = (statut) => {
        const labels = {
            en_attente: "En attente",
            en_cours: "En cours de traitement",
            validee: "Validée - En attente de finalisation",
            terminee: "Terminée - Prête à récupérer",
            rejetee: "Rejetée",
            recuperee: "Récupérée",
        };
        return labels[statut] || statut;
    };

    const getPrioriteColor = (priorite) => {
        const colors = {
            basse: "bg-gray-100 text-gray-800",
            normale: "bg-blue-100 text-blue-800",
            haute: "bg-orange-100 text-orange-800",
            urgente: "bg-red-100 text-red-800",
        };
        return colors[priorite] || "bg-gray-100 text-gray-800";
    };

    const handleMarkAsRecupere = () => {
        router.patch(route("etudiant.requetes.recuperer", requete.id));
    };

    const handleCancel = () => {
        if (confirm(`Êtes-vous sûr de vouloir annuler cette requête ?`)) {
            router.delete(route("etudiant.requetes.cancel", requete.id));
        }
    };

    const downloadDocument = (requeteDocument) => {
        window.location.href = route(
            "etudiant.documents.download",
            requeteDocument.id
        );
    };

    const previewDocument = (requeteDocument) => {
        // Vérifier si c'est un PDF
        const isPdf = requeteDocument.nom_fichier_original
            .toLowerCase()
            .endsWith(".pdf");
        if (!isPdf) {
            alert(
                "La prévisualisation n'est disponible que pour les fichiers PDF."
            );
            return;
        }

        setSelectedDocument(requeteDocument);
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
        setSelectedDocument(null);
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.toLowerCase().split(".").pop();
        switch (extension) {
            case "pdf":
                return (
                    <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                    </svg>
                );
            case "jpg":
            case "jpeg":
            case "png":
                return (
                    <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                );
            case "doc":
            case "docx":
                return (
                    <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                );
        }
    };

    return (
        <Base title={`Requête - ${requete.type_requete.nom}`} user={auth.user}>
            <Head title={`Détail requête - ${requete.type_requete.nom}`} />

            <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link
                        href={route("etudiant.mes-requetes")}
                        className="hover:text-green-600 transition-colors"
                    >
                        Mes requêtes
                    </Link>
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                    <span className="text-gray-900 font-medium">
                        {requete.type_requete.nom}
                    </span>
                </nav>

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

                {/* Header de la requête */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {requete.type_requete.nom}
                            </h1>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>
                                    Créée le{" "}
                                    {new Date(
                                        requete.created_at
                                    ).toLocaleDateString("fr-FR")}
                                </span>
                                {requete.date_limite && (
                                    <>
                                        <span>•</span>
                                        <span>
                                            Échéance:{" "}
                                            {new Date(
                                                requete.date_limite
                                            ).toLocaleDateString("fr-FR")}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span
                                className={`px-3 py-2 text-sm font-medium rounded-full border ${getStatutColor(
                                    requete.statut
                                )}`}
                            >
                                {getStatutLabel(requete.statut)}
                            </span>
                            <span
                                className={`px-3 py-2 text-sm font-medium rounded-full ${getPrioriteColor(
                                    requete.priorite
                                )}`}
                            >
                                Priorité {requete.priorite}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="flex items-center space-x-3">
                    {requete.statut === "terminee" && (
                        <button
                            onClick={handleMarkAsRecupere}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Marquer comme récupérée</span>
                        </button>
                    )}

                    {requete.statut === "en_attente" && (
                        <button
                            onClick={handleCancel}
                            className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
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
                            <span>Annuler la requête</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description du type de requête */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Description
                            </h2>
                            <p className="text-gray-600">
                                {requete.type_requete.description}
                            </p>
                        </div>

                        {/* Motif de rejet */}
                        {requete.motif_rejet && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-red-900 mb-4">
                                    Motif de rejet
                                </h2>
                                <p className="text-red-800">
                                    {requete.motif_rejet}
                                </p>
                            </div>
                        )}

                        {/* Commentaire secrétaire */}
                        {requete.commentaire_secretaire && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-blue-900 mb-4">
                                    Commentaire du secrétariat
                                </h2>
                                <p className="text-blue-800">
                                    {requete.commentaire_secretaire}
                                </p>
                            </div>
                        )}

                        {/* Documents fournis */}
                        {requete.requete_documents &&
                            requete.requete_documents.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Documents fournis
                                    </h2>
                                    <div className="space-y-3">
                                        {requete.requete_documents.map(
                                            (requeteDocument) => (
                                                <div
                                                    key={requeteDocument.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            {getFileIcon(
                                                                requeteDocument.nom_fichier_original
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">
                                                                {
                                                                    requeteDocument
                                                                        .document
                                                                        .nom
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    requeteDocument.nom_fichier_original
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {/* Bouton de prévisualisation (seulement pour les PDF) */}
                                                        {requeteDocument.nom_fichier_original
                                                            .toLowerCase()
                                                            .endsWith(
                                                                ".pdf"
                                                            ) && (
                                                            <button
                                                                onClick={() =>
                                                                    previewDocument(
                                                                        requeteDocument
                                                                    )
                                                                }
                                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                                title="Prévisualiser le PDF"
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}

                                                        {/* Bouton de téléchargement */}
                                                        <button
                                                            onClick={() =>
                                                                downloadDocument(
                                                                    requeteDocument
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Télécharger"
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Timeline de traitement */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Suivi de la requête
                            </h2>
                            <div className="space-y-6">
                                {/* Étape 1: Soumission */}
                                <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            Requête soumise
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(
                                                requete.created_at
                                            ).toLocaleDateString("fr-FR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Étape 2: Traitement */}
                                <div className="flex items-start space-x-4">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            [
                                                "en_cours",
                                                "validee",
                                                "terminee",
                                                "recuperee",
                                            ].includes(requete.statut)
                                                ? "bg-blue-600"
                                                : requete.statut === "rejetee"
                                                ? "bg-red-600"
                                                : "bg-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">
                                            {requete.statut === "rejetee"
                                                ? "Requête rejetée"
                                                : "En cours de traitement"}
                                        </h3>
                                        {requete.secretaire && (
                                            <p className="text-sm text-gray-600">
                                                Traité par:{" "}
                                                {requete.secretaire.nom}
                                            </p>
                                        )}
                                        {requete.date_traitement && (
                                            <p className="text-sm text-gray-600">
                                                {new Date(
                                                    requete.date_traitement
                                                ).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Étape 3: Validation (si applicable) */}
                                {["validee", "terminee", "recuperee"].includes(
                                    requete.statut
                                ) && (
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-4 h-4 text-white"
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
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                Requête validée
                                            </h3>
                                            {requete.directeur && (
                                                <p className="text-sm text-gray-600">
                                                    Validé par:{" "}
                                                    {requete.directeur.nom}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Étape 4: Terminée */}
                                {["terminee", "recuperee"].includes(
                                    requete.statut
                                ) && (
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                requete.statut === "recuperee"
                                                    ? "bg-gray-600"
                                                    : "bg-green-600"
                                            }`}
                                        >
                                            <svg
                                                className="w-4 h-4 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {requete.statut === "recuperee"
                                                    ? "Document récupéré"
                                                    : "Document prêt"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {requete.statut === "recuperee"
                                                    ? "Vous avez récupéré votre document"
                                                    : "Votre document est prêt à être récupéré"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Informations générales */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Informations
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-600">
                                        Priorité:
                                    </span>
                                    <span
                                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPrioriteColor(
                                            requete.priorite
                                        )}`}
                                    >
                                        {requete.priorite}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">
                                        Délai de traitement:
                                    </span>
                                    <span className="ml-2 text-sm text-gray-900">
                                        {
                                            requete.type_requete
                                                .delai_traitement_jours
                                        }{" "}
                                        jour(s)
                                    </span>
                                </div>
                                {requete.date_limite && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">
                                            Date limite:
                                        </span>
                                        <span className="ml-2 text-sm text-gray-900">
                                            {new Date(
                                                requete.date_limite
                                            ).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Documents requis */}
                        {requete.type_requete.documents &&
                            requete.type_requete.documents.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Documents requis
                                    </h3>
                                    <div className="space-y-2">
                                        {requete.type_requete.documents.map(
                                            (document) => {
                                                const isProvided =
                                                    requete.requete_documents?.some(
                                                        (rd) =>
                                                            rd.document_id ===
                                                            document.id
                                                    );
                                                return (
                                                    <div
                                                        key={document.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                                isProvided
                                                                    ? "bg-green-600"
                                                                    : "bg-gray-300"
                                                            }`}
                                                        >
                                                            {isProvided && (
                                                                <svg
                                                                    className="w-2 h-2 text-white"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 8 8"
                                                                >
                                                                    <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span
                                                            className={`text-sm ${
                                                                isProvided
                                                                    ? "text-green-800"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {document.nom}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* Bouton retour */}
                <div className="flex justify-start">
                    <Link
                        href={route("etudiant.mes-requetes")}
                        className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Retour à mes requêtes
                    </Link>
                </div>

                {/* Modal de prévisualisation PDF */}
                {showPreview && selectedDocument && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                            {/* Header du modal */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Prévisualisation -{" "}
                                        {selectedDocument.document.nom}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {selectedDocument.nom_fichier_original}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {/* Bouton de téléchargement dans le modal */}
                                    <button
                                        onClick={() =>
                                            downloadDocument(selectedDocument)
                                        }
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Télécharger"
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
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </button>

                                    {/* Bouton de fermeture */}
                                    <button
                                        onClick={closePreview}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Fermer"
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

                            {/* Contenu du PDF */}
                            <div className="flex-1 p-6 overflow-hidden">
                                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                    <iframe
                                        src={`/storage/${selectedDocument.chemin_stockage}#toolbar=1&navpanes=1&scrollbar=1`}
                                        className="w-full h-full rounded-lg border-0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`Prévisualisation de ${selectedDocument.nom_fichier_original}`}
                                        onError={() => {
                                            // Fallback si l'iframe ne fonctionne pas
                                            alert(
                                                "Impossible de prévisualiser ce fichier. Veuillez le télécharger pour le consulter."
                                            );
                                            closePreview();
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Footer du modal */}
                            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">
                                        Astuce :
                                    </span>{" "}
                                    Utilisez les contrôles du navigateur pour
                                    zoomer ou naviguer dans le document
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() =>
                                            downloadDocument(selectedDocument)
                                        }
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
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
                    </div>
                )}
            </div>
        </Base>
    );
}
