<?php


namespace App;

use Dotenv\Dotenv;
use Dotenv\Exception\InvalidPathException;

class Environment
{
    public static function init($location) {
        try {
            $dotenv = Dotenv::createImmutable($location);
            $dotenv->load();
        } catch (InvalidPathException $ignored) {}

    }

    public static function env($key, $default = null) {
        return isset($_ENV[$key]) ? $_ENV[$key] : $default;
    }

}

function env($key, $default = null)
{
    return Environment::env($key, $default);
}