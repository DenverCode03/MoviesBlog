import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Gestion des Requêtes Étudiantes" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-green-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-white"
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
                                <h1 className="text-xl font-bold text-gray-900">
                                    GestReq
                                </h1>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-700">
                                            Bonjour, {auth.user.name}
                                        </span>
                                        <Link
                                            href="/dashboard"
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Tableau de bord
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        {/* <Link
                                            href="/login"
                                            className="text-gray-700 hover:text-green-600 transition-colors"
                                        >
                                            Connexion
                                        </Link> */}
                                        <Link
                                            href="/login"
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Connexion
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                Bienvenue sur
                                <span className="text-green-600 block">
                                    My Student Request
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                Simplifiez vos démarches administratives au sein de IUT.
                                Soumettez, suivez et gérez vos requêtes en toute
                                simplicité ou que vous soyez.
                            </p>

                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/login"
                                        className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        Commencer maintenant
                                    </Link>
                                    {/* <Link
                                        href="/login"
                                        className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-all"
                                    >
                                        Se connecter
                                    </Link> */}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* a propos */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                C'est quoi My Student Request ?
                            </h3>
                            <p className="text-lg text-gray-600">
                                C'est une plateforme de gestion des requetes conçu pour les étudiants de l'IUT de Douala,
                                dans le but de leur faciliter l'accès aux informations concernant les requetes,
                                de leur permettre de faire leurs differents dépots, et les suivre, ce sans avoir a se déplacer
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Pourquoi choisir notre plateforme ?
                            </h3>
                            <p className="text-lg text-gray-600">
                                Une solution complète pour tous vos besoins
                                administratifs
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="text-center p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                    Suivi en temps réel
                                </h4>
                                <p className="text-gray-600">
                                    Suivez l'état de vos requêtes en temps réel
                                    et recevez des notifications à chaque étape
                                    du processus.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="text-center p-8 rounded-2xl bg-white hover:bg-gray-100 transition-colors">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                    Gain de temps
                                </h4>
                                <p className="text-gray-600">
                                    Plus besoin de vous déplacer pour des renseignements,
                                    ou pour le dépot de vos requetes.
                                    Faite le ici
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="text-center p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors">
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
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
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                    Rapide et efficace
                                </h4>
                                <p className="text-gray-600">
                                    Interface intuitive et processus optimisés
                                    pour une expérience utilisateur fluide et
                                    rapide.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Comment ça marche ?
                            </h3>
                            <p className="text-lg text-gray-600">
                                Un processus simple en 4 étapes
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                {
                                    step: "1",
                                    title: "Créer un compte",
                                    desc: "Inscrivez-vous rapidement avec vos informations étudiantes",
                                },
                                {
                                    step: "2",
                                    title: "Soumettre une requête",
                                    desc: "Choisissez le type de requête et joignez les documents nécessaires",
                                },
                                {
                                    step: "3",
                                    title: "Suivi du traitement",
                                    desc: "Suivez l'avancement de votre requête en temps réel",
                                },
                                {
                                    step: "4",
                                    title: "Récupérer le résultat",
                                    desc: "Vous recevrez une notification pour vous informer de la fin du traitement",
                                },
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                        {item.step}
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-green-600">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h3 className="text-3xl font-bold text-white mb-8">
                            Prêt à simplifier vos démarches ?
                        </h3>
                        {/* <p className="text-xl text-green-100 mb-8">
                            Rejoignez des milliers d'étudiants qui font
                            confiance à notre plateforme
                        </p> */}
                        {!auth.user && (
                            <Link
                                href="/login"
                                className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Me connecter
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-white"
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
                                    <span className="text-lg font-bold">
                                        GestReq
                                    </span>
                                </div>
                                <p className="text-gray-400">
                                    La solution moderne pour la gestion des
                                    requêtes étudiantes.
                                </p>
                            </div>

                            <div>
                                <h5 className="font-semibold mb-4">
                                    Liens rapides
                                </h5>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            Accueil
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            À propos
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold mb-4">Support</h5>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            Centre d'aide
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            FAQ
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            Nous contacter
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="font-semibold mb-4">Légal</h5>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            Conditions d'utilisation
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            Politique de confidentialité
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2025 GestReq. Tous droits réservés.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
