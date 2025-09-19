<?php
/**
 * Test de Integración Completo - UBO Insight MVP
 * Este script verifica que todo el sistema esté funcionando correctamente
 */

echo "🚀 INICIANDO TESTS DE INTEGRACIÓN UBO INSIGHT MVP\n";
echo "================================================\n\n";

$baseUrl = 'http://localhost:8000';
$results = [];

function testEndpoint($url, $method = 'GET', $data = null, $description = '') {
    global $results;
    
    echo "🔍 Testing: $description\n";
    echo "   URL: $url\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "   ❌ ERROR: $error\n\n";
        $results[] = ['test' => $description, 'status' => 'FAIL', 'error' => $error];
        return false;
    }
    
    $json = json_decode($response, true);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "   ✅ SUCCESS: HTTP $httpCode\n";
        if (isset($json['success']) && $json['success']) {
            echo "   📊 Response: success=true\n";
        }
        if (isset($json['count'])) {
            echo "   📊 Count: {$json['count']} registros\n";
        }
        echo "\n";
        $results[] = ['test' => $description, 'status' => 'PASS', 'http_code' => $httpCode];
        return true;
    } else {
        echo "   ❌ FAIL: HTTP $httpCode\n";
        if ($json && isset($json['message'])) {
            echo "   📝 Message: {$json['message']}\n";
        }
        echo "\n";
        $results[] = ['test' => $description, 'status' => 'FAIL', 'http_code' => $httpCode];
        return false;
    }
}

// 1. Test de salud básica
testEndpoint("$baseUrl/api/health", 'GET', null, 'API Health Check');

// 2. Test de debug
testEndpoint("$baseUrl/api/debug", 'GET', null, 'API Debug Info');

// 3. Test de proyectos
testEndpoint("$baseUrl/api/v1/projects", 'GET', null, 'Listar Proyectos');

// 4. Test de estadísticas de proyectos
testEndpoint("$baseUrl/api/v1/projects-stats", 'GET', null, 'Estadísticas de Proyectos');

// 5. Test de noticias
testEndpoint("$baseUrl/api/v1/news", 'GET', null, 'Listar Noticias');

// 6. Test de noticias destacadas
testEndpoint("$baseUrl/api/v1/news-featured", 'GET', null, 'Noticias Destacadas');

// 7. Test de servicios
testEndpoint("$baseUrl/api/v1/services", 'GET', null, 'Listar Servicios');

// 8. Test de usuarios
testEndpoint("$baseUrl/api/v1/users", 'GET', null, 'Listar Usuarios');

// Test project creation
testEndpoint('http://localhost:8000/api/v1/projects', 'POST', [
    'name' => 'Test Project Integration',
    'description' => 'Proyecto de prueba para integración',
    'status' => 'planning',
    'progress' => 0,
    'budget' => 50000,
    'spent' => 0,
    'start_date' => '2024-01-01',
    'end_date' => '2024-12-31',
    'team_size' => 3,
    'priority' => 'medium',
    'tags' => ['test', 'integration'],
    'is_active' => true
], 'Crear Nuevo Proyecto');

// Test new Home endpoints
testEndpoint('http://localhost:8000/api/v1/home/slides', 'GET', null, 'GET /api/v1/home/slides');
testEndpoint('http://localhost:8000/api/v1/home/metrics', 'GET', null, 'GET /api/v1/home/metrics');
testEndpoint('http://localhost:8000/api/v1/home/overview', 'GET', null, 'GET /api/v1/home/overview');

// 10. Test de endpoint inexistente (debe dar 404)
testEndpoint("$baseUrl/api/v1/endpoint-inexistente", 'GET', null, 'Endpoint Inexistente (debe fallar)');

echo "\n🏁 RESUMEN DE TESTS\n";
echo "==================\n";

$passed = 0;
$failed = 0;

foreach ($results as $result) {
    $status = $result['status'] === 'PASS' ? '✅' : '❌';
    echo "$status {$result['test']}\n";
    
    if ($result['status'] === 'PASS') {
        $passed++;
    } else {
        $failed++;
    }
}

echo "\n📊 ESTADÍSTICAS FINALES:\n";
echo "========================\n";
echo "✅ Tests Pasados: $passed\n";
echo "❌ Tests Fallidos: $failed\n";
echo "📈 Total Tests: " . ($passed + $failed) . "\n";
echo "🎯 Porcentaje Éxito: " . round(($passed / ($passed + $failed)) * 100, 1) . "%\n\n";

if ($failed === 0) {
    echo "🎉 ¡TODOS LOS TESTS PASARON! El sistema está funcionando correctamente.\n";
} else {
    echo "⚠️  Algunos tests fallaron. Revisar los errores arriba.\n";
}

echo "\n🔍 VERIFICACIÓN DE BASE DE DATOS:\n";
echo "=================================\n";

// Verificar conexión a base de datos usando artisan
echo "Ejecutando verificación de base de datos...\n";
$dbCheck = shell_exec('cd /home/vandalit/CodigoWSL/Proyectos/ubo-insight-mvp && php artisan tinker --execute="
echo \'📊 ESTADO DE LA BASE DE DATOS:\' . PHP_EOL;
echo \'============================\' . PHP_EOL;
echo \'Usuarios: \' . App\\Models\\User::count() . PHP_EOL;
echo \'Categorías: \' . App\\Models\\ContentCategory::count() . PHP_EOL;
echo \'Servicios: \' . App\\Models\\Service::count() . PHP_EOL;
echo \'Noticias: \' . App\\Models\\News::count() . PHP_EOL;
echo \'Diario Mural: \' . App\\Models\\BulletinBoard::count() . PHP_EOL;
echo \'Proyectos: \' . App\\Models\\Project::count() . PHP_EOL;
echo \'============================\' . PHP_EOL;
"');

echo $dbCheck;

echo "\n✨ TEST DE INTEGRACIÓN COMPLETADO ✨\n";
?>
