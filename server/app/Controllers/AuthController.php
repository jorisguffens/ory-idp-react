<?php


namespace App\Controllers;


use App\Domain\Address;
use App\Domain\User;
use App\Domain\UserSession;
use App\Queries;
use App\Responses;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Illuminate\Database\Connection;
use Psr\Http\Message\ResponseInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class   AuthController
{

    public function __construct(Connection $connection) {}

    public function login(Request $request, Response $response, array $args): ResponseInterface {
        $body = $request->getParsedBody();
        if ( empty($body["email"]) ) {
            return Responses::error($response, "Email missing.");
        }

        $user = User::query()->where("email", "=", $body["email"])->first();
        if ( $user == null ) {
            return Responses::error($response, "Invalid credentials.");
        }

        if ( !password_verify($body["password"], $user->password_hash) ) {
            return Responses::error($response, "Invalid credentials.");
        }

        $payload = [
            "exp" => Carbon::now()->addHours(16)->unix(),
            "iat" => Carbon::now()->unix(),
            "sub" => $user->id,
            "name" => $user->name,
            "email" => $user->email
        ];

        $privateKey = file_get_contents(__DIR__ . "/../../keypair/private.key");

        $jwt = JWT::encode($payload, $privateKey, 'RS256');
        return Responses::success($response, [
            "token" => $jwt
        ]);
    }

    public function userInfo(Request $request, Response $response, array $args): ResponseInterface {
        return Responses::success($response, $request->getAttribute("user"));
    }

    private function generateRandomString($length = 10): string
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

}
