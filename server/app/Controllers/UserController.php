<?php


namespace App\Controllers;


use App\Domain\User;
use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class UserController
{

    public function __construct(Connection $connection) {}

    public function getAll(Request $request, Response $response, array $args): ResponseInterface {
        $users = User::query()->get();
        return Responses::success($response, $users);
    }

    public function getOne(Request  $request, Response  $response, array $args): ResponseInterface  {
        $user = User::query()->where("id", "=", $args["id"])->first();
        if ( $user == null ) {
            return Responses::error404($response);
        }

        return Responses::success($response, $user);
    }

    public function insert(Request $request, Response  $response, array $args): ResponseInterface  {
        $body = $request->getParsedBody();
        $user = new User();
        $user->id = Uuid::uuid4();
        $user->fill($body);

        if ( !empty($body["password"]) ) {
            $user->password_hash = password_hash($body["password"], PASSWORD_DEFAULT);
        }

        $user->save();
        return Responses::success($response, $user, 201);
    }

    public function update(Request  $request, Response  $response, array $args): ResponseInterface  {
        $user = User::query()->where("id", "=", $args["id"])->first();
        if ( $user == null ) {
            return Responses::error404($response);
        }

        $body = $request->getParsedBody();
        $user->fill($body);
        $user->save();

        return Responses::success($response, $user);
    }

    public function delete(Request  $request, Response  $response, array $args): ResponseInterface  {
        $user = User::query()->where("id", "=", $args["id"])->first();
        if ( $user == null ) {
            return Responses::error404($response);
        }

        $user->delete();
        return Responses::success($response, $user);
    }

}