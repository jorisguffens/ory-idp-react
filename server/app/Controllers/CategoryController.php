<?php


namespace App\Controllers;

use App\Domain\Category;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class CategoryController
{

    public function __construct(Connection $connection) {}

    public function getAll(Request $request, Response $response, array $args): ResponseInterface {
        $categories = Category::query()->with(array('additions' => function($query) {
            $query->select("id");
        }))->get();
        return Responses::success($response, $categories);
    }

    public function getOne(Request  $request, Response  $response, array $args): ResponseInterface  {
        $category = Category::query()->with(array('additions' => function($query) {
            $query->select("id");
        }))->where("id", "=", $args["id"])->first();
        if ( $category == null ) {
            return Responses::error404($response);
        }

        return Responses::success($response, $category);
    }

    public function insert(Request $request, Response  $response, array $args): ResponseInterface  {
        $body = $request->getParsedBody();
        $category = new Category();
        $category->id = Uuid::uuid4();
        $category->fill($body);
        $category->save();
        return Responses::success($response, $category, 201);
    }

    public function update(Request  $request, Response  $response, array $args): ResponseInterface  {
        $category = Category::query()->where("id", "=", $args["id"])->first();
        if ( $category == null ) {
            return Responses::error404($response);
        }

        $body = $request->getParsedBody();
        $category->fill($body);
        $category->save();

        return Responses::success($response, $category);
    }

    public function delete(Request  $request, Response  $response, array $args): ResponseInterface  {
        $category = Category::query()->where("id", "=", $args["id"])->first();
        if ( $category == null ) {
            return Responses::error404($response);
        }

        $category->delete();
        return Responses::success($response, $category);
    }

}
