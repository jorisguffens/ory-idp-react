<?php


namespace App\Middleware;


use App\Domain\User;
use App\Domain\UserSession;
use App\Responses;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class AuthMiddleware
{

    private $requireAuthentication;
    private $requireAdmin;
    private $connection;

    public function __construct($requireAuthentication = false, $requireAdmin = false)
    {
        $this->requireAuthentication = $requireAuthentication;
        $this->requireAdmin = $requireAdmin;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $user = $request->getAttribute("user");

        if ( $user == null ) {
            $authHeader = $request->getHeaderLine("Authorization");
            if (empty($authHeader) && $this->requireAuthentication) {
                $response = new \Slim\Psr7\Response();
                return Responses::error($response, "Authorization header missing.", 401);
            }

            if (!str_starts_with($authHeader, "Bearer ")) {
                $response = new \Slim\Psr7\Response();
                return Responses::error($response, "Bearer token missing.", 401);
            }

            $bearer = substr($authHeader, "7");
            $publicKey = file_get_contents(__DIR__ . "/../../keypair/public.key");
            $payload = (array) JWT::decode($bearer, $publicKey, array('RS256'));

            if ( $payload["exp"] < Carbon::now()->unix() ) {
                $response = new \Slim\Psr7\Response();
                return Responses::error($response, "Token expired.", 401);
            }

            $user = User::query()->find($payload["sub"]);
            if ($user == null) {
                $response = new \Slim\Psr7\Response();
                return Responses::error($response, "Invalid user.", 401);
            }

            $request = $request->withAttribute("user", $user);
        }

        if ($this->requireAdmin && !$user->admin) {
            $response = new \Slim\Psr7\Response();
            return Responses::error($response, "Forbidden", 403);
        }

        return $handler->handle($request);
    }

}