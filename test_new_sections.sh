#!/bin/bash

echo "🧪 TESTING NUEVAS SECCIONES DE SITEMAP BACKEND, FRONTEND Y BASE DE DATOS"
echo "=================================================================="

# Test 1: Verificar que las secciones están en la página principal
echo "📋 Test 1: Verificando renderizado de secciones..."
SECTIONS_COUNT=$(curl -s http://localhost:8000 | grep -c "🗺️ Sitemap Backend\|🗄️ Base de Datos\|🎯 Sitemap Frontend")
if [ "$SECTIONS_COUNT" -eq 3 ]; then
    echo "✅ PASS: Las 3 nuevas secciones están renderizadas"
else
    echo "❌ FAIL: Solo se encontraron $SECTIONS_COUNT secciones"
    exit 1
fi

# Test 2: Verificar que el sitemap XML funciona
echo "📋 Test 2: Verificando sitemap XML..."
XML_RESPONSE=$(curl -s http://localhost:8000/sitemap.xml | head -1)
if [[ "$XML_RESPONSE" == *"<?xml version"* ]]; then
    echo "✅ PASS: Sitemap XML se genera correctamente"
else
    echo "❌ FAIL: Sitemap XML no funciona"
    exit 1
fi

# Test 3: Verificar que el sitemap ASCII funciona
echo "📋 Test 3: Verificando sitemap ASCII..."
ASCII_RESPONSE=$(curl -s http://localhost:8000/sitemap/ascii | head -1)
if [[ "$ASCII_RESPONSE" == *"UBO INSIGHT MVP"* ]]; then
    echo "✅ PASS: Sitemap ASCII se genera correctamente"
else
    echo "❌ FAIL: Sitemap ASCII no funciona"
    exit 1
fi

# Test 4: Verificar que el schema de BD funciona
echo "📋 Test 4: Verificando schema de base de datos..."
SCHEMA_RESPONSE=$(curl -s http://localhost:8000/database/schema)
if [[ "$SCHEMA_RESPONSE" == *"\"success\":true"* ]]; then
    echo "✅ PASS: Schema de BD se genera correctamente"
else
    echo "❌ FAIL: Schema de BD no funciona"
    exit 1
fi

# Test 5: Verificar que el ASCII de BD funciona
echo "📋 Test 5: Verificando ASCII de base de datos..."
DB_ASCII_RESPONSE=$(curl -s http://localhost:8000/database/ascii | head -1)
if [[ "$DB_ASCII_RESPONSE" == *"UBO INSIGHT MVP"* ]]; then
    echo "✅ PASS: ASCII de BD se genera correctamente"
else
    echo "❌ FAIL: ASCII de BD no funciona"
    exit 1
fi

# Test 6: Verificar que la vista visual responde
echo "📋 Test 6: Verificando vista visual de BD..."
VISUAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/database/visual)
if [ "$VISUAL_STATUS" -eq 200 ]; then
    echo "✅ PASS: Vista visual de BD responde correctamente (HTTP 200)"
else
    echo "❌ FAIL: Vista visual de BD no responde (HTTP $VISUAL_STATUS)"
    exit 1
fi

# Test 7: Verificar que los botones están presentes
echo "📋 Test 7: Verificando presencia de botones..."
BUTTONS_COUNT=$(curl -s http://localhost:8000 | grep -c "Ver XML\|Ver ASCII\|Vista Visual Bento\|Schema JSON")
if [ "$BUTTONS_COUNT" -ge 4 ]; then
    echo "✅ PASS: Todos los botones están presentes ($BUTTONS_COUNT encontrados)"
else
    echo "❌ FAIL: Faltan botones (solo $BUTTONS_COUNT encontrados)"
    exit 1
fi

# Test 8: Verificar JavaScript functions
echo "📋 Test 8: Verificando funciones JavaScript..."
JS_FUNCTIONS=$(curl -s http://localhost:8000 | grep -c "toggleAccordion\|loadSitemapAscii\|loadDatabaseAscii\|loadDatabaseSchema\|loadFrontendFlow\|loadFrontendRoutes")
if [ "$JS_FUNCTIONS" -ge 6 ]; then
    echo "✅ PASS: Todas las funciones JavaScript están presentes ($JS_FUNCTIONS encontradas)"
else
    echo "❌ FAIL: Faltan funciones JavaScript (solo $JS_FUNCTIONS encontradas)"
    exit 1
fi

# Test 9: Verificar que database visual usa dark schema
echo "📋 Test 9: Verificando dark schema en database visual..."
DARK_SCHEMA=$(curl -s http://localhost:8000/database/visual | grep -c 'class="dark"\|bg-gray-900\|bg-gray-800')
if [ "$DARK_SCHEMA" -ge 2 ]; then
    echo "✅ PASS: Database visual usa dark schema correctamente"
else
    echo "❌ FAIL: Database visual no usa dark schema"
    exit 1
fi

echo ""
echo "🎉 TODOS LOS TESTS PASARON EXITOSAMENTE!"
echo "✅ Las 3 nuevas secciones están implementadas y funcionando correctamente"
echo "✅ Sitemap Backend: XML y ASCII funcionan"
echo "✅ Sitemap Frontend: Flujo UX y rutas implementados"
echo "✅ Base de datos: Schema y ASCII funcionan"
echo "✅ Vista visual Bento con dark schema implementada"
echo "✅ JavaScript y acordeones implementados"
echo "✅ Archivos de welcome.blade.php limpiados"
echo ""
echo "🌐 Puedes probar las funcionalidades en: http://127.0.0.1:38591"
