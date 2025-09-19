<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('name', 255)->notNull();
            $table->text('description')->nullable();
            $table->string('status', 50)->default('planning'); // planning, in-progress, completed, on-hold
            $table->integer('progress')->default(0); // 0-100
            $table->decimal('budget', 15, 2)->default(0);
            $table->decimal('spent', 15, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->uuid('manager_id')->nullable();
            $table->integer('team_size')->default(1);
            $table->string('priority', 20)->default('medium'); // low, medium, high
            $table->json('tags')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('manager_id')->references('id')->on('users');
            
            // Índices para optimización
            $table->index('status');
            $table->index('priority');
            $table->index('manager_id');
            $table->index('is_active');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
