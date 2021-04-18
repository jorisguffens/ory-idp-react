<?php

use App\Environment;
use Illuminate\Database\Connection;
use Psr\Container\ContainerInterface;
use RateLimit\RedisRateLimiter;
use Selective\Config\Configuration;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;

return [

    // configuration
    Configuration::class => function () {
        return new Configuration(require __DIR__ . '/settings.php');
    },

    // app
    App::class => function (ContainerInterface $container) {
        AppFactory::setContainer($container);
        $app = AppFactory::create();

        // Optional: Set the base path to run the app in a sub-directory
        // The public directory must not be part of the base path
        //$app->setBasePath('/slim4-tutorial');

        $app->addBodyParsingMiddleware();

        // Initialize connection
        $container->get(Connection::class);

        return $app;
    },

    // error middleware
    ErrorMiddleware::class => function (ContainerInterface $container) {
        $app = $container->get(App::class);
        $settings = $container->get(Configuration::class)->getArray('error_handler_middleware');

        $errorMiddleware = new ErrorMiddleware(
            $app->getCallableResolver(),
            $app->getResponseFactory(),
            (bool)$settings['display_error_details'],
            (bool)$settings['log_errors'],
            (bool)$settings['log_error_details']
        );

        $errorHandler = $errorMiddleware->getDefaultErrorHandler();
        $errorHandler->forceContentType('application/json');

        return $errorMiddleware;
    },

    // Database connection
    Connection::class => function (ContainerInterface $container) {
        $capsule = new \Illuminate\Database\Capsule\Manager;
        $capsule->addConnection($container->get(Configuration::class)->getArray('db'));
        $capsule->setAsGlobal();
        $capsule->bootEloquent();

        return $capsule->getConnection();
    },

    RedisRateLimiter::class => function(ContainerInterface  $container) {
        $redis = new Redis();
        $redis->connect(Environment::env("REDIS_HOST"), Environment::env("REDIS_PORT"));

        if ( Environment::env("REDIS_PASSWORD") ) {
            $redis->auth(Environment::env("REDIS_PASSWORD"));
        }

        return new RedisRateLimiter($redis);
    },

];