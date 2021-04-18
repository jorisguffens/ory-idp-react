<?php


namespace App\Controllers;


use App\Domain\Address;
use App\Queries;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class AddressController
{

    public function __construct(Connection $connection) {}

    public function getAll(Request $request, Response $response, array $args): ResponseInterface {
        $addresss = Address::query();
        Queries::protectResultOne($addresss, $request->getAttribute("user"), "last_address_id");
        return Queries::response($response, $addresss->get());
    }

    public function getOne(Request  $request, Response  $response, array $args): ResponseInterface  {
        $address = Address::query()->where("id", "=", $args["id"])->first();
        Queries::protectResultOne($address, $request->getAttribute("user"), "last_address_id");
        return Queries::response($response, $address->first());
    }

    public function insert(Request $request, Response  $response, array $args): ResponseInterface  {
        $body = $request->getParsedBody();
        $address = new Address();
        $address->fill($body);
        $address->save();
        return Responses::success($response, $address, 201);
    }

    public function update(Request  $request, Response  $response, array $args): ResponseInterface  {
        $address = Address::query()->where("id", "=", $args["id"])->first();
        if ( $address == null ) {
            return Responses::error404($response);
        }

        $body = $request->getParsedBody();
        $address->fill($body);
        $address->save();

        return Responses::success($response, $address);
    }

    public function delete(Request  $request, Response  $response, array $args): ResponseInterface  {
        $address = Address::query()->where("id", "=", $args["id"])->first();
        if ( $address == null ) {
            return Responses::error404($response);
        }

        $address->delete();
        return Responses::success($response, $address);
    }

}