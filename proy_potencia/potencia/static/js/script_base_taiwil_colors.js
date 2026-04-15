tailwind.config = {
    theme: {
        extend: {
            colors: {
                dark: '#0F172A',       /* Fondo general: Azul marino/pizarra muy profundo */
                card: '#1E293B',       /* Tarjetas: Pizarra más claro para generar separación */
                primary: '#34D399',    /* Acentos: Verde esmeralda claro (brilla sobre el oscuro) */
                primaryHover: '#10B981',
                accentLight: '#F8FAFC',/* Para textos principales muy claros y limpios */
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        }
    }
}