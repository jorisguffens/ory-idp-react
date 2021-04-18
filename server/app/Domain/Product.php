<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $incrementing = false;

    protected $casts = [
        'price_gross' => 'string',
        'tax_percent' => 'string',
        'garnish' => 'boolean'
    ];

    protected $fillable = [
        "name",
        "description",
        "price_gross",
        "tax_percent",
        "garnish"
    ];


}