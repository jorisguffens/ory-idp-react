<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class UserSession extends Model
{
    public $incrementing = false;

    const UPDATED_AT = null;

    protected $casts = [
        'id' => 'string',
        'user_id' => 'integer',
        'token' => 'string',
        'ip_address'
    ];


    protected $fillable = [];


    /* Relations */

    public function user(): Relation
    {
        return $this->belongsTo(User::class, "user_id");
    }

}