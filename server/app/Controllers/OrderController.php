<?php


namespace App\Controllers;


use App\Domain\Order;
use App\Domain\Product;
use App\Queries;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class OrderController
{

    public function __construct(Connection $connection) {}

    public function getAll(Request $request, Response $response, array $args): ResponseInterface {
        $orders = Order::query()->with(["products", "deliveryAddress"]);
        Queries::applyParams($orders, $request->getQueryParams());
        Queries::protectResult($orders, $request->getAttribute("user"));
        return Queries::response($response, $orders->get());
    }

    public function getOne(Request $request, Response $response, array $args): ResponseInterface  {
        $order = Order::query()
            ->with(["products", "deliveryAddress"])
            ->where("id", "=", $args["id"]);
        Queries::protectResult($order, $request->getAttribute("user"));
        return Queries::response($response, $order->first());
    }

    public function insert(Request $request, Response $response, array $args): ResponseInterface  {
        $body = $request->getParsedBody();
        $order = new Order();
        $order->id = Uuid::uuid4();
        $order->fill($body);
        $order->user()->associate($request->getAttribute("user"));
        $order->save();
        return Responses::success($response, $order, 201);
    }

    public function update(Request  $request, Response  $response, array $args): ResponseInterface  {
        $order = Order::query()->where("id", "=", $args["id"])->first();
        if ( $order == null ) {
            return Responses::error404($response);
        }

        $body = $request->getParsedBody();
        $order->fill($body);
        $order->save();

        return Responses::success($response, $order);
    }

    public function delete(Request $request, Response $response, array $args): ResponseInterface  {
        $order = Order::query()->where("id", "=", $args["id"])->first();
        if ( $order == null ) {
            return Responses::error404($response);
        }

        $order->delete();
        return Responses::success($response, $order);
    }

    //

    public function insertProduct(Request $request, Response  $response, array $args): ResponseInterface  {
        $order = Order::query()
            ->with(["products", "deliveryAddress"])
            ->where("id", "=", $args["id"]);
        Queries::protectResult($order, $request->getAttribute("user"));
        $order = $order->first();
        if ( $order == null ) {
            return Responses::error404($response, "Order not found.");
        }

        if ( $order->approved ) {
            return Responses::error($response, "Order already in progress.", 403);
        }

        $body = $request->getParsedBody();
        if ( empty($body["product_id"]) ) {
            return Responses::error($response, "product_id missing.");
        }

        $product = Product::query()->where("id", "=", $body["product_id"])->first();
        if ( $product == null ) {
            return Responses::error404($response, "Product not found.");
        }

        $comment = "";
        if ( !empty($body["comment"]) ) {
            $comment = $body["comment"];
        }

        $order->products()->attach($product, ["comment" => $comment]);
        $order->save();

        return Responses::success($response, $order, 201);
    }

    public function deleteProduct(Request $request, Response  $response, array $args): ResponseInterface  {
        $order = Order::query()
            ->with(["products", "deliveryAddress"])
            ->where("id", "=", $args["id"]);
        Queries::protectResult($order, $request->getAttribute("user"));
        $order = $order->first();
        if ( $order == null ) {
            return Responses::error404($response, "Order not found.");
        }

        if ( $order->approved ) {
            return Responses::error($response, "Order already in progress.", 403);
        }

        $product = Product::query()->where("id", "=", $args["pid"])->first();
        if ($product == null) {
            return Responses::error404($response, "Product does not belong to this order.");
        }

        $order->products()->detach($product);
        $order->save();

        return Responses::success($response, $order, 201);
    }

}