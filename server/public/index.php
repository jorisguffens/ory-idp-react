<?php

define('VERSION', '1.0');

error_reporting(E_ALL);
ini_set('display_errors', '1');

ob_start();
session_start();
date_default_timezone_set("Europe/Brussels");

use App\Environment;
use DI\ContainerBuilder;
use Slim\App;

require_once __DIR__ . '/../vendor/autoload.php';

Environment::init("../");
$containerBuilder = new ContainerBuilder();

// Set up settings
$containerBuilder->addDefinitions('../config/container.php');

// Build PHP-DI Container instance
$container = $containerBuilder->build();

// Create App instance
$app = $container->get(App::class);

// Register routes
(require '../config/routes.php')($app);

// Register middleware
(require '../config/middleware.php')($app);

// Run app
$app->run();