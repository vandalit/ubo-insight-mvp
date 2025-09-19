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
        Schema::create('home_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->integer('value');
            $table->string('unit')->nullable();
            $table->string('icon')->nullable();
            $table->string('color')->default('#0d2c5b');
            $table->integer('order_index')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['is_active', 'order_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_metrics');
    }
};
