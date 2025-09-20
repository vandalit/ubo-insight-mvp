<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ServiceAction extends Model
{
    use HasUuids;

    protected $fillable = [
        'service_id',
        'button_text',
        'action_type',
        'action_value',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
