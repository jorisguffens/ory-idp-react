<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class Address extends Model
{
    public $incrementing = false;

    protected $casts = [
        'admin' => 'boolean'
    ];

    protected $fillable = [
        "city",
        "address"
    ];

    /* Relations */

    public function postalCode(): Relation
    {
        return $this->hasOne(PostalCode::class, "postal_code_id");
    }

}