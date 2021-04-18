<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class Category extends Model
{
    public $incrementing = false;

    protected $casts = [
        'id' => 'integer',
        'name' => 'string'
    ];

    /* Relations */

    public function additions(): Relation
    {
        return $this->belongsToMany(Category::class, "category_additions", "category_id", "addition_category_id")
            ->withPivot("free");
    }

}
