<?php


namespace App\Controllers;


use App\Domain\OrderType;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class OrderTypeController
{

    public function __construct(Connection $connection) {}

    public function getAll(Request $request, Response $response, array $args): ResponseInterface {
        $orderTypes = OrderType::query()->get();
        return Responses::success($response, $orderTypes);
    }

    public function getOne(Request  $request, Response  $response, array $args): ResponseInterface  {
        $orderType = OrderType::query()->where("id", "=", $args["id"])->first();
        if ( $orderType == null ) {
            return Responses::error404($response);
        }

        return Responses::success($response, $orderType);
    }

    public function insert(Request $request, Response  $response, array $args): ResponseInterface  {
        $body = $request->getParsedBody();
        $orderType = new OrderType();
        $orderType->id = Uuid::uuid4();
        $orderType->fill($body);
        $orderType->save();
        return Responses::success($response, $orderType, 201);
    }

    public function update(Request  $request, Response  $response, array $args): ResponseInterface  {
        $orderType = OrderType::query()->where("id", "=", $args["id"])->first();
        if ( $orderType == null ) {
            return Responses::error404($response);
        }

        $body = $request->getParsedBody();
        $orderType->fill($body);
        $orderType->save();

        return Responses::success($response, $orderType);
    }

    public function delete(Request  $request, Response  $response, array $args): ResponseInterface  {
        $orderType = OrderType::query()->where("id", "=", $args["id"])->first();
        if ( $orderType == null ) {
            return Responses::error404($response);
        }

        $orderType->delete();
        return Responses::success($response, $orderType);
    }

}