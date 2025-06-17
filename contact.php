<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Chargement de .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = htmlspecialchars(trim($_POST['nom'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    if (!$nom || !$email || !$message) {
        http_response_code(400);
        echo json_encode(["error" => "Tous les champs sont obligatoires et un email valide est requis."]);
        exit;
    }

    $webhookUrl = $_ENV['WEBHOOK_URL'] ?? null;
    if (!$webhookUrl) {
        http_response_code(500);
        echo json_encode(["error" => "Configuration manquante."]);
        exit;
    }

    $payload = json_encode([
        "username" => "Formulaire VIMA Invest",
        "content" => "**Nouveau message de contact**\n**Nom :** $nom\n**Email :** $email\n**Message :** $message"
    ]);

    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode == 204 || $httpCode == 200) {
        echo json_encode(["success" => "Message envoyé avec succès."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Erreur lors de l'envoi du message."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée."]);
}
