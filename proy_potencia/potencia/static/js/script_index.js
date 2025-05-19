// Activar tooltips
document.addEventListener("DOMContentLoaded", function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

// Ejemplo de mostrar el spinner cuando se hace clic
const btn = document.querySelector('.btn-potencia');
const spinner = document.getElementById('loading');
btn.addEventListener('click', () => {
    spinner.classList.remove('d-none');
});