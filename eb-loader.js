(function() {
    const script = document.currentScript;
    const clientId = script.getAttribute('data-client-id') || 'DEMO';
    const limit = script.getAttribute('data-limit') || 5;
    const environment = script.getAttribute('data-env') || 'production';
    const endpoint = "https://tiendacarre.com/eb-carousel/eb-proxy.php";
    
    const container = document.createElement('div');
    container.className = 'eb-container';
    script.parentNode.insertBefore(container, script.nextSibling);
    
    // Mostrar loader
    container.innerHTML = `
        <div class="eb-loading">
            <div class="eb-spinner"></div>
            <div>Cargando propiedades...</div>
            <small>Entorno: ${environment === 'staging' ? 'Pruebas' : 'Producción'}</small>
        </div>
    `;
    
    // Cargar CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://michellhdz.github.io/eb-carousel/eb-carousel.min.css';
    document.head.appendChild(cssLink);
    
    // Obtener datos
    fetch(`${endpoint}?client_id=${clientId}&limit=${limit}&environment=${environment}`)
        .then(async response => {
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Error en la respuesta');
            }
            
            container.innerHTML = `
                <div class="eb-carousel">
                    ${data.properties.map(prop => `
                        <div class="eb-property">
                            <div class="eb-title">${prop.title || 'Propiedad'}</div>
                            <div class="eb-price">${prop.public_price || 'Consultar precio'}</div>
                            <div class="eb-size">${prop.construction_size || prop.lot_size || '--'} m²</div>
                            ${environment === 'staging' ? 
                              '<div class="eb-env-badge">DEMO</div>' : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="eb-env-info">
                    Entorno: ${data.environment === 'staging' ? 'Pruebas' : 'Producción'}
                </div>
            `;
        })
        .catch(error => {
            container.innerHTML = `
                <div class="eb-error">
                    <div class="eb-error-icon">⚠️</div>
                    <div>${error.message}</div>
                    <small>Client ID: ${clientId}</small>
                </div>
            `;
            console.error('Error:', error);
        });
})();
