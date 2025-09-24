<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     * GET /api/v1/users
     */
    public function index(Request $request)
    {
        try {
            Log::info('🔍 [UserController] Obteniendo lista de usuarios');
            
            $query = User::where('is_active', true);
            
            // Filtrar por rol si se especifica
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }
            
            // Filtrar usuarios demo si se especifica
            if ($request->has('demo')) {
                // Para usuarios demo, excluir admin
                if ($request->demo === 'true') {
                    $query->where('role', '!=', 'admin');
                }
            }
            
            $users = $query->orderBy('name')->get();
            
            // Transformar datos para compatibilidad con frontend
            $transformedUsers = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'role' => $user->role,
                    'permissions' => $user->permissions ?? [],
                    'avatar' => $user->avatar ?? $this->generateAvatar($user->name),
                    'createdAt' => $user->created_at->toISOString(),
                    'lastLogin' => $user->last_login ? $user->last_login->toISOString() : '',
                    'isActive' => $user->is_active,
                    'demo' => $user->role !== 'admin', // Todos excepto admin son "demo" para el modal
                    'department' => $this->getDepartmentByRole($user->role),
                    'projects' => $this->getUserProjects($user),
                    'description' => $this->getRoleDescription($user->role),
                    'securityClearance' => $this->getSecurityClearance($user->role),
                    'specializations' => $this->getSpecializations($user->role)
                ];
            });
            
            Log::info('✅ [UserController] Usuarios obtenidos correctamente: ' . $users->count());
            
            return response()->json($transformedUsers);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error obteniendo usuarios: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error obteniendo usuarios',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get demo users for persona modal.
     * GET /api/v1/users/demo
     */
    public function demo()
    {
        try {
            Log::info('🔍 [UserController] Obteniendo usuarios demo para modal persona');
            
            $users = User::where('is_active', true)
                        ->where('role', '!=', 'admin')
                        ->orderBy('name')
                        ->get();
            
            $transformedUsers = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'role' => $user->role,
                    'permissions' => $user->permissions ?? [],
                    'avatar' => $user->avatar ?? $this->generateAvatar($user->name),
                    'createdAt' => $user->created_at->toISOString(),
                    'lastLogin' => $user->last_login ? $user->last_login->toISOString() : '',
                    'isActive' => $user->is_active,
                    'demo' => true,
                    'department' => $this->getDepartmentByRole($user->role),
                    'projects' => $this->getUserProjects($user),
                    'description' => $this->getRoleDescription($user->role),
                    'securityClearance' => $this->getSecurityClearance($user->role),
                    'specializations' => $this->getSpecializations($user->role)
                ];
            });
            
            Log::info('✅ [UserController] Usuarios demo obtenidos: ' . $users->count());
            
            return response()->json($transformedUsers);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error obteniendo usuarios demo: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error obteniendo usuarios demo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get admin user.
     * GET /api/v1/users/admin
     */
    public function admin()
    {
        try {
            Log::info('🔍 [UserController] Obteniendo usuario admin');
            
            $admin = User::where('role', 'admin')
                        ->where('is_active', true)
                        ->first();
            
            if (!$admin) {
                return response()->json([
                    'error' => 'Usuario admin no encontrado'
                ], 404);
            }
            
            $transformedAdmin = [
                'id' => $admin->id,
                'email' => $admin->email,
                'name' => $admin->name,
                'role' => $admin->role,
                'permissions' => $admin->permissions ?? [],
                'avatar' => $admin->avatar ?? $this->generateAvatar($admin->name),
                'createdAt' => $admin->created_at->toISOString(),
                'lastLogin' => $admin->last_login ? $admin->last_login->toISOString() : '',
                'isActive' => $admin->is_active,
                'demo' => false,
                'department' => 'Administración del Sistema',
                'projects' => ['Todos los proyectos'],
                'description' => 'Administrador con acceso completo al sistema',
                'securityClearance' => 'Level 5',
                'specializations' => ['System Administration', 'Full Access', 'User Management', 'Security Oversight']
            ];
            
            Log::info('✅ [UserController] Usuario admin obtenido: ' . $admin->name);
            
            return response()->json($transformedAdmin);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error obteniendo admin: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error obteniendo usuario admin',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created user.
     * POST /api/v1/users
     */
    public function store(Request $request)
    {
        try {
            Log::info('🔍 [UserController] Creando nuevo usuario');
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'role' => 'required|in:admin,project_manager,developer,security_analyst,stakeholder,ciso,compliance_officer,incident_responder',
                'permissions' => 'array',
                'avatar' => 'nullable|url'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'permissions' => $request->permissions ?? $this->getDefaultPermissions($request->role),
                'avatar' => $request->avatar ?? $this->generateAvatar($request->name),
                'is_active' => true
            ]);
            
            Log::info('✅ [UserController] Usuario creado: ' . $user->name);
            
            return response()->json([
                'message' => 'Usuario creado exitosamente',
                'user' => $user
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error creando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error creando usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user.
     * GET /api/v1/users/{id}
     */
    public function show(string $id)
    {
        try {
            Log::info('🔍 [UserController] Obteniendo usuario: ' . $id);
            
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no encontrado'
                ], 404);
            }
            
            Log::info('✅ [UserController] Usuario obtenido: ' . $user->name);
            
            return response()->json($user);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error obteniendo usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error obteniendo usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified user.
     * PUT /api/v1/users/{id}
     */
    public function update(Request $request, string $id)
    {
        try {
            Log::info('🔍 [UserController] Actualizando usuario: ' . $id);
            
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no encontrado'
                ], 404);
            }
            
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'role' => 'sometimes|in:admin,project_manager,developer,security_analyst,stakeholder,ciso,compliance_officer,incident_responder',
                'permissions' => 'sometimes|array',
                'avatar' => 'sometimes|nullable|url',
                'is_active' => 'sometimes|boolean'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Datos de validación incorrectos',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user->update($request->only([
                'name', 'email', 'role', 'permissions', 'avatar', 'is_active'
            ]));
            
            Log::info('✅ [UserController] Usuario actualizado: ' . $user->name);
            
            return response()->json([
                'message' => 'Usuario actualizado exitosamente',
                'user' => $user
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error actualizando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error actualizando usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user.
     * DELETE /api/v1/users/{id}
     */
    public function destroy(string $id)
    {
        try {
            Log::info('🔍 [UserController] Eliminando usuario: ' . $id);
            
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no encontrado'
                ], 404);
            }
            
            // Soft delete - marcar como inactivo en lugar de eliminar
            $user->update(['is_active' => false]);
            
            Log::info('✅ [UserController] Usuario desactivado: ' . $user->name);
            
            return response()->json([
                'message' => 'Usuario desactivado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error eliminando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error eliminando usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Switch to user (for persona modal).
     * POST /api/v1/users/{id}/switch
     */
    public function switchToUser(string $id)
    {
        try {
            Log::info('🔍 [UserController] Cambiando a usuario: ' . $id);
            
            $user = User::where('id', $id)
                       ->where('is_active', true)
                       ->first();
            
            if (!$user) {
                return response()->json([
                    'error' => 'Usuario no encontrado o inactivo'
                ], 404);
            }
            
            // Actualizar last_login
            $user->update(['last_login' => now()]);
            
            $transformedUser = [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'role' => $user->role,
                'permissions' => $user->permissions ?? [],
                'avatar' => $user->avatar ?? $this->generateAvatar($user->name),
                'createdAt' => $user->created_at->toISOString(),
                'lastLogin' => $user->last_login->toISOString(),
                'isActive' => $user->is_active,
                'demo' => $user->role !== 'admin',
                'department' => $this->getDepartmentByRole($user->role),
                'projects' => $this->getUserProjects($user),
                'description' => $this->getRoleDescription($user->role),
                'securityClearance' => $this->getSecurityClearance($user->role),
                'specializations' => $this->getSpecializations($user->role)
            ];
            
            Log::info('✅ [UserController] Cambiado a usuario: ' . $user->name);
            
            return response()->json($transformedUser);
            
        } catch (\Exception $e) {
            Log::error('❌ [UserController] Error cambiando usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error cambiando usuario',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Helper methods
    private function generateAvatar(string $name): string
    {
        $encodedName = urlencode($name);
        return "https://ui-avatars.com/api/?name={$encodedName}&background=0d2c5b&color=fff&size=128";
    }

    private function getDepartmentByRole(string $role): string
    {
        $departments = [
            'admin' => 'Administración del Sistema',
            'project_manager' => 'Tecnologías de la Información',
            'developer' => 'Desarrollo de Software',
            'security_analyst' => 'Ciberseguridad',
            'stakeholder' => 'Dirección Académica',
            'ciso' => 'Ciberseguridad',
            'compliance_officer' => 'Auditoría y Cumplimiento',
            'incident_responder' => 'Centro de Respuesta a Incidentes'
        ];
        
        return $departments[$role] ?? 'Departamento General';
    }

    private function getUserProjects(User $user): array
    {
        // TODO: Implementar relación con proyectos reales
        $projectsByRole = [
            'admin' => ['Todos los proyectos'],
            'project_manager' => ['UBO Insight MVP', 'Sistema de Ciberseguridad', 'Portal Institucional'],
            'developer' => ['UBO Insight MVP'],
            'security_analyst' => ['Sistema de Monitoreo de Seguridad', 'Auditorías de Seguridad'],
            'stakeholder' => ['Sistema de Gestión Académica', 'Portal Estudiantes'],
            'ciso' => ['Estrategia de Ciberseguridad 2024', 'Compliance ISO 27001', 'Plan de Continuidad de Negocio'],
            'compliance_officer' => ['Auditoría ISO 27001', 'Cumplimiento GDPR', 'Certificación SOX'],
            'incident_responder' => ['CERT-UBO', 'Plan de Respuesta a Incidentes', 'Forensia Digital']
        ];
        
        return $projectsByRole[$user->role] ?? [];
    }

    private function getRoleDescription(string $role): string
    {
        $descriptions = [
            'admin' => 'Administrador con acceso completo al sistema',
            'project_manager' => 'Jefe de Proyectos TI que administra múltiples proyectos y concede permisos a stakeholders',
            'developer' => 'Desarrollador Full-Stack especializado en CMS y gestión de vulnerabilidades',
            'security_analyst' => 'Analista de Ciberseguridad enfocada en monitoreo de amenazas y análisis de vulnerabilidades',
            'stakeholder' => 'Stakeholder enfocado en proyectos académicos y métricas básicas de ciberseguridad',
            'ciso' => 'Chief Information Security Officer - Responsable de la estrategia integral de ciberseguridad',
            'compliance_officer' => 'Oficial de Cumplimiento especializada en marcos normativos y auditorías de seguridad',
            'incident_responder' => 'Especialista en Respuesta a Incidentes y Análisis Forense Digital'
        ];
        
        return $descriptions[$role] ?? 'Usuario del sistema';
    }

    private function getSecurityClearance(string $role): string
    {
        $clearances = [
            'admin' => 'Level 5',
            'project_manager' => 'Level 3',
            'developer' => 'Level 2',
            'security_analyst' => 'Level 3',
            'stakeholder' => 'Level 1',
            'ciso' => 'Level 5',
            'compliance_officer' => 'Level 2',
            'incident_responder' => 'Level 4'
        ];
        
        return $clearances[$role] ?? 'Level 1';
    }

    private function getSpecializations(string $role): array
    {
        $specializations = [
            'admin' => ['System Administration', 'Full Access', 'User Management', 'Security Oversight'],
            'project_manager' => ['Project Management', 'Team Leadership', 'Risk Management', 'Incident Coordination'],
            'developer' => ['Full-Stack Development', 'Vulnerability Assessment', 'Secure Coding'],
            'security_analyst' => ['SOC Operations', 'Vulnerability Management', 'Incident Response'],
            'stakeholder' => ['Academic Management', 'Risk Overview', 'Compliance Reporting'],
            'ciso' => ['Risk Management', 'Compliance', 'Security Strategy', 'Executive Reporting'],
            'compliance_officer' => ['ISO 27001', 'NIST Framework', 'GDPR Compliance', 'Internal Audits'],
            'incident_responder' => ['Incident Response', 'Digital Forensics', 'Malware Analysis', 'Threat Hunting']
        ];
        
        return $specializations[$role] ?? [];
    }

    private function getDefaultPermissions(string $role): array
    {
        $permissions = [
            'admin' => ['ciberseguridad', 'proyectos', 'cms', 'datos', 'admin_access', 'user_management'],
            'project_manager' => ['proyectos', 'cms', 'datos', 'team_management', 'project_creation'],
            'developer' => ['cms', 'datos', 'vuln_access', 'technical_tools'],
            'security_analyst' => ['ciberseguridad', 'datos', 'soc_access', 'vuln_access', 'incident_access'],
            'stakeholder' => ['proyectos_readonly', 'compliance_access', 'basic_metrics'],
            'ciso' => ['ciberseguridad', 'proyectos', 'datos', 'compliance_access', 'risk_access', 'soc_access', 'executive_reports'],
            'compliance_officer' => ['compliance_access', 'datos', 'audit_reports'],
            'incident_responder' => ['ciberseguridad', 'incident_access', 'forensic_tools', 'emergency_response']
        ];
        
        return $permissions[$role] ?? [];
    }
}
