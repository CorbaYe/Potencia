function activarLinea() {
    const barra = document.getElementById('barraProgreso');
    barra.classList.add('activated');
    setTimeout(() => {
        barra.classList.remove('activated');
    }, 800);
}