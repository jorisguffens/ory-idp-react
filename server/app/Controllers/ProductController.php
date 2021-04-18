<?php


namespace App\Controllers;


use App\Domain\Product;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class ProductController
{

    public function __construct(Connection $connection) {}
    public function hello(Request $request, Response $response, array $args): ResponseInterface {
        $hello = "Hello";
        return Responses::success( $response, $hello );
    }
    public function getAll(Request $request, Response $response, array $args): ResponseInterface {
        $products = Product::query()->get();
        return Responses::success($response, $products);
    }

    public function getOne(Request  $request, Response  $response, array $args): ResponseInterface  {
        $product = Product::query()->where("id", "=", $args["id"])->first();
        if ( $product == null ) {
            return Responses::error404($response);
        }

        return Responses::success($response, $product);
    }

    public function insert(Request $request, Response  $response, array $args): ResponseInterface  {
        $body = $request->getParsedBody();
        $product = new Product();
        $product->id = Uuid::uuid4();
        $product->fill($body);
        $product->save();
        return Responses::success($response, $product, 201);
    }

    public function update(Request  $request, Response  $response, array $args): ResponseInterface  {
        $product = Product::query()->where("id", "=", $args["id"])->first();
        if ( $product == null ) {
            return Responses::error404($response);
        }

        $body = $request->getParsedBody();
        $product->fill($body);
        $product->save();

        return Responses::success($response, $product);
    }

    public function delete(Request  $request, Response  $response, array $args): ResponseInterface  {
        $product = Product::query()->where("id", "=", $args["id"])->first();
        if ( $product == null ) {
            return Responses::error404($response);
        }

        $product->delete();
        return Responses::success($response, $product);
    }



}
