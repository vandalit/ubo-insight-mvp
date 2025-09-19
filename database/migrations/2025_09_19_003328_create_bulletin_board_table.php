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
        Schema::create('bulletin_board', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('gen_random_uuid()'));
            $table->string('title', 255)->notNull();
            $table->text('content')->notNull();
            $table->string('type', 50)->notNull(); // aviso, comunicado, evento, urgente
            $table->uuid('category_id')->nullable();
            $table->uuid('author_id')->nullable();
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->boolean('is_urgent')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('views_count')->default(0);
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('category_id')->references('id')->on('content_categories');
            $table->foreign('author_id')->references('id')->on('users');
            
            // Índices para optimización
            $table->index('type');
            $table->index('category_id');
            $table->index('author_id');
            $table->index('is_published');
            $table->index('is_urgent');
            $table->index('valid_from');
            $table->index('valid_until');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulletin_board');
    }
};
