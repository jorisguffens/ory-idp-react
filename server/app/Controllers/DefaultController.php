<?php


namespace App\Controllers;


use App\Responses;
use Illuminate\Database\Connection;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

class DefaultController
{

    public function __construct(Connection $connection) {}

    public function getAll(RequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {
        return Responses::error404($response);
    }

    public function getOne(RequestInterface  $request, ResponseInterface  $response, array $args): ResponseInterface  {
        return Responses::error404($response);
    }

    public function insert(RequestInterface  $request, ResponseInterface  $response, array $args): ResponseInterface  {
        return Responses::error404($response);
    }

    public function update(RequestInterface  $request, ResponseInterface  $response, array $args): ResponseInterface  {
        return Responses::error404($response);
    }

    public function delete(RequestInterface  $request, ResponseInterface  $response, array $args): ResponseInterface  {
        return Responses::error404($response);
    }
    public function hello(RequestInterface $request, ResponseInterface $response, array $args): ResponseInterface {
        return Responses::error404($response);
    }


}
