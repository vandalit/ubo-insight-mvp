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
        Schema::create('tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->notNull();
            $table->string('slug', 100)->unique()->notNull();
            $table->text('description')->nullable();
            $table->string('color_hex', 7)->default('#0d2c5b'); // Color UBO por defecto
            $table->string('icon', 50)->nullable(); // Emoji o clase CSS
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Índices
            $table->index('slug');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
