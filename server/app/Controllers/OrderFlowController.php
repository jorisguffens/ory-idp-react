<?php


namespace App\Controllers;


use App\Domain\Address;
use App\Domain\Order;
use App\Domain\OrderType;
use App\Domain\PostalCode;
use App\Domain\Product;
use App\Domain\User;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class OrderFlowController
{

    public function __construct(Connection $connection)
    {
    }

    public function insert(Request $request, Response $response, array $args): ResponseInterface
    {
        $body = $request->getParsedBody();

        // order type
        if (empty($body["orderType"])) {
            return Responses::error($response, "No order type given.", 400);
        }

        $orderType = OrderType::query()->find($body["orderType"])->where("enabled", "=", "1")->first();
        if ($orderType == null) {
            return Responses::error($response, "Invalid order type.", 400);
        }

        // products
        if (empty($body["products"])) {
            return Responses::error($response, "No products given.", 400);
        }

        // user
        $user = $request->getAttribute("user");
        if ($user == null) {
            if (empty($body["email"])) {
                return Responses::error($response, "No email given.", 400);
            }

            $email = $body["email"];
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return Responses::error($response, "Invalid email given.", 400);
            }

            $user = User::query()->where("email", "=", $email)->first();
            if ($user == null) {
                $user = new User();
                $user->id = Uuid::uuid4();
                $user->email = $email;

                if (!empty($body["name"])) {
                    $user->name = $body["name"];
                }

                $user->save();
            }
        } else if (!empty($body["name"])) {
            $user->name = $body["name"];
            $user->save();
        }

        // address
        $address = null;
        if ($orderType->id === "DELIVERY") {
            if (!empty($body["addressId"])) {
                $address = Address::query()->find($body["addressId"])->first();
            }

            if ($address == null) {
                if (empty($body["address"])) {
                    return Responses::error($response, "No address given.", 400);
                }

                $postalCodeId = $body["postalCode"];
                $street = $body["street"];

                if (empty($postalCodeId) || empty($street)) {
                    return Responses::error($response, "Invalid address given.", 400);
                }

                $postalCode = PostalCode::query()->find($postalCodeId)->first();
                if ($postalCode == null) {
                    return Responses::error($response, "Invalid postal code given.", 400);
                }

                $address = new Address();
                $address->address = $street;
                $address->postalCode()->associate($postalCode);
                $address->save();
            }
        }

        $products = [];
        foreach ($body["products"] as $product) {
            if (empty($product["id"])) {
                return Responses::error($response, "Invalid product id given.", 400);
            }
            $products["id"] = $product;
        }

        $order = new Order();
        $order->id = Uuid::uuid4();
        $order->user()->associate($user);
        $order->orderType()->associate($orderType);

        if (!empty($body["comment"])) {
            $order->comment = $body["comment"];
        }

        if ($orderType->id === "DELIVERY") {
            $order->deliveryAddress()->associate($address);
        }

        $dbProducts = Product::query()->whereIn('id', array_keys($products))->get();
        foreach ($dbProducts as $product) {
            $order->products()->attach($product, [
                "amount" => $products[$product->id]["amount"],
                "comment" => $products[$product->id]["comment"]
            ]);
        }

        $order->save();
        return Responses::success($response, $order, 201);
    }

}