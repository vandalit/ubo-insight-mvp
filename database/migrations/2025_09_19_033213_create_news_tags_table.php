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
        Schema::create('news_tags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('news_id')->notNull();
            $table->uuid('tag_id')->notNull();
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('news_id')->references('id')->on('news')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            
            // Índices
            $table->index('news_id');
            $table->index('tag_id');
            $table->unique(['news_id', 'tag_id']); // Evitar duplicados
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_tags');
    }
};
