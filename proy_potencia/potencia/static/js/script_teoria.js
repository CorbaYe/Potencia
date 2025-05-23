document.addEventListener('DOMContentLoaded', () => {
    const glossary = [
        { term: "Arranque", definition: "Movimiento olímpico que implica levantar la barra desde el suelo hasta encima de la cabeza en un solo movimiento." },
        { term: "Envión", definition: "Movimiento olímpico en dos tiempos: primero la barra se lleva a los hombros y luego se impulsa por encima de la cabeza." },
        { term: "Mesociclo", definition: "Periodo de entrenamiento de varias semanas." },
        { term: "Tracción", definition: "Fase inicial del levantamiento donde se genera fuerza desde el suelo." },
        { term: "TUT", definition: "Tiempo bajo tensión, clave en hipertrofia." },
        { term: "RM", definition: "Repetición máxima, la mayor carga que se puede levantar una vez." },
        { term: "RPE", definition: "Percepción subjetiva del esfuerzo." },
        { term: "Prensión", definition: "Tipo de agarre o forma de sujetar la barra." }
    ];

    glossary.sort((a, b) => a.term.localeCompare(b.term));
    const container = document.getElementById('glossaryContainer');

    glossary.forEach(({ term, definition }) => {
        const card = document.createElement('div');
        card.className = 'glossary-card';
        card.innerHTML = `<strong>${term}</strong><p>${definition}</p>`;
        container.appendChild(card);
    });
});
