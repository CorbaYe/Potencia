document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#datosAtletaModal form');
    
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
