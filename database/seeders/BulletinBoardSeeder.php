<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BulletinBoard;
use App\Models\ContentCategory;
use App\Models\User;
use Illuminate\Support\Str;

class BulletinBoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear avisos de ejemplo para el departamento TI
        $bulletinData = [
            [
                'title' => 'Mantenimiento de Red WiFi Campus Norte',
                'content' => 'Se realizará mantenimiento preventivo de la infraestructura WiFi en Campus Norte el día viernes 22 de septiembre de 14:00 a 16:00 hrs. Durante este período habrá interrupciones intermitentes en la conectividad.',
                'type' => 'mantenimiento',
                'is_urgent' => false,
                'valid_days' => 5,
            ],
            [
                'title' => 'URGENTE: Actualización de Contraseñas Obligatoria',
                'content' => 'Por medidas de seguridad, todos los usuarios deben actualizar sus contraseñas antes del 30 de septiembre. Las nuevas contraseñas deben tener mínimo 12 caracteres incluyendo mayúsculas, minúsculas, números y símbolos.',
                'type' => 'urgente',
                'is_urgent' => true,
                'valid_days' => 10,
            ],
            [
                'title' => 'Nueva Versión del Sistema Académico Disponible',
                'content' => 'Ya está disponible la versión 3.2 del sistema académico con mejoras en rendimiento y nuevas funcionalidades. La actualización se aplicará automáticamente durante el próximo reinicio.',
                'type' => 'informativo',
                'is_urgent' => false,
                'valid_days' => 15,
            ],
            [
                'title' => 'Capacitación: Herramientas de Colaboración Online',
                'content' => 'Invitamos a participar en la capacitación sobre herramientas de colaboración online (Teams, SharePoint, OneDrive) que se realizará el miércoles 27 de septiembre a las 15:00 hrs en Aula Magna.',
                'type' => 'evento',
                'is_urgent' => false,
                'valid_days' => 7,
            ],
            [
                'title' => 'Respaldo de Datos - Verificación Semanal',
                'content' => 'Recordamos a todos los usuarios verificar que sus datos importantes estén respaldados correctamente. El sistema automático de respaldo funciona diariamente, pero recomendamos verificar la integridad de los archivos críticos.',
                'type' => 'recordatorio',
                'is_urgent' => false,
                'valid_days' => 30,
            ],
            [
                'title' => 'Nuevas Licencias de Software Disponibles',
                'content' => 'Se han adquirido nuevas licencias de software especializado para las carreras de ingeniería. Los estudiantes pueden solicitarlas a través del portal de servicios TI con su credencial institucional.',
                'type' => 'informativo',
                'is_urgent' => false,
                'valid_days' => 45,
            ]
        ];

        $categoryId = ContentCategory::where('slug', 'avisos-generales')->first()?->id;
        $adminUser = User::first(); // Usar el primer usuario disponible
        
        foreach ($bulletinData as $data) {
            BulletinBoard::create([
                'id' => Str::uuid(),
                'title' => $data['title'],
                'content' => $data['content'],
                'type' => $data['type'],
                'category_id' => $categoryId,
                'author_id' => $adminUser?->id,
                'valid_from' => now()->toDateString(),
                'valid_until' => now()->addDays($data['valid_days'])->toDateString(),
                'is_urgent' => $data['is_urgent'],
                'is_published' => true,
                'views_count' => rand(25, 200),
            ]);
        }
        
        $this->command->info('✅ Diario Mural migrado con datos TI a base de datos');
    }
}
