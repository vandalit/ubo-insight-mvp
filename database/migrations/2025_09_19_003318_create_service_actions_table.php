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
        Schema::create('service_actions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('service_id')->notNull();
            $table->string('button_text', 100)->nullable();
            $table->string('action_type', 50)->notNull(); // 'login', 'mailto', 'redirect', 'none'
            $table->string('action_value', 500)->nullable(); // URL, email, etc.
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            
            // Índices
            $table->index('service_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_actions');
    }
};
