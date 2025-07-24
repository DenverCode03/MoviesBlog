<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ClearDataExceptUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:clear-except-users {--force : Force the operation without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all data from database except users table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force')) {
            if (!$this->confirm('This will delete ALL data except users. Are you sure?')) {
                $this->info('Operation cancelled.');
                return;
            }
        }

        $this->info('Starting data cleanup...');

        // Tables à vider (dans l'ordre pour respecter les contraintes de clés étrangères)
        $tablesToClear = [
            'requete_documents',
            'requetes',
            'type_requete_documents',
            'type_requetes',
            'documents',
            'password_reset_tokens',
            'sessions',
            'cache',
            'cache_locks',
            'jobs',
            'job_batches',
            'failed_jobs',
        ];

        $clearedTables = [];
        $skippedTables = [];

        foreach ($tablesToClear as $table) {
            if (Schema::hasTable($table)) {
                try {
                    // Désactiver les contraintes de clés étrangères temporairement
                    DB::statement('PRAGMA foreign_keys = OFF');

                    $count = DB::table($table)->count();
                    DB::table($table)->truncate();

                    $clearedTables[] = $table;
                    $this->line("✓ Cleared table '{$table}' ({$count} records)");

                    // Réactiver les contraintes
                    DB::statement('PRAGMA foreign_keys = ON');
                } catch (\Exception $e) {
                    $skippedTables[] = $table;
                    $this->error("✗ Failed to clear table '{$table}': " . $e->getMessage());
                }
            } else {
                $skippedTables[] = $table;
                $this->warn("⚠ Table '{$table}' does not exist");
            }
        }

        // Résumé
        $this->newLine();
        $this->info('Data cleanup completed!');
        $this->info('Cleared tables: ' . count($clearedTables));

        if (!empty($skippedTables)) {
            $this->warn('Skipped tables: ' . count($skippedTables));
        }

        // Vérifier que la table users est intacte
        $userCount = DB::table('users')->count();
        $this->info("Users table preserved with {$userCount} records.");

        $this->newLine();
        $this->info('You can now test the application with clean data!');
    }
}
