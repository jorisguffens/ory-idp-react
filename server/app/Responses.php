<?php


namespace App;

use Illuminate\Database\Eloquent\Model;
use Psr\Http\Message\ResponseInterface as Response;

class Responses
{

    /**
     *
     * Sends a standardized error response in json with a custom status code (default 400)
     *
     * @param Response $response
     * @param $message
     * @param int $statusCode
     * @return Response
     */
    public static function error(Response $response, $message, $statusCode = 400): Response
    {
        return self::json($response, [
            "message" => $message
        ])->withStatus($statusCode);
    }

    /**
     *
     * Sends a standardized 404 error
     *
     * @param Response $response
     * @param string $message
     * @return Response
     */
    public static function error404(Response $response = null, $message = "Not found"): Response
    {
        if ( $response == null ) {
            $response = new \Slim\Psr7\Response();
        }
        
        return self::error($response, $message, 404);
    }

    /**
     *
     * Returns a success response in json when data is supplied with a custom status code (default 200).
     * When no data is supplied it will return the custom status code (default 204)
     *
     * @param Response $response
     * @param null $data
     * @param int $statusCode
     * @return Response
     */
    public static function success(Response $response = null, $data = null, $statusCode = 200): Response
    {
        if ( $response == null ) {
            $response = new \Slim\Psr7\Response();
        }

        if ( !empty($data) ) {
            if ( gettype($data) != 'array' && gettype($data) != 'object' ) {
                $data = [$data];
            }

            return self::json($response, $data)->withStatus($statusCode);
        }

        if ( $statusCode == 200 ) {
            $statusCode = 204;
        }

        if ( $response == null ) {
            $response = new \Slim\Psr7\Response();
        }
        return $response->withStatus($statusCode);
    }

    /**
     * Sends a response with json encoded data and the application/json content header
     *
     * @param Response $response
     * @param $data
     * @return Response
     */
    public static function json(Response $response, $data): Response
    {
        if ( $data instanceof Model ) {
            $response->getBody()->write($data->toJson());
        } else {
            $response->getBody()->write(json_encode($data));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     *
     * Sends a redirect response to a url with a custom status code (default 302)
     *
     * @param Response $response
     * @param $url
     * @param int $statusCode
     * @return Response
     */
    public static function redirect(Response $response, $url, $statusCode = 302): Response
    {
        return $response->withStatus($statusCode)->withHeader("Location", $url);
    }

}