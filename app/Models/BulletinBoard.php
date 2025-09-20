<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class BulletinBoard extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'bulletin_board';

    /**
     * Indicates if the model's ID is auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'content',
        'type',
        'category_id',
        'author_id',
        'valid_from',
        'valid_until',
        'is_urgent',
        'is_published',
        'views_count',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'valid_from' => 'date',
            'valid_until' => 'date',
            'is_urgent' => 'boolean',
            'is_published' => 'boolean',
            'views_count' => 'integer',
        ];
    }

    /**
     * Boot function from Laravel.
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    /**
     * Get the category that owns the bulletin.
     */
    public function category()
    {
        return $this->belongsTo(ContentCategory::class, 'category_id');
    }

    /**
     * Get the author that owns the bulletin.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope for published bulletins.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope for urgent bulletins.
     */
    public function scopeUrgent($query)
    {
        return $query->where('is_urgent', true);
    }

    /**
     * Scope for bulletins by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for valid bulletins (within date range).
     */
    public function scopeValid($query)
    {
        $today = now()->toDateString();
        return $query->where(function ($q) use ($today) {
            $q->whereNull('valid_from')
              ->orWhere('valid_from', '<=', $today);
        })->where(function ($q) use ($today) {
            $q->whereNull('valid_until')
              ->orWhere('valid_until', '>=', $today);
        });
    }
}
