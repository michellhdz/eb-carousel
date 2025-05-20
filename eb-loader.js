// eb-loader.js - Versión con detección de entorno
(function() {
    // Configuración
    const PROD_ENDPOINT = "https://tudominio.com/eb-proxy.php";
    const DEV_ENDPOINT = "https://tudominio.com/eb-proxy.php?dev_mode=1"; // Alternativa
    
    const script = document.currentScript;
    const clientId = script.getAttribute('data-client-id');
    const limit = script.getAttribute('data-limit') || 5;
    const isDev = script.hasAttribute('data-dev-mode');
    
    // Seleccionar endpoint
    const endpoint = isDev ? 
        `${PROD_ENDPOINT}?client_id=demo&limit=${limit}` : 
        `${PROD_ENDPOINT}?client_id=${clientId}&limit=${limit}`;
    
    // Crear contenedor
    const container = document.createElement('div');
    container.className = 'eb-carousel';
    script.parentNode.insertBefore(container, script.nextSibling);
    
    // Cargar CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://cdn.jsdelivr.net/gh/tu-usuario/tu-repo@latest/eb-carousel.min.css';
    document.head.appendChild(cssLink);
    
    // Cargar propiedades
    fetch(endpoint)
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                container.innerHTML = `<div class="eb-error">
                    <p>${data.error}</p>
                    <small>Modo: ${data.environment || (isDev ? 'development' : 'production')}</small>
                </div>`;
                return;
            }
            
            container.innerHTML = data.length ? data.map(prop => `
                <div class="eb-property">
                    <img src="${prop.images?.[0] || 'https://via.placeholder.com/300x200?text=Propiedad'}" alt="${prop.title || ''}">
                    <div class="eb-info">
                        <h3>${prop.title || 'Propiedad disponible'}</h3>
                        <div class="eb-price">${prop.public_price || 'Consultar precio'}</div>
                        ${prop.location ? `<div class="eb-location">📍 ${prop.location}</div>` : ''}
                        <div class="eb-features">
                            ${prop.bedrooms ? `<span>🛏 ${prop.bedrooms}</span>` : ''}
                            ${prop.bathrooms ? `<span>🚿 ${prop.bathrooms}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('') : '<p class="eb-empty">No hay propiedades disponibles</p>';
        })
        .catch(e => {
            container.innerHTML = '<p class="eb-error">Error al cargar propiedades</p>';
            console.error('Error:', e);
        });
})();
