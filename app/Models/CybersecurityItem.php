<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CybersecurityItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'description',
        'details',
        'image_url',
        'item_type',
        'display_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('item_type', $type);
    }
}
