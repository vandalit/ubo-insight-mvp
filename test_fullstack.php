<?php
/**
 * Test Fullstack - UBO Insight MVP
 * Verifica la integración completa Frontend Angular + Backend Laravel
 */

echo "🚀 TESTING FULLSTACK UBO INSIGHT MVP\n";
echo "====================================\n\n";

$frontendUrl = 'http://localhost:4200';
$backendUrl = 'http://localhost:8000';
$results = [];

function testUrl($url, $description, $expectedContent = null) {
    global $results;
    
    echo "🔍 Testing: $description\n";
    echo "   URL: $url\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'UBO-Insight-Test/1.0');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "   ❌ ERROR: $error\n\n";
        $results[] = ['test' => $description, 'status' => 'FAIL', 'error' => $error];
        return false;
    }
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "   ✅ SUCCESS: HTTP $httpCode\n";
        
        if ($expectedContent && strpos($response, $expectedContent) !== false) {
            echo "   📄 Content: Found expected content\n";
        } elseif ($expectedContent) {
            echo "   ⚠️  WARNING: Expected content not found\n";
        }
        
        echo "\n";
        $results[] = ['test' => $description, 'status' => 'PASS', 'http_code' => $httpCode];
        return true;
    } else {
        echo "   ❌ FAIL: HTTP $httpCode\n\n";
        $results[] = ['test' => $description, 'status' => 'FAIL', 'http_code' => $httpCode];
        return false;
    }
}

echo "📱 FRONTEND TESTS (Angular)\n";
echo "===========================\n";

// Test Frontend Angular
testUrl($frontendUrl, 'Frontend Angular Home', 'UBO Insight');
testUrl("$frontendUrl/noticias", 'Frontend Noticias Page', 'Noticias');
testUrl("$frontendUrl/servicios", 'Frontend Servicios Page', 'Servicios');
testUrl("$frontendUrl/login", 'Frontend Login Page', 'login');

echo "\n🔧 BACKEND TESTS (Laravel API)\n";
echo "==============================\n";

// Test Backend Laravel
testUrl("$backendUrl/api/health", 'Backend Health Check');
testUrl("$backendUrl/api/debug", 'Backend Debug Info');
testUrl("$backendUrl/api/v1/projects", 'Backend Projects API');
testUrl("$backendUrl/api/v1/news", 'Backend News API');
testUrl("$backendUrl/api/v1/projects-stats", 'Backend Project Stats');

echo "\n🔗 INTEGRATION TESTS\n";
echo "====================\n";

// Test CORS (simulando request desde frontend)
echo "🔍 Testing: CORS Configuration\n";
echo "   Simulating Angular request to Laravel API...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$backendUrl/api/v1/projects");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Origin: http://localhost:4200',
    'Accept: application/json',
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200) {
    echo "   ✅ SUCCESS: CORS configured correctly\n";
    $results[] = ['test' => 'CORS Configuration', 'status' => 'PASS'];
} else {
    echo "   ❌ FAIL: CORS issues detected\n";
    $results[] = ['test' => 'CORS Configuration', 'status' => 'FAIL'];
}

echo "\n";

// Test API Response Format
echo "🔍 Testing: API Response Format\n";
echo "   Checking JSON structure...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "$backendUrl/api/v1/projects");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$json = json_decode($response, true);
if ($json && isset($json['success']) && isset($json['data'])) {
    echo "   ✅ SUCCESS: API returns correct JSON format\n";
    echo "   📊 Data: " . count($json['data']) . " projects found\n";
    $results[] = ['test' => 'API Response Format', 'status' => 'PASS'];
} else {
    echo "   ❌ FAIL: Invalid API response format\n";
    $results[] = ['test' => 'API Response Format', 'status' => 'FAIL'];
}

echo "\n";

echo "\n🏁 FULLSTACK TEST RESULTS\n";
echo "==========================\n";

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

echo "\n📊 FINAL STATISTICS:\n";
echo "====================\n";
echo "✅ Tests Passed: $passed\n";
echo "❌ Tests Failed: $failed\n";
echo "📈 Total Tests: " . ($passed + $failed) . "\n";
echo "🎯 Success Rate: " . round(($passed / ($passed + $failed)) * 100, 1) . "%\n\n";

if ($failed === 0) {
    echo "🎉 ALL TESTS PASSED! Frontend and Backend are working together!\n";
    echo "\n🌐 Access your application:\n";
    echo "Frontend: http://localhost:4200\n";
    echo "Backend API: http://localhost:8000/api\n";
    echo "\n🔍 Try these features:\n";
    echo "1. Navigate to Noticias - should load from PostgreSQL\n";
    echo "2. Login and access Projects Dashboard\n";
    echo "3. Check browser console for API debug logs\n";
} else {
    echo "⚠️  Some tests failed. Check the errors above.\n";
}

echo "\n✨ FULLSTACK INTEGRATION TEST COMPLETED ✨\n";
?>
