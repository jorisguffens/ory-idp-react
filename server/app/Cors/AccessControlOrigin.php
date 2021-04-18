<?php
/**
 * Created by PhpStorm.
 * User: Joris
 * Date: 29-11-18
 * Time: 09:11
 */

namespace App\Cors;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class AccessControlOrigin
{

    public $origins;
    public $headers;
    public $methods;
    public $allowCredentials;

    public function __construct($origins = null, $methods = null, $headers = null, $allowCredentials = false) {

        if ( gettype($origins) == "string" ) {
            $origins = array($origins);
        }

        if ( gettype($methods) == "string" ) {
            $methods = array($methods);
        }

        if ( gettype($headers) == "string" ) {
            $headers = array($headers);
        }

        $this->origins = $origins;
        $this->methods = $methods;
        $this->headers = $headers;
        $this->allowCredentials = $allowCredentials;
    }

    /**
     *
     * @param RequestInterface $request PSR7 request
     * @param ResponseInterface $response PSR7 response
     *
     * @return ResponseInterface
     */
    public function apply(RequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        if ( $this->origins == null ) {
            $response = $response->withHeader("Access-Control-Allow-Origin", $request->getHeader("Origin"));
        } else if ( $this->origins != null && !empty($this->origins) ) {
            $response = $response->withHeader("Access-Control-Allow-Origin", implode(", ", $this->origins));
        }

        if ( $this->headers != null && !empty($this->headers) ) {
            $response = $response->withHeader("Access-Control-Allow-Headers", implode(", ", $this->headers));
        }

        if ( $this->methods != null && !empty($this->methods) ) {
            $response = $response->withHeader("Access-Control-Allow-Methods", implode(", ", $this->methods));
        }

        if ( $this->allowCredentials ) {
            $response = $response->withHeader("Access-Control-Allow-Credentials", "true");
        }

        $response = $response->withAddedHeader("Vary", "Origin");
        return $response;
    }

    /**
     *
     * @param Request $request PSR7 request
     * @param RequestHandlerInterface $handler
     * @return ResponseInterface
     */
    public function middleware(Request $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        return $this->apply($request, $response);
    }

    /**
     *
     * @param Request $request PSR7 request
     * @param Response $response PSR7 response
     *
     * @param array $args
     * @return ResponseInterface
     */
    public function controller(Request $request, Response $response, array $args): ResponseInterface
    {
        $response = $this->apply($request, $response);
        return $response;
    }

}