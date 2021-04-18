<?php


namespace App\Controllers;


use App\Domain\PostalCode;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class PostalCodeController
{

    public function __construct(Connection $connection) {}

    public function getAll(Request $request, Response $response, array $args): ResponseInterface {
        $postalCodes = PostalCode::query()->get();
        return Responses::success($response, $postalCodes);
    }

    public function getOne(Request  $request, Response  $response, array $args): ResponseInterface  {
        $postalCode = PostalCode::query()->where("id", "=", $args["id"])->first();
        if ( $postalCode == null ) {
            return Responses::error404($response);
        }

        return Responses::success($response, $postalCode);
    }

    public function insert(Request $request, Response  $response, array $args): ResponseInterface  {
        $body = $request->getParsedBody();
        $postalCode = new PostalCode();
        $postalCode->id = $body["id"];
        $postalCode->fill($body);
        $postalCode->save();
        return Responses::success($response, $postalCode, 201);
    }

    public function update(Request  $request, Response  $response, array $args): ResponseInterface  {
        $postalCode = PostalCode::query()->where("id", "=", $args["id"])->first();
        if ( $postalCode == null ) {
            return Responses::error404($response);
        }

        $body = $request->getParsedBody();
        $postalCode->fill($body);
        $postalCode->save();

        return Responses::success($response, $postalCode);
    }

    public function delete(Request  $request, Response  $response, array $args): ResponseInterface  {
        $postalCode = PostalCode::query()->where("id", "=", $args["id"])->first();
        if ( $postalCode == null ) {
            return Responses::error404($response);
        }

        $postalCode->delete();
        return Responses::success($response, $postalCode);
    }

}