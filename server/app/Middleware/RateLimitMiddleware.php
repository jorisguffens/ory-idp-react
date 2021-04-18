<?php


namespace App\Middleware;


use App\Responses;
use Psr\Container\ContainerInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use RateLimit\Exception\LimitExceeded;
use RateLimit\Rate;
use RateLimit\RedisRateLimiter;

class RateLimitMiddleware
{

    private $rateLimiter;
    private $requestsPerMinute;

    public function __construct(ContainerInterface $container, int $requestsPerMinute = 40)
    {
        $this->rateLimiter = $container->get(RedisRateLimiter::class);
        $this->requestsPerMinute = $requestsPerMinute;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response
    {

        if ( !empty($request->getAttribute("token")) ) {
            try {
                $token = $request->getAttribute("token");
                $this->rateLimiter->limit($token, Rate::perMinute($this->requestsPerMinute));
            } catch (LimitExceeded $e) {
                $response = new \Slim\Psr7\Response();
                return Responses::error($response, $e->getMessage(), 429);
            }
        } else {
            try {
                $identifier = $_SERVER['REMOTE_ADDR'];
                $this->rateLimiter->limit($identifier, Rate::perMinute($this->requestsPerMinute));
            } catch (LimitExceeded $e) {
                $response = new \Slim\Psr7\Response();
                return Responses::error($response, $e->getMessage(), 429);
            }
        }

        return $handler->handle($request);
    }

}