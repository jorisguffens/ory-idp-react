<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class User extends Model
{
    public $incrementing = false;

    protected $casts = [
        'admin' => 'boolean'
    ];

    protected $fillable = [
        "email"
    ];

    protected $hidden = [
        'password_hash'
    ];


    /* Relations */

    public function lastAddress(): Relation
    {
        return $this->hasOne(Address::class, "last_address_id");
    }

    public function orders(): Relation
    {
        return $this->hasMany(Order::class, "user_id");
    }

}