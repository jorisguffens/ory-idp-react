<?php

use App\Controllers\AddressController;
use App\Controllers\AuthController;
use App\Controllers\CategoryController;
use App\Controllers\OrderController;
use App\Controllers\OrderFlowController;
use App\Controllers\OrderTypeController;
use App\Controllers\PostalCodeController;
use App\Controllers\ProductController;
use App\Controllers\UserController;
use App\Cors\Cors;
use App\Middleware\AuthMiddleware;
use App\Middleware\RateLimitMiddleware;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {

    $app->group("/api", function(RouteCollectorProxy $group) {

        // auth
        $group->get("/userInfo", AuthController::class . ":userInfo")
            ->add(new AuthMiddleware(true));
        $group->post("/login", AuthController::class . ":login");

        // products
        $group->get("/products", ProductController::class . ":getAll");
        $group->get("/products/{id}", ProductController::class . ":getOne");

        $group->group("", function (RouteCollectorProxy $group) {
            $group->post("/products", ProductController::class . ":insert");
            $group->map(["put", "patch"], "/products/{id}", ProductController::class . ":update");
            $group->delete("/products/{id}", ProductController::class . ":delete");
        })
        ->add(new AuthMiddleware(true, true));

        // categories
        $group->get("/categories", CategoryController::class . ":getAll");
        $group->get("/categories/{id}", CategoryController::class . ":getOne");

        $group->group("", function (RouteCollectorProxy $group) {
            $group->post("/categories", CategoryController::class . ":insert");
            $group->map(["put", "patch"], "/categories/{id}", CategoryController::class . ":update");
            $group->delete("/categories/{id}", CategoryController::class . ":delete");
        })
        ->add(new AuthMiddleware(true, true));
        
        // users
        $group->group("", function (RouteCollectorProxy $group) {
            $group->get("/users", UserController::class . ":getAll");
            $group->get("/users/{id}", UserController::class . ":getOne");
            $group->post("/users", UserController::class . ":insert");
            $group->map(["put", "patch"], "/users/{id}", UserController::class . ":update");
            $group->delete("/users/{id}", UserController::class . ":delete");
        })
        ->add(new AuthMiddleware(true, true));
        
        // addresses
        $group->group("", function (RouteCollectorProxy $group) {
            $group->get("/addresss", AddressController::class . ":getAll");
            $group->get("/addresss/{id}", AddressController::class . ":getOne");
            $group->post("/addresss", AddressController::class . ":insert");
            $group->map(["put", "patch"], "/addresss/{id}", AddressController::class . ":update");
            $group->delete("/addresss/{id}", AddressController::class . ":delete");
        })
        ->add(new AuthMiddleware(true, true));

        // postal_codes
        $group->get("/postal-codes", PostalCodeController::class . ":getAll");

        $group->group("", function (RouteCollectorProxy $group) {
            $group->get("/postal-codes/{id}", PostalCodeController::class . ":getOne");
            $group->post("/postal-codes", PostalCodeController::class . ":insert");
            $group->map(["put", "patch"], "/postal-codes/{id}", PostalCodeController::class . ":update");
            $group->delete("/postal-codes/{id}", PostalCodeController::class . ":delete");
        })
        ->add(new AuthMiddleware(true, true));
        
        // order types
        $group->get("/order-types", OrderTypeController::class . ":getAll");

        $group->group("", function (RouteCollectorProxy $group) {
            $group->get("/order-types/{id}", OrderTypeController::class . ":getOne");
            $group->post("/order-types", OrderTypeController::class . ":insert");
            $group->map(["put", "patch"], "/order-types/{id}", OrderTypeController::class . ":update");
            $group->delete("/order-types/{id}", OrderTypeController::class . ":delete");
        })
        ->add(new AuthMiddleware(true, true));

        // orders
        $group->get("/orders", OrderController::class . ":getAll");
        $group->get("/orders/{id}", OrderController::class . ":getOne");

        $group->group("", function (RouteCollectorProxy $group) {
            $group->post("/orders", OrderController::class . ":insert");
            $group->map(["put", "patch"], "/orders/{id}", OrderController::class . ":update");
            $group->delete("/orders/{id}", OrderController::class . ":delete");
        })
            ->add(new AuthMiddleware(true, true));

        // orders_products
        $group->post("/orders/{id}/products", OrderController::class . ":insertProduct");
        $group->delete("/orders/{id}/products/{pid}", OrderController::class . ":deleteProduct");

        // FLOWS
        $group->group("/flow", function(RouteCollectorProxy $group) {

            // order flow
            $group->post("/orders", OrderFlowController::class . ":insert");

        });

    })
    ->add(RateLimitMiddleware::class)
    ->add(Cors::getMiddleware("*", "*", "*"));

    Cors::setOptionsForRoutes($app,"", Cors::getController("*", "*", "*"));

};
