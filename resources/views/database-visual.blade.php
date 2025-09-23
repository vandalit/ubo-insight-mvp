<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UBO Insight MVP - Database Visual</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style>
        .bento-card {
            transition: all 0.3s ease;
            background: #1f2937;
            border: 1px solid #374151;
        }
        .bento-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
            border-color: #4b5563;
        }
        .primary-key {
            background: #fbbf24;
            color: #92400e;
        }
        .foreign-key {
            background: #3b82f6;
            color: #ffffff;
        }
        .regular-field {
            background: #6b7280;
            color: #f9fafb;
        }
        .table-header {
            background: #0d2c5b;
            color: #ffffff;
        }
        #network-container {
            height: 600px;
            border: 2px solid #374151;
            border-radius: 12px;
            background: #111827;
        }
        .loading-spinner {
            border: 4px solid #374151;
            border-top: 4px solid #f39c12;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-900 min-h-screen text-gray-100">
    <!-- Header -->
    <header class="bg-gray-800 shadow-sm border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-lg">🗄️</span>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-100">Database Visual</h1>
                        <p class="text-sm text-gray-400">UBO Insight MVP - Representación Visual de Base de Datos</p>
                    </div>
                </div>
                <a href="/" class="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors">
                    ← Volver al Status
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Controls -->
        <div class="mb-8 flex flex-wrap gap-4 items-center justify-between">
            <div class="flex flex-wrap gap-2">
                <button onclick="switchView('bento')" id="bento-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    🎨 Vista Bento
                </button>
                <button onclick="switchView('network')" id="network-btn" class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                    🕸️ Vista Red
                </button>
                <button onclick="refreshData()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    🔄 Actualizar
                </button>
            </div>
            <div class="text-sm text-gray-400">
                <span id="table-count">Cargando...</span> tablas encontradas
            </div>
        </div>

        <!-- Loading State -->
        <div id="loading" class="flex items-center justify-center py-12">
            <div class="text-center">
                <div class="loading-spinner mx-auto mb-4"></div>
                <p class="text-gray-400">Cargando estructura de base de datos...</p>
            </div>
        </div>

        <!-- Bento Grid View -->
        <div id="bento-view" class="hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="bento-container">
                <!-- Bento cards will be inserted here -->
            </div>
        </div>

        <!-- Network View -->
        <div id="network-view" class="hidden">
            <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 class="font-semibold text-blue-900 mb-2">Vista de Red Interactiva</h3>
                <p class="text-sm text-blue-700">Arrastra los nodos para reorganizar. Haz clic en una tabla para ver detalles. Las líneas representan relaciones de foreign keys.</p>
            </div>
            <div id="network-container"></div>
        </div>

        <!-- Error State -->
        <div id="error" class="hidden bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div class="text-red-600 mb-2">⚠️ Error cargando datos</div>
            <p class="text-red-700 text-sm" id="error-message"></p>
        </div>
    </main>

    <script>
        let currentView = 'bento';
        let databaseSchema = null;
        let network = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadDatabaseSchema();
        });

        // Switch between views
        function switchView(view) {
            currentView = view;
            
            // Update buttons
            document.getElementById('bento-btn').className = view === 'bento' 
                ? 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                : 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors';
            
            document.getElementById('network-btn').className = view === 'network' 
                ? 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                : 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors';

            // Show/hide views
            document.getElementById('bento-view').classList.toggle('hidden', view !== 'bento');
            document.getElementById('network-view').classList.toggle('hidden', view !== 'network');

            if (view === 'network' && databaseSchema) {
                setTimeout(() => createNetworkView(), 100);
            }
        }

        // Load database schema
        async function loadDatabaseSchema() {
            try {
                document.getElementById('loading').classList.remove('hidden');
                document.getElementById('error').classList.add('hidden');
                
                const response = await fetch('/database/schema');
                const data = await response.json();
                
                if (data.success) {
                    databaseSchema = data.schema;
                    document.getElementById('table-count').textContent = data.total_tables;
                    createBentoView();
                    document.getElementById('loading').classList.add('hidden');
                    document.getElementById('bento-view').classList.remove('hidden');
                } else {
                    throw new Error(data.error || 'Error desconocido');
                }
            } catch (error) {
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('error').classList.remove('hidden');
                document.getElementById('error-message').textContent = error.message;
            }
        }

        // Refresh data
        function refreshData() {
            loadDatabaseSchema();
        }

        // Create Bento Grid View
        function createBentoView() {
            const container = document.getElementById('bento-container');
            container.innerHTML = '';

            Object.entries(databaseSchema).forEach(([tableName, tableData]) => {
                const card = createBentoCard(tableName, tableData);
                container.appendChild(card);
            });
        }

        // Create individual Bento card
        function createBentoCard(tableName, tableData) {
            const card = document.createElement('div');
            card.className = 'bento-card rounded-xl p-6 border border-gray-200 shadow-sm';
            
            const foreignKeys = tableData.foreign_keys || [];
            const columns = tableData.columns || [];

            card.innerHTML = `
                <div class="table-header text-white p-3 rounded-lg mb-4">
                    <h3 class="font-bold text-lg">📋 ${tableName}</h3>
                    <p class="text-sm opacity-90">${columns.length} campos</p>
                </div>
                
                <div class="space-y-2 max-h-64 overflow-y-auto">
                    ${columns.map(column => {
                        let fieldClass = 'regular-field';
                        let icon = '📝';
                        
                        if (column.column_name === 'id' || column.column_name.endsWith('_id')) {
                            if (foreignKeys.some(fk => fk.column_name === column.column_name)) {
                                fieldClass = 'foreign-key';
                                icon = '🔗';
                            } else {
                                fieldClass = 'primary-key';
                                icon = '🔑';
                            }
                        }
                        
                        const nullable = column.is_nullable === 'YES' ? '?' : '!';
                        
                        return `
                            <div class="${fieldClass} px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between">
                                <span class="flex items-center">
                                    <span class="mr-2">${icon}</span>
                                    ${column.column_name}
                                </span>
                                <span class="opacity-75">${column.data_type}${nullable}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${foreignKeys.length > 0 ? `
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <h4 class="text-xs font-semibold text-gray-600 mb-2">🔗 Relaciones</h4>
                        <div class="space-y-1">
                            ${foreignKeys.map(fk => `
                                <div class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    ${fk.column_name} → ${fk.foreign_table_name}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            `;

            return card;
        }

        // Create Network View
        function createNetworkView() {
            if (!databaseSchema) return;

            const nodes = [];
            const edges = [];
            
            // Create nodes for each table
            Object.entries(databaseSchema).forEach(([tableName, tableData]) => {
                const columnCount = tableData.columns ? tableData.columns.length : 0;
                const fkCount = tableData.foreign_keys ? tableData.foreign_keys.length : 0;
                
                nodes.push({
                    id: tableName,
                    label: `📋 ${tableName}\n${columnCount} campos`,
                    shape: 'box',
                    color: {
                        background: fkCount > 0 ? '#dbeafe' : '#f3f4f6',
                        border: '#0d2c5b',
                        highlight: {
                            background: '#fbbf24',
                            border: '#f59e0b'
                        }
                    },
                    font: {
                        size: 12,
                        color: '#1f2937'
                    },
                    margin: 10,
                    widthConstraint: {
                        minimum: 120,
                        maximum: 200
                    }
                });
            });

            // Create edges for foreign key relationships
            Object.entries(databaseSchema).forEach(([tableName, tableData]) => {
                if (tableData.foreign_keys) {
                    tableData.foreign_keys.forEach(fk => {
                        edges.push({
                            from: tableName,
                            to: fk.foreign_table_name,
                            label: fk.column_name,
                            arrows: 'to',
                            color: {
                                color: '#3b82f6',
                                highlight: '#f59e0b'
                            },
                            font: {
                                size: 10,
                                color: '#1f2937'
                            }
                        });
                    });
                }
            });

            // Create network
            const container = document.getElementById('network-container');
            const data = { nodes: nodes, edges: edges };
            const options = {
                nodes: {
                    borderWidth: 2,
                    shadow: true
                },
                edges: {
                    width: 2,
                    shadow: true,
                    smooth: {
                        type: 'continuous'
                    }
                },
                physics: {
                    enabled: true,
                    stabilization: {
                        iterations: 100
                    },
                    barnesHut: {
                        gravitationalConstant: -2000,
                        centralGravity: 0.3,
                        springLength: 200,
                        springConstant: 0.05,
                        damping: 0.09
                    }
                },
                interaction: {
                    dragNodes: true,
                    dragView: true,
                    zoomView: true
                }
            };

            if (network) {
                network.destroy();
            }
            
            network = new vis.Network(container, data, options);

            // Add click event
            network.on('click', function(params) {
                if (params.nodes.length > 0) {
                    const tableName = params.nodes[0];
                    showTableDetails(tableName);
                }
            });
        }

        // Show table details in modal/alert
        function showTableDetails(tableName) {
            const tableData = databaseSchema[tableName];
            if (!tableData) return;

            const columns = tableData.columns || [];
            const foreignKeys = tableData.foreign_keys || [];

            let details = `📋 TABLA: ${tableName.toUpperCase()}\n\n`;
            details += `📊 CAMPOS (${columns.length}):\n`;
            details += columns.map(col => {
                const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
                return `  • ${col.column_name}: ${col.data_type} ${nullable}`;
            }).join('\n');

            if (foreignKeys.length > 0) {
                details += `\n\n🔗 RELACIONES (${foreignKeys.length}):\n`;
                details += foreignKeys.map(fk => 
                    `  • ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`
                ).join('\n');
            }

            alert(details);
        }
    </script>
</body>
</html>
