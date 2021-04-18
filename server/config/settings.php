<?php

use App\Environment;

return array(
    "db" => array(
        'driver' => 'mysql',
        'host' => Environment::env("DB_HOST"),
        'database' => Environment::env("DB_NAME"),
        'username' => Environment::env("DB_USER"),
        'password' => Environment::env("DB_PASSWORD"),
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
    ),

    // Error Handling Middleware settings
    'error_handler_middleware' => [

        // Should be set to false in production
        'display_error_details' => true,

        // Parameter is passed to the default ErrorHandler
        // View in rendered output by enabling the "displayErrorDetails" setting.
        // For the console and unit tests we also disable it
        'log_errors' => true,

        // Display error details in error log
        'log_error_details' => true,
    ]
);