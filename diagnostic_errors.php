<?php

/**
 * Script de diagnostic pour identifier les erreurs dans le système
 * Exécuter avec: php diagnostic_errors.php
 */

require_once 'vendor/autoload.php';

echo "=== DIAGNOSTIC DES ERREURS SYSTÈME ===\n\n";

// 1. Vérifier les middlewares
echo "1. Vérification des middlewares...\n";
$middlewares = [
    'role.superAdmin' => 'App\\Http\\Middleware\\EnsureUserIsSuperAdmin',
    'role.directeur' => 'App\\Http\\Middleware\\EnsureUserIsDirecteur',
    'role.secretaire' => 'App\\Http\\Middleware\\EnsureUserIsSecretaire',
    'role.etudiant' => 'App\\Http\\Middleware\\EnsureUserIsEtudiant',
];

foreach ($middlewares as $alias => $class) {
    $file = str_replace('\\', '/', $class) . '.php';
    $file = str_replace('App/', 'app/', $file);
    if (file_exists($file)) {
        echo "✅ $alias -> $class\n";
    } else {
        echo "❌ $alias -> $class (MANQUANT)\n";
    }
}

// 2. Vérifier les pages React
echo "\n2. Vérification des pages React...\n";
$pages = [
    'Etudiant' => ['MesRequetes', 'NouvelleRequete', 'DetailRequete'],
    'Secretaire' => ['Traitement', 'DetailRequete', 'Historique'],
    'Directeur' => ['Approbations', 'DetailRequete', 'Historique'],
    'SuperAdmin' => ['Requetes', 'Users', 'Documents', 'DocumentUsage'],
];

foreach ($pages as $role => $pageList) {
    echo "\n$role:\n";
    foreach ($pageList as $page) {
        $file = "resources/js/Pages/$role/$page.jsx";
        if (file_exists($file)) {
            echo "  ✅ $page.jsx\n";
        } else {
            echo "  ❌ $page.jsx (MANQUANT)\n";
        }
    }
}

// 3. Vérifier les contrôleurs
echo "\n3. Vérification des contrôleurs...\n";
$controllers = [
    'EtudiantController',
    'SecretaireController', 
    'DirecteurController',
    'SuperAdminController',
    'DashboardController'
];

foreach ($controllers as $controller) {
    $file = "app/Http/Controllers/$controller.php";
    if (file_exists($file)) {
        echo "✅ $controller\n";
    } else {
        echo "❌ $controller (MANQUANT)\n";
    }
}

// 4. Vérifier les modèles et relations
echo "\n4. Vérification des modèles...\n";
$models = [
    'User' => ['requetesEtudiant', 'requetesSecretaire', 'requetesDirecteur'],
    'Requete' => ['etudiant', 'typeRequete', 'secretaire', 'directeur', 'organismeResponsable'],
    'TypeRequete' => ['requetes', 'documents', 'organismeResponsable'],
    'Document' => ['typeRequetes', 'requeteDocuments'],
    'RequeteDocument' => ['requete', 'document', 'validateur']
];

foreach ($models as $model => $relations) {
    $file = "app/Models/$model.php";
    if (file_exists($file)) {
        echo "✅ $model\n";
        
        // Vérifier les relations dans le fichier
        $content = file_get_contents($file);
        foreach ($relations as $relation) {
            if (strpos($content, "function $relation(") !== false) {
                echo "  ✅ relation: $relation\n";
            } else {
                echo "  ❌ relation: $relation (MANQUANTE)\n";
            }
        }
    } else {
        echo "❌ $model (MANQUANT)\n";
    }
}

// 5. Vérifier les migrations critiques
echo "\n5. Vérification des migrations...\n";
$migrations = [
    'create_users_table',
    'create_requetes_table', 
    'create_type_requetes_table',
    'create_documents_table',
    'add_organisme_responsable_to_type_requetes_table',
    'add_directeur_columns_to_requetes_table',
    'add_validation_columns_to_requete_documents_table'
];

$migrationFiles = glob('database/migrations/*.php');
foreach ($migrations as $migration) {
    $found = false;
    foreach ($migrationFiles as $file) {
        if (strpos($file, $migration) !== false) {
            echo "✅ $migration\n";
            $found = true;
            break;
        }
    }
    if (!$found) {
        echo "❌ $migration (MANQUANTE)\n";
    }
}

echo "\n=== FIN DU DIAGNOSTIC ===\n";
echo "Exécutez ce script pour identifier les erreurs restantes.\n";