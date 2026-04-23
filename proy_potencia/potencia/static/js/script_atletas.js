document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#datosAtletaModal form');

    const elementosReset = document.getElementsByName('nav-all-reset')
    const navAtletas = document.getElementById('nav-atletas')
    elementosReset[0].className = 'flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium transition-colors';
    elementosReset[1].className = 'flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium transition-colors';
    elementosReset[2].className = 'flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium transition-colors';
    elementosReset[3].className = 'flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-medium transition-colors';
    
    navAtletas.className = 'flex items-center gap-3 bg-primary/10 text-primary px-4 py-3 rounded-lg font-medium transition-colors border border-primary/20';

    if (!form) {
        console.warn('No se encontró el formulario del modal de atleta.');
        return;
    }

    const $modalEl = document.getElementById('datosAtletaModal');
    let modal;

    if (typeof Modal !== 'undefined') {
        modal = new Modal($modalEl);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
            
        })
            .then(response => {
                const ct = response.headers.get('content-type') || '';
                if (ct.includes('application/json')) {
                    return response.json().then(data => {
                        if (data.success) {
                            modal.hide();
                            window.location.reload();
                        } else {
                            alert('Error al guardar: ' + (data.error || 'Por favor verifica los datos'));
                        }
                    });
                }
                modal.hide();
                window.location.reload();
            })
            .catch(err => {
                console.error('Error al guardar:', err);
                alert('Ocurrió un error al guardar: ' + err.message);
            });
    });
});
