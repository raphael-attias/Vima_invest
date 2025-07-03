<?php
header('Content-Type: application/json; charset=utf-8');

// Debug : afficher les variables d'environnement
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, 'WEBHOOK_URL=') === 0) {
            $webhookUrl = trim(str_replace('WEBHOOK_URL=', '', $line), '"');
            break;
        }
    }
} else {
    exit(json_encode(['error' => 'Fichier .env introuvable']));
}

if (empty($webhookUrl)) {
    exit(json_encode(['error' => 'WEBHOOK_URL non définie dans .env']));
}

// Debug : vérifier l'URL
if (!filter_var($webhookUrl, FILTER_VALIDATE_URL)) {
    exit(json_encode(['error' => 'URL webhook invalide: ' . $webhookUrl]));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit(json_encode(['error' => 'Méthode non autorisée']));
}

$nom = trim($_POST['nom'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$nom || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$message) {
    exit(json_encode(['error' => 'Tous les champs sont obligatoires']));
}

$payload = json_encode([
    'username' => 'Formulaire VIMA Invest',
    'embeds' => [[
        'title' => 'Nouveau message de contact',
        'color' => 14602026,
        'fields' => [
            ['name' => 'Nom', 'value' => $nom, 'inline' => true],
            ['name' => 'Email', 'value' => $email, 'inline' => true],
            ['name' => 'Message', 'value' => $message, 'inline' => false]
        ],
        'timestamp' => date('c')
    ]]
]);

$ch = curl_init($webhookUrl);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_error($ch)) {
    echo json_encode(['error' => 'Erreur cURL: ' . curl_error($ch)]);
} elseif ($httpCode === 204) {
    echo json_encode(['success' => 'Message envoyé avec succès !']);
} else {
    echo json_encode(['error' => "Erreur Discord (Code: $httpCode): $response"]);
}

curl_close($ch);
