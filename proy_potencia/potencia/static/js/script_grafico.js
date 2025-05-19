// Recuperar y parsear los datos inyectados
const resultsData = JSON.parse(document.getElementById('results-data').textContent);
const aValue = resultsData.porcentaje_acumulacion || 0;
const tValue = resultsData.porcentaje_transformacion || 0;
const rValue = resultsData.porcentaje_realizacion || 0;
const cantidad_micriciclos = resultsData.num_weeks || 0;
const aReteticiones = resultsData.repet_acumulacion || 0;
const tRepeticiones = resultsData.repet_transformacion || 0;
const rRepeticiones = resultsData.repet_realizacion || 0;

const total_microciclos = [];
const total_microciclos_a = [];
const total_microciclos_t = [];
const total_microciclos_r = [];

// Fases de ATR
for (let i = 0; i < cantidad_micriciclos; i++) {
    let ciclo = (i + 1).toString();
    total_microciclos.push(ciclo);
}

function ciclos_periodos(){
    let rellenar_ciclos_a = (total_microciclos.length - aValue)
    let ceros_a = Array(rellenar_ciclos_a).fill(0)
    for (let i = 0; i < aValue; i++) {
        total_microciclos_a.push(i + 1);
    }
    total_microciclos_a.push(...ceros_a)

    let ceros_t_atras = Array(aValue).fill(0)
    let ceros_t_delante = Array(rValue).fill(0)
    total_microciclos_t.push(...ceros_t_atras);
    let ciclos_t = aValue + 1;
    for (let i = 0; i < tValue; i++) {
        total_microciclos_t.push(ciclos_t);
        ciclos_t += 1;
    }
    total_microciclos_t.push(...ceros_t_delante);

    let ceros_r = Array(aValue+tValue).fill(0)
    total_microciclos_r.push(...ceros_r);
    let ciclos_r = ciclos_t;
    for (let i = 0; i < rValue; i++) {
        total_microciclos_r.push(ciclos_r);
        ciclos_r += 1;
    }
}

ciclos_periodos()

new Chart(document.getElementById('ganttChart'), {
    type: 'bar',
    data: {
        labels: total_microciclos,
        datasets: [
        {
            label: 'Acumulación (A)',
            data: total_microciclos_a,
            backgroundColor: 'rgba(255,99,132,0.6)',
            stack: 'Fases'
        },
        {
            label: 'Transformación (T)',
            data: total_microciclos_t,
            backgroundColor: 'rgba(75,192,192,0.6)',
            stack: 'Fases'
        },
        {
            label: 'Realización (R)',
            data: total_microciclos_r,
            backgroundColor: 'rgba(54,162,235,0.6)',
            stack: 'Fases'
        }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: { x: { stacked: true }, y: { stacked: true } },
        plugins: { legend: { position: 'bottom' } }
    }
    });

////Volumen y % Técnico vs Fuerza + repeticiones
const porcentajeEjerciciosTecnicos = [];
const totalRepeticiones = [...aReteticiones,...tRepeticiones,...rRepeticiones];
function porcentajes_tecnico_fuerza(){
    let pctTecnico = []
    switch(cantidad_micriciclos){
        case 5: pctTecnico = [42,42,60,50,62];
            break;
        case 6: pctTecnico = [42,42,60,50,60,62];
            break;
        case 7: pctTecnico = [42,42,42,60,50,60,62];
            break;
        case 8: pctTecnico = [42,42,42,60,50,60,60,62];
            break;
        case 9: pctTecnico = [42,42,42,42,60,50,60,60,62];
            break;
        case 10: pctTecnico = [42,42,42,42,60,50,60,50,60,62];
            break;
        case 11: pctTecnico = [42,42,42,42,60,50,60,50,60,60,62];
            break;
        case 12: pctTecnico = [42,42,42,42,42,60,50,60,50,60,60,62];
            break;
        case 13: pctTecnico = [42,42,42,42,42,60,50,60,50,50,60,60,62];
            break;
        case 14: pctTecnico = [42,42,42,42,42,42,60,50,60,50,50,60,60,62,62];
            break;
        default: pctTecnico = [];
    }
    porcentajeEjerciciosTecnicos.push(...pctTecnico)
}
porcentajes_tecnico_fuerza()

const porcentajeEjerciciosFuerza = porcentajeEjerciciosTecnicos.map(v => 100 - v);
const repTec =  porcentajeEjerciciosTecnicos.map((v, i) => (totalRepeticiones[i] * v)/100);
const repFue =  porcentajeEjerciciosFuerza.map((v, i) => (totalRepeticiones[i] * v)/100);

new Chart(document.getElementById('volumeChart'), {
  type: 'bar', // Tipo principal del gráfico
  data: {
    labels: total_microciclos,
    datasets: [
      // Datasets de barras (stacked)
      {
        label: '% Ejercicios Técnico',
        data: porcentajeEjerciciosTecnicos,
        backgroundColor: 'rgba(255,206,86,0.6)',
        stack: 'Distribución'
      },
      {
        label: '% Ejercicios Fuerza',
        data: porcentajeEjerciciosFuerza,
        backgroundColor: 'rgba(153,102,255,0.6)',
        stack: 'Distribución'
      },
      // Datasets de líneas (deben estar separados)
      {
        label: 'Repeticiones totales',
        data: totalRepeticiones,
        borderColor: 'rgb(252, 255, 47)', // Cambiado a borderColor para líneas
        type: 'line',
        borderWidth: 4,
        fill: false,
        yAxisID: 'y1'
      },
      {
        label: 'Cantidad ejercicios Técnicas',
        data: repTec,
        borderColor: 'rgba(143, 253, 0, 0.6)', // Cambiado a borderColor
        type: 'line',
        borderWidth: 3,
        borderDash: [5,5],
        fill: false,
        yAxisID: 'y1'
      },
      {
        label: 'Cantidad ejercicios Fuerza',
        data: repFue,
        borderColor: 'rgba(38, 0, 255, 0.6)', // Cambiado a borderColor
        type: 'line',
        borderWidth: 3,
        tension: 0.3,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        stacked: true, 
        position: 'left', 
        title: { display: true, text: '% Distribución' } 
      },
      y1: { 
        position: 'right', 
        title: { display: true, text: 'Repeticiones' }, 
        grid: { drawOnChartArea: false } 
      }
    }
  }
});

// 3. Intensidad %1RM
const intensidad = {};

function porcentajes_intencidad(){
    let pctIntensidad = {}
    switch(cantidad_micriciclos){
        case 5: pctIntensidad = {
            arranque: [80,80, 85,85, 85],
            envion: [80,80, 90,100, 90],
            sentadillas: [80,85, 90,85, 90],
            halones: [80,85, 90,100, 90]
        }
            break;
        case 6: pctIntensidad = {
            arranque: [80,80, 85,85, 85,90],
            envion: [80,80, 90,100, 90,100],
            sentadillas: [80,85, 90,85, 90,90],
            halones: [80,85, 90,100, 90,100]
        }
            break;
        case 7: pctIntensidad = {
            arranque: [80,80,80, 85,85, 85,90],
            envion: [80,80,90, 90,100, 90,100],
            sentadillas: [80,85,85, 90,85, 90,90],
            halones: [80,85,90, 90,100, 90,100]
        }
            break;
        case 8: pctIntensidad = {
            arranque: [80,80,80, 85,85,85, 85,90],
            envion: [80,80,90, 90,100,90, 90,100],
            sentadillas: [80,85,85, 90,85,90, 90,90],
            halones: [80,85,90, 90,100,90, 90,100]
        }
            break;
        case 9: pctIntensidad = {
            arranque: [80,80,80,80, 85,85,85, 85,90],
            envion: [80,80,90,90,  90,100,90, 90,100],
            sentadillas: [80,85,85,85, 90,85,90, 90,90],
            halones: [80,85,90,90, 90,100,90, 90,100]
        }
            break;
        case 10: pctIntensidad = {
            arranque: [80,80,80,80, 85,85,85,85, 85,90],
            envion: [80,80,90,90,  90,100,90,90, 90,100],
            sentadillas: [80,85,85,85, 90,85,90,90, 90,90],
            halones: [80,85,90,90, 90,100,90,90, 90,100]
        }
            break;
        case 11: pctIntensidad = {
            arranque: [80,80,80,80, 85,85,85,85, 85,90,85],
            envion: [80,80,90,90,  90,100,90,90, 90,100,90],
            sentadillas: [80,85,85,85, 90,85,90,90, 90,90,90],
            halones: [80,85,90,90, 90,100,90,90, 90,100,90]
        }
            break;
        case 12: pctIntensidad = {
            arranque: [80,80,80,80,80, 85,85,85,85, 85,90,85],
            envion: [80,80,90,90,90,  90,100,90,90, 90,100,90],
            sentadillas: [80,85,85,85,85, 90,85,90,90, 90,90,90],
            halones: [80,85,90,90,90, 90,100,90,90, 90,100,90]
        }
            break;
        case 13: pctIntensidad = {
            arranque: [80,80,80,80,80, 85,85,85,85,85, 85,90,85],
            envion: [80,80,90,90,90,  90,100,90,90,100, 90,100,90],
            sentadillas: [80,85,85,85,85, 90,85,90,90,85, 90,90,90],
            halones: [80,85,90,90,90, 90,100,90,90,100, 90,100,90]
        }
            break;
        case 14: pctIntensidad = {
            arranque: [80,80,80,80,80,80, 85,85,85,85,85, 85,90,85],
            envion: [80,80,90,90,90,90,  90,100,90,90,100, 90,100,90],
            sentadillas: [80,85,85,85,85,85, 90,85,90,90,85, 90,90,90],
            halones: [80,85,90,90,90,90, 90,100,90,90,100, 90,100,90]
        }
            break;
        default: pctIntensidad = {}
    }
    Object.assign(intensidad, pctIntensidad)
}
porcentajes_intencidad()

new Chart(document.getElementById('intensityChart'), {
    type: 'line',
    data: {
        labels: total_microciclos,
        datasets: Object.keys(intensidad).map((key) => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            data: intensidad[key],
            tension: 0.7,
            fill: false
        }))
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 110, title: { display: true, text: '% 1RM' } } },
        plugins: { legend: { position: 'bottom' } }
    }
    });


function enviarMicrociclos() {
  const diasParam = Array.from(document.querySelectorAll('tbody tr[data-days]')).map(row => 
    parseInt(row.dataset.days)
  );
  const diasPorSemana = encodeURIComponent(JSON.stringify(diasParam));

  const numMicrociclos = resultsData.num_weeks;
  const url = `/microciclos?cant_microciclos=${numMicrociclos}&num_dias=${diasPorSemana}`;
  window.location.href = url;
}