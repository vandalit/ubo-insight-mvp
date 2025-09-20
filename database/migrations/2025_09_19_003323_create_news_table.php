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
        Schema::create('news', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('title', 255)->notNull();
            $table->text('content')->notNull();
            $table->text('excerpt')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->uuid('category_id')->nullable();
            $table->uuid('author_id')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('category_id')->references('id')->on('content_categories');
            $table->foreign('author_id')->references('id')->on('users');
            
            // Índices para optimización
            $table->index('category_id');
            $table->index('author_id');
            $table->index('is_published');
            $table->index('is_featured');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
