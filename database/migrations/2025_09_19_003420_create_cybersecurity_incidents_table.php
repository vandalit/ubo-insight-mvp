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
        Schema::create('cybersecurity_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 255)->notNull();
            $table->text('description')->notNull();
            $table->text('details')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->string('item_type', 100)->nullable(); // 'policy', 'training', 'incident', 'audit', 'identity'
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Índices para optimización
            $table->index('item_type');
            $table->index('is_active');
            $table->index('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cybersecurity_items');
    }
};
