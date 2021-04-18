<?php


namespace App\Cors;

use Slim\Routing\RouteCollectorProxy;

class Cors
{

    /**
     * @param RouteCollectorProxy $group
     * @param string $basepath
     * @param $controller
     */
    public static function setOptionsForRoutes(RouteCollectorProxy $group, string $basepath = "", $controller = null) {
        if ( $controller == null ) {
            $controller = self::getController();
        }

        $routes = $group->getRouteCollector()->getRoutes();
        $routeMap = array();
        foreach ( $routes as $route ) {
            $pattern = $route->getPattern();

            if ( substr( $pattern, 0, strlen($basepath)) != $basepath ) {
                continue;
            }

            if ( !isset($routeMap[$pattern]) ) {
                $routeMap[$pattern] = array();
            }

            foreach ( $route->getMethods() as $method ) {
                array_push($routeMap[$pattern], $method);
            }
        }

        foreach ( array_keys($routeMap) as $route ) {
            // ignore routes which already have an options route
            if ( in_array("OPTIONS", $routeMap[$route]) ) {
                continue;
            }

            $group->options($route, $controller);
        }
    }

    public static function getController($origins = null, $methods = null, $headers = null, $allowCredentials = false): array
    {
        return [new AccessControlOrigin($origins, $methods, $headers, $allowCredentials = true), "controller"];
    }

    public static function getMiddleware($origins = null, $methods = null, $headers = null, $allowCredentials = false): array
    {
        return [new AccessControlOrigin($origins, $methods, $headers, $allowCredentials = true), "middleware"];
    }
}