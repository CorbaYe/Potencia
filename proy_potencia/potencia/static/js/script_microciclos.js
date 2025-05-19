// Array para almacenar los datos de los atletas
let atletasData = [];

// Función para cargar los datos del atleta seleccionado
function cargarDatosAtleta(atletaId) {
    const select = document.getElementById('athlete-select');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        // Actualizar los parámetros base con los datos del atleta
        document.getElementById('arrInput').value = selectedOption.dataset.arr;
        document.getElementById('envInput').value = selectedOption.dataset.env;
        document.getElementById('saInput').value = selectedOption.dataset.sa;
        document.getElementById('sxatInput').value = selectedOption.dataset.sxat;
        
        // Si ya hay macros generadas, actualizar los pesos base
        if (trainingData.macros.length > 0) {
            trainingData.macros.forEach(macro => {
                macro.dias.forEach(dia => {
                    dia.categorias.forEach(categoria => {
                        switch (categoria.tipo) {
                            case 'ARR':
                                categoria.pesoBase = parseInt(selectedOption.dataset.arr);
                                break;
                            case 'ENV':
                                categoria.pesoBase = parseInt(selectedOption.dataset.env);
                                break;
                            case 'SA':
                                categoria.pesoBase = parseInt(selectedOption.dataset.sa);
                                break;
                            case 'SXAT':
                                categoria.pesoBase = parseInt(selectedOption.dataset.sxat);
                                break;
                        }
                    });
                });
            });
            renderTable();
        }
    }
}

// Event listener para el cambio de selección de atleta
document.getElementById('athlete-select').addEventListener('change', function() {
    cargarDatosAtleta(this.value);
});

// Configuración inicial
const diasSemana = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES"];
let trainingData = {
    macros: []  // Array para almacenar las macros
};

// Variables para seguimiento de edición
let currentEditData = {
    macroIndex: null,
    dayIndex: null,
    category: null,
    rowIndex: null,
    percentageIndex: null,
    type: null
};

// Función para generar la estructura de días para una macro
function generarDias(cantidadDias) {
    const dias = [];
    for (let i = 0; i < cantidadDias; i++) {
        dias.push({
            numeroDia: i + 1,
            nombreDia: diasSemana[i % diasSemana.length], // Usar % para evitar desbordar el array
            categorias: [
                { tipo: "ARR", pesoBase: 100 },
                { tipo: "ENV", pesoBase: 120 },
                { tipo: "SA", pesoBase: 140 },
                { tipo: "SXAT", pesoBase: 180 }
            ],
            ejercicios: [
                {
                    tipo: "ARR",
                    rows: [
                        {
                            sec: 1, cog: 5, forma: "50%",
                            porcentajes: [
                                { porcentaje: 60, s: 3, r: 5 },
                                { porcentaje: 70, s: 2, r: 3 },
                                { porcentaje: 75, s: 1, r: 0 },
                                { porcentaje: 80, s: 1, r: 0 },
                                { porcentaje: 85, s: 1, r: 0 },
                                { porcentaje: 90, s: 1, r: 0 },
                                { porcentaje: 100, s: 1, r: 0 }
                            ]
                        }
                    ]
                },
                {
                    tipo: "ENV",
                    rows: [
                        {
                            sec: 1, cog: 2, forma: "",
                            porcentajes: [
                                { porcentaje: 60, s: 2, r: 3 },
                                { porcentaje: 70, s: 2, r: 2 },
                                { porcentaje: 75, s: 1, r: 0 },
                                { porcentaje: 80, s: 1, r: 0 },
                                { porcentaje: 85, s: 4, r: 2 },
                                { porcentaje: 90, s: 1, r: 0 },
                                { porcentaje: 100, s: 1, r: 0 }
                            ]
                        }
                    ]
                },
                {
                    tipo: "SA",
                    rows: [
                        {
                            sec: 1, cog: 50, forma: "2A 2C",
                            porcentajes: [
                                { porcentaje: 60, s: 3, r: 2 },
                                { porcentaje: 70, s: 3, r: 2 },
                                { porcentaje: 75, s: 1, r: 0 },
                                { porcentaje: 80, s: 2, r: 3 },
                                { porcentaje: 85, s: 1, r: 0 },
                                { porcentaje: 90, s: 1, r: 0 },
                                { porcentaje: 100, s: 1, r: 0 }
                            ]
                        }
                    ]
                },
                {
                    tipo: "SXAT",
                    rows: [
                        {
                            sec: 1, cog: 60, forma: "Completo",
                            porcentajes: [
                                { porcentaje: 60, s: 6, r: 2 },
                                { porcentaje: 70, s: 3, r: 2 },
                                { porcentaje: 75, s: 3, r: 2 },
                                { porcentaje: 80, s: 2, r: 2 },
                                { porcentaje: 85, s: 1, r: 0 },
                                { porcentaje: 90, s: 1, r: 0 },
                                { porcentaje: 100, s: 1, r: 0 }
                            ]
                        }
                    ]
                }
            ],
            pfg: {
                trote: "5 MIN",
                saltos: 15,
                salidas: 4,
                totalRep: 76
            }
        });
    }
    return dias;
}

function calcularKgs(base, porcentaje) {
    return (base * (porcentaje / 100)).toFixed(1);
}

function calcularTotal(row) {
    return row.porcentajes.reduce((acc, curr) => acc + (curr.s || 0) * (curr.r || 0), 0);
}

function renderTable() {
    const container = document.getElementById('training-plan');
    container.innerHTML = '';

    trainingData.macros.forEach((macro, macroIndex) => {
        const macroSection = document.createElement('div');
        macroSection.className = 'macro-section bg-light p-3 mb-4 border rounded shadow-sm';
        
        // Encabezado plegable de la macro
        const macroHeader = document.createElement('div');
        macroHeader.className = 'macro-header d-flex justify-content-between align-items-center';
        macroHeader.innerHTML = `
            <h3 class="mb-0">Macro ${macroIndex + 1}</h3>
            <i class="bi bi-chevron-down"></i>
        `;
        macroHeader.addEventListener('click', () => {
            macroSection.classList.toggle('expanded');
        });
        macroSection.appendChild(macroHeader);

        const macroContent = document.createElement('div');
        macroContent.className = 'macro-content p-3';

        macro.dias.forEach((dia, dayIndex) => {
            const section = document.createElement('div');
            section.className = 'day-section bg-white p-3 mb-3';

            // Encabezado plegable del día
            const header = document.createElement('div');
            header.className = 'day-header d-flex justify-content-between mb-3 border-bottom pb-2';
            header.innerHTML = `
                <div>
                    <span class="fw-bold">Día ${dia.numeroDia}</span>
                    <span class="text-muted ms-2">${dia.nombreDia}</span>
                    ${dia.categorias.map(cat => `
                        <span class="badge bg-secondary ms-1">${cat.tipo}: ${cat.pesoBase}kg</span>
                    `).join('')}
                </div>
                <div class="text-muted small">${dia.pfg.trote} • ${dia.pfg.saltos} saltos</div>
            `;
            header.addEventListener('click', () => {
                section.classList.toggle('expanded');
            });
            section.appendChild(header);

            const content = document.createElement('div');
            content.className = 'day-content';

            // Tablas por categoría
            dia.ejercicios.forEach(ejercicio => {
                const categoria = dia.categorias.find(c => c.tipo === ejercicio.tipo);

                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'mb-4';

                categoryDiv.innerHTML = `
                    <div class="category-header p-2 mb-2 small fw-bold">
                        ${ejercicio.tipo} - Base: ${categoria.pesoBase}kg
                    </div>
                `;

                const table = document.createElement('table');
                table.className = 'exercise-table table table-bordered align-middle mb-2';

                table.innerHTML = `
                    <thead>
                        <tr class="small">
                            <th style="width: 5%">Sec</th>
                            <th style="width: 5%">Cog</th>
                            <th style="width: 10%">Forma</th>
                            ${[60, 70, 75, 80, 85, 90, 100].map(p => `
                                <th class="exercise-column">
                                    ${p}%<br>
                                    <small>${calcularKgs(categoria.pesoBase, p)}kg</small>
                                </th>
                            `).join('')}
                            <th style="width: 5%">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ejercicio.rows.map((row, rowIndex) => `
                            <tr>
                                <td class="editable-cell" data-type="sec" data-macro="${macroIndex}" data-day="${dayIndex}" data-category="${ejercicio.tipo}" data-row="${rowIndex}">${row.sec}</td>
                                <td class="editable-cell" data-type="cog" data-macro="${macroIndex}" data-day="${dayIndex}" data-category="${ejercicio.tipo}" data-row="${rowIndex}">${row.cog}</td>
                                <td class="editable-cell" data-type="forma" data-macro="${macroIndex}" data-day="${dayIndex}" data-category="${ejercicio.tipo}" data-row="${rowIndex}">${row.forma}</td>
                                ${row.porcentajes.map((p, pIndex) => `
                                    <td class="small ${p.s ? 'editable-cell' : 'falso-cell'}"
                                        data-macro="${macroIndex}"
                                        data-day="${dayIndex}"
                                        data-category="${ejercicio.tipo}"
                                        data-row="${rowIndex}"
                                        data-percentage="${pIndex}">
                                        ${p.s ? `
                                            <div class="d-flex justify-content-between">
                                                <span>${calcularKgs(categoria.pesoBase, p.porcentaje)}</span>
                                                <div>${p.s}/${p.r}</div>
                                            </div>
                                        ` : '<i class="bi bi-x-circle"></i>'}
                                    </td>
                                `).join('')}
                                <td class="total-cell text-center">
                                    ${calcularTotal(row)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;

                categoryDiv.appendChild(table);
                content.appendChild(categoryDiv);
            });

            // Ejercicios auxiliares
            const auxDiv = document.createElement('div');
            auxDiv.className = 'border-top pt-2 small';
            auxDiv.innerHTML = `
                <div class="fw-bold">Salidas de velocidad: ${dia.pfg.salidas}</div>
                <div class="fw-bold text-end">Total repeticiones: ${dia.pfg.totalRep}</div>
            `;
            content.appendChild(auxDiv);

            section.appendChild(content);
            macroContent.appendChild(section);
        });
        
        macroSection.appendChild(macroContent);
        container.appendChild(macroSection);
    });

    // Habilitar botón de edición
    document.getElementById('editButton').disabled = false;

    // Asignar eventos a las celdas editables
    document.querySelectorAll('.editable-cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Expandir la primera macro y su primer día por defecto
    if (trainingData.macros.length > 0) {
        const firstMacroSection = container.querySelector('.macro-section');
        if (firstMacroSection) {
            firstMacroSection.classList.add('expanded');
            
            if (trainingData.macros[0].dias.length > 0) {
                const firstDaySection = firstMacroSection.querySelector('.day-section');
                if (firstDaySection) {
                    firstDaySection.classList.add('expanded');
                }
            }
        }
    }
}

function handleCellClick(e) {
    const cell = e.currentTarget;
    const macroIndex = parseInt(cell.dataset.macro);
    const dayIndex = parseInt(cell.dataset.day);
    const category = cell.dataset.category;
    const rowIndex = parseInt(cell.dataset.row);
    const percentageIndex = cell.dataset.percentage ? parseInt(cell.dataset.percentage) : null;
    const type = cell.dataset.type;

    currentEditData = {
        macroIndex,
        dayIndex,
        category,
        rowIndex,
        percentageIndex,
        type
    };

    const macro = trainingData.macros[macroIndex];
    const dia = macro.dias[dayIndex];
    const ejercicio = dia.ejercicios.find(e => e.tipo === category);
    const row = ejercicio.rows[rowIndex];

    // Configurar modal de edición
    document.getElementById('editMacroIndex').value = macroIndex;
    document.getElementById('editDayIndex').value = dayIndex;
    document.getElementById('editCategory').value = category;
    document.getElementById('editRowIndex').value = rowIndex;
    document.getElementById('editPercentageIndex').value = percentageIndex !== null ? percentageIndex : '';

    document.getElementById('editDayDisplay').textContent = `Macro ${macroIndex + 1}, Día ${dia.nombreDia} (Día ${dia.numeroDia})`;
    document.getElementById('editCategoryDisplay').textContent = category;

    if (type === 'sec' || type === 'cog' || type === 'forma') {
        // Edición de datos básicos
        document.getElementById('editPercentageDisplay').textContent = 'N/A';
        document.getElementById('editSec').value = row.sec;
        document.getElementById('editCog').value = row.cog;
        document.getElementById('editForma').value = row.forma;
        document.getElementById('editS').value = '';
        document.getElementById('editR').value = '';
    } else {
        // Edición de porcentaje
        const categoria = dia.categorias.find(c => c.tipo === category);
        const percentageData = row.porcentajes[percentageIndex];
        const percentage = percentageData.porcentaje;

        document.getElementById('editPercentageDisplay').textContent = `${percentage}% (${calcularKgs(categoria.pesoBase, percentage)}kg)`;
        document.getElementById('editSec').value = row.sec;
        document.getElementById('editCog').value = row.cog;
        document.getElementById('editForma').value = row.forma;
        document.getElementById('editS').value = percentageData.s || '';
        document.getElementById('editR').value = percentageData.r || '';
    }

    // Mostrar modal
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

// Event Listeners
document.getElementById('macroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const cantidadMacros = parseInt(document.getElementById('macroInput').value);
    const cantidadDias = parseInt(document.getElementById('daysInput').value);

    trainingData.macros = []; // Limpiar macros existentes
    for (let i = 0; i < cantidadMacros; i++) {
        trainingData.macros.push({
            numeroMacro: i + 1,
            dias: generarDias(cantidadDias)
        });
    }
    renderTable();
    bootstrap.Modal.getInstance(document.getElementById('macroModal')).hide();
});

document.getElementById('parametersForm').addEventListener('submit', function(e) {
    e.preventDefault();

    trainingData.macros.forEach(macro => {
        macro.dias.forEach(dia => {
            dia.categorias.forEach(categoria => {
                switch (categoria.tipo) {
                    case 'ARR':
                        categoria.pesoBase = parseInt(document.getElementById('arrInput').value);
                        break;
                    case 'ENV':
                        categoria.pesoBase = parseInt(document.getElementById('envInput').value);
                        break;
                    case 'SA':
                        categoria.pesoBase = parseInt(document.getElementById('saInput').value);
                        break;
                    case 'SXAT':
                        categoria.pesoBase = parseInt(document.getElementById('sxatInput').value);
                        break;
                }
            });
        });
    });

    renderTable();
    bootstrap.Modal.getInstance(document.getElementById('paramsModal')).hide();
});

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const macroIndex = parseInt(document.getElementById('editMacroIndex').value);
    const dayIndex = parseInt(document.getElementById('editDayIndex').value);
    const category = document.getElementById('editCategory').value;
    const rowIndex = parseInt(document.getElementById('editRowIndex').value);
    const percentageIndex = document.getElementById('editPercentageIndex').value !== ''
        ? parseInt(document.getElementById('editPercentageIndex').value)
        : null;

    const macro = trainingData.macros[macroIndex];
    const dia = macro.dias[dayIndex];
    const ejercicio = dia.ejercicios.find(e => e.tipo === category);
    const row = ejercicio.rows[rowIndex];

     if (currentEditData.type === 'sec' || currentEditData.type === 'cog' || currentEditData.type === 'forma') {
        // Actualizar datos básicos
        row.sec = document.getElementById('editSec').value;
        row.cog = document.getElementById('editCog').value;
        row.forma = document.getElementById('editForma').value;
    } else {
        // Actualizar datos de porcentaje
        const sValue = document.getElementById('editS').value;
        const rValue = document.getElementById('editR').value;

        row.porcentajes[percentageIndex].s = sValue !== '' ? parseInt(sValue) : null;
        row.porcentajes[percentageIndex].r = rValue !== '' ? parseInt(rValue) : null;

        // Recalcular total de repeticiones del día
        dia.pfg.totalRep = dia.ejercicios.reduce((total, ejercicio) => {
            return total + ejercicio.rows.reduce((rowTotal, row) => {
                return rowTotal + calcularTotal(row);
            }, 0);
        }, 0);
    }

    renderTable();
    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
});

document.getElementById('clearButton').addEventListener('click', function() {
     if (currentEditData.type === 'sec' || currentEditData.type === 'cog' || currentEditData.type === 'forma') {
        return;
    }

    const macroIndex = parseInt(document.getElementById('editMacroIndex').value);
    const dayIndex = parseInt(document.getElementById('editDayIndex').value);
    const category = document.getElementById('editCategory').value;
    const rowIndex = parseInt(document.getElementById('editRowIndex').value);
    const percentageIndex = parseInt(document.getElementById('editPercentageIndex').value);

    const macro = trainingData.macros[macroIndex];
    const dia = macro.dias[dayIndex];
    const ejercicio = dia.ejercicios.find(e => e.tipo === category);
    const row = ejercicio.rows[rowIndex];

    row.porcentajes[percentageIndex].s = null;
    row.porcentajes[percentageIndex].r = null;

    // Recalcular total de repeticiones del día
    dia.pfg.totalRep = dia.ejercicios.reduce((total, ejercicio) => {
        return total + ejercicio.rows.reduce((rowTotal, row) => {
            return rowTotal + calcularTotal(row);
        }, 0);
    }, 0);

    renderTable();
    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
});




// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    let cantMicrociclos = parseInt(params.get('cant_microciclos')) || 1;
    const numeroDiasParam = params.get('num_dias');
    diasPorSemana = JSON.parse(decodeURIComponent(numeroDiasParam));

    trainingData.macros = []
    for (let i = 0; i < cantMicrociclos; i++){

        const diasEnMacro = diasPorSemana[i % diasPorSemana.length] || 5;
        trainingData.macros.push({
            numeroMacro: i + 1,
            dias: generarDias(diasEnMacro)
        });
    }

    // Inicializar valores del modal de parámetros
    if (trainingData.macros.length > 0 && trainingData.macros[0].dias.length > 0) {
        document.getElementById('arrInput').value = trainingData.macros[0].dias[0].categorias.find(c => c.tipo === 'ARR').pesoBase;
        document.getElementById('envInput').value = trainingData.macros[0].dias[0].categorias.find(c => c.tipo === 'ENV').pesoBase;
        document.getElementById('saInput').value = trainingData.macros[0].dias[0].categorias.find(c => c.tipo === 'SA').pesoBase;
        document.getElementById('sxatInput').value = trainingData.macros[0].dias[0].categorias.find(c => c.tipo === 'SXAT').pesoBase;
    }

    renderTable();
});