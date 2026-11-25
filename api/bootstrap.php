<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function response(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function database(): PDO {
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) response(503, ['error' => 'Banco de dados ainda não configurado.']);
    $config = require $path;
    if (!is_array($config) || !isset($config['host'], $config['name'], $config['user'], $config['password'])) {
        response(503, ['error' => 'Configuração do banco incompleta.']);
    }
    try {
        return new PDO(
            'mysql:host=' . $config['host'] . ';dbname=' . $config['name'] . ';charset=utf8mb4',
            $config['user'],
            $config['password'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false]
        );
    } catch (PDOException $exception) {
        error_log('NeuroAprender: falha na conexão ao banco');
        response(503, ['error' => 'Serviço temporariamente indisponível.']);
    }
}

function input(): array {
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 8192) response(413, ['error' => 'Conteúdo muito grande.']);
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) response(400, ['error' => 'Envie um JSON válido.']);
    return $data;
}

function start_user_session(): void {
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('neuroaprender_session');
    $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
}

function same_origin(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') return;
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (!in_array($origin, ['https://' . $host, 'http://' . $host], true)) response(403, ['error' => 'Origem não permitida.']);
}

function authenticated_user(): int {
    $id = $_SESSION['user_id'] ?? null;
    if (!is_int($id) || $id < 1) response(401, ['error' => 'Acesso não autorizado.']);
    return $id;
}

function require_csrf(): void {
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')) {
        response(403, ['error' => 'Verificação de segurança inválida.']);
    }
}

set_exception_handler(static function (Throwable $exception): void {
    error_log('NeuroAprender: erro interno em ' . $exception->getFile() . ':' . $exception->getLine());
    response(500, ['error' => 'Não foi possível concluir a operação.']);
});
