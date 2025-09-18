<?php

// Parse Heroku DATABASE_URL for Laravel
if (isset($_ENV["DATABASE_URL"])) {
    $url = parse_url($_ENV["DATABASE_URL"]);

    $_ENV["DB_CONNECTION"] = $url["scheme"];
    $_ENV["DB_HOST"] = $url["host"];
    $_ENV["DB_PORT"] = $url["port"];
    $_ENV["DB_DATABASE"] = ltrim($url["path"], "/");
    $_ENV["DB_USERNAME"] = $url["user"];
    $_ENV["DB_PASSWORD"] = $url["pass"];
}

return [];
