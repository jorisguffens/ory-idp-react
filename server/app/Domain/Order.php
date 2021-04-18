<?php


namespace App\Domain;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class Order extends Model
{
    public $incrementing = false;

    protected $casts = [
        'approved' => 'boolean',
        'finished' => 'boolean'
    ];

    protected $fillable = [
        "approved",
        "expected_duration",
        "finished"
    ];

    /* Relations */

    public function user(): Relation
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function deliveryAddress(): Relation
    {
        return $this->belongsTo(Address::class, "delivery_address_id");
    }

    public function orderType(): Relation
    {
        return $this->belongsTo(OrderType::class, "order_type_id");
    }

    public function products(): Relation
    {
        return $this->belongsToMany(Product::class, "product_orders")
            ->withPivotValue("comment", "")
            ->withPivotValue("amount", 1);
    }

}