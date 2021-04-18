<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class OrderProduct extends Model
{
    public $incrementing = false;

    protected $fillable = [
        "comment",
        "expected_duration",
        "finished"
    ];

    /* Relations */

    public function order(): Relation
    {
        return $this->belongsTo(Order::class, "order_id");
    }

    public function product(): Relation
    {
        return $this->belongsTo(Product::class, "product_id");
    }

    public function additions(): Relation
    {
        return $this->belongsToMany(Product::class, "order_product_additions", "order_product_id", "product_id")
            ->withPivotValue("free");
    }

}