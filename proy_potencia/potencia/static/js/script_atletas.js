document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('#datosAtletaModal form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const modalEl = document.getElementById('datosAtletaModal');
    const modal = bootstrap.Modal.getInstance(modalEl);

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
