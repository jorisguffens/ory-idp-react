<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;

class OrderType extends Model
{
    public $incrementing = false;

    const CREATED_AT = null;
    const UPDATED_AT = null;

    protected $casts = [
        'enabled' => 'boolean'
    ];

    protected $fillable = [];

    /* Relations */


}