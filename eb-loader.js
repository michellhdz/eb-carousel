// https://michellhdz.github.io/eb-carousel/eb-loader.js
(function() {
    // Configuración
    const script = document.currentScript;
    const clientId = script.getAttribute('data-client-id') || 'DEMO';
    const limit = script.getAttribute('data-limit') || 5;
    const endpoint = "https://tiendacarre.com/eb-carousel/eb-proxy.php";
    
    // Crear contenedor
    const container = document.createElement('div');
    container.className = 'eb-container';
    script.parentNode.insertBefore(container, script.nextSibling);
    
    // Cargar CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://michellhdz.github.io/eb-carousel/eb-carousel.min.css';
    document.head.appendChild(cssLink);
    
    // Obtener y mostrar datos
    fetch(`${endpoint}?client_id=${clientId}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                container.innerHTML = `<div class="eb-error">${data.error}</div>`;
                return;
            }
            
            container.innerHTML = data.properties.map(prop => `
                <div class="eb-property">
                    <div class="eb-title">${prop.title}</div>
                    <div class="eb-price">${prop.price}</div>
                    <div class="eb-size">${prop.size} m²</div>
                </div>
            `).join('');
        })
        .catch(error => {
            container.innerHTML = '<div class="eb-error">Error cargando propiedades</div>';
            console.error(error);
        });
})();
