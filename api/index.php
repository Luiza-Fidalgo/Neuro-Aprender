<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

start_user_session();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '/';
$path = preg_replace('~^/api(?=/|$)~', '', $path);
$path = rtrim($path, '/') ?: '/';

if ($path === '/health' && $method === 'GET') response(200, ['status' => 'ok']);

if ($path === '/session' && $method === 'GET') {
    $signedIn = isset($_SESSION['user_id']) && is_int($_SESSION['user_id']);
    response(200, ['authenticated' => $signedIn, 'csrfToken' => $signedIn ? ($_SESSION['csrf_token'] ?? '') : null]);
}

if ($path === '/login' && $method === 'POST') {
    same_origin();
    $data = input();
    $username = trim((string) ($data['username'] ?? ''));
    $password = (string) ($data['password'] ?? '');
    if ($username === '' || strlen($username) > 80 || strlen($password) > 256) response(400, ['error' => 'Credenciais inválidas.']);
    $attempts = $_SESSION['login_attempts'] ?? [];
    $attempts = array_values(array_filter($attempts, static fn($t) => is_int($t) && $t > time() - 900));
    if (count($attempts) >= 5) response(429, ['error' => 'Muitas tentativas. Tente novamente mais tarde.']);
    $query = database()->prepare('SELECT id, password_hash FROM users WHERE username = ? LIMIT 1');
    $query->execute([$username]);
    $user = $query->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        $attempts[] = time();
        $_SESSION['login_attempts'] = $attempts;
        response(401, ['error' => 'Usuário ou senha inválidos.']);
    }
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    unset($_SESSION['login_attempts']);
    response(200, ['authenticated' => true, 'csrfToken' => $_SESSION['csrf_token']]);
}

if ($path === '/logout' && $method === 'POST') {
    authenticated_user();
    require_csrf();
    $_SESSION = [];
    session_destroy();
    response(200, ['authenticated' => false]);
}

$userId = authenticated_user();
if (!in_array($method, ['GET', 'POST', 'DELETE'], true)) response(405, ['error' => 'Método não permitido.']);
if ($method !== 'GET') {
    same_origin();
    require_csrf();
}
$db = database();

if ($path === '/profiles' && $method === 'GET') {
    $statement = $db->prepare('SELECT id, code FROM profiles WHERE user_id = ? ORDER BY id DESC');
    $statement->execute([$userId]);
    response(200, ['profiles' => $statement->fetchAll()]);
}

if ($path === '/profiles' && $method === 'POST') {
    $data = input();
    $code = trim((string) ($data['code'] ?? ''));
    if (mb_strlen($code) < 2 || mb_strlen($code) > 30 || preg_match('/[\x00-\x1F\x7F]/u', $code)) {
        response(422, ['error' => 'Use um identificador entre 2 e 30 caracteres.']);
    }
    $check = $db->prepare('SELECT id FROM profiles WHERE user_id = ? AND code = ?');
    $check->execute([$userId, $code]);
    if ($check->fetch()) response(409, ['error' => 'Identificador já cadastrado.']);
    $statement = $db->prepare('INSERT INTO profiles (user_id, code) VALUES (?, ?)');
    $statement->execute([$userId, $code]);
    response(201, ['id' => (int) $db->lastInsertId(), 'code' => $code]);
}

if (preg_match('~^/profiles/([1-9][0-9]*)$~', $path, $m) && $method === 'DELETE') {
    $statement = $db->prepare('DELETE FROM profiles WHERE id = ? AND user_id = ?');
    $statement->execute([(int) $m[1], $userId]);
    if ($statement->rowCount() === 0) response(404, ['error' => 'Perfil não encontrado.']);
    response(200, ['deleted' => true]);
}

if ($path === '/records' && $method === 'GET') {
    $profileId = filter_input(INPUT_GET, 'profile_id', FILTER_VALIDATE_INT);
    if (!$profileId || $profileId < 1) response(400, ['error' => 'Informe um perfil válido.']);
    $statement = $db->prepare('SELECT r.id, r.profile_id, r.session_date, r.activity, r.participation, r.notes FROM session_records r JOIN profiles p ON p.id = r.profile_id WHERE p.user_id = ? AND p.id = ? ORDER BY r.session_date DESC, r.id DESC');
    $statement->execute([$userId, $profileId]);
    response(200, ['records' => $statement->fetchAll()]);
}

if ($path === '/records' && $method === 'POST') {
    $data = input();
    $profileId = filter_var($data['profileId'] ?? null, FILTER_VALIDATE_INT);
    $date = (string) ($data['date'] ?? '');
    $activity = (string) ($data['activity'] ?? '');
    $participation = (string) ($data['participation'] ?? '');
    $notes = trim((string) ($data['notes'] ?? ''));
    $allowedActivities = ['Associação de figuras', 'Sequência lógica', 'Rotina visual', 'Outra atividade'];
    $allowedParticipation = ['Participou com autonomia', 'Participou com apoio', 'Fez uma pausa', 'Não concluiu a proposta'];
    $dt = DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if (!$profileId || !$dt || $dt->format('Y-m-d') !== $date || !in_array($activity, $allowedActivities, true) || !in_array($participation, $allowedParticipation, true) || mb_strlen($notes) > 240) {
        response(422, ['error' => 'Confira os dados da sessão.']);
    }
    $check = $db->prepare('SELECT id FROM profiles WHERE id = ? AND user_id = ?');
    $check->execute([$profileId, $userId]);
    if (!$check->fetch()) response(404, ['error' => 'Perfil não encontrado.']);
    $statement = $db->prepare('INSERT INTO session_records (profile_id, session_date, activity, participation, notes) VALUES (?, ?, ?, ?, ?)');
    $statement->execute([$profileId, $date, $activity, $participation, $notes]);
    response(201, ['id' => (int) $db->lastInsertId()]);
}

if (preg_match('~^/records/([1-9][0-9]*)$~', $path, $m) && $method === 'DELETE') {
    $statement = $db->prepare('DELETE r FROM session_records r INNER JOIN profiles p ON p.id = r.profile_id WHERE r.id = ? AND p.user_id = ?');
    $statement->execute([(int) $m[1], $userId]);
    if ($statement->rowCount() === 0) response(404, ['error' => 'Registro não encontrado.']);
    response(200, ['deleted' => true]);
}
response(404, ['error' => 'Rota não encontrada.']);
