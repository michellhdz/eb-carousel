(function() {
    const script = document.currentScript;
    const clientId = script.getAttribute('data-client-id') || 'DEMO';
    const limit = script.getAttribute('data-limit') || 5;
    const env = script.getAttribute('data-env') || 'staging';
    const endpoint = "https://tiendacarre.com/eb-carousel/eb-proxy.php";
    
    // Crear contenedor
    const container = document.createElement('div');
    container.className = 'eb-container';
    script.parentNode.insertBefore(container, script.nextSibling);
    
    // Mostrar loader
    container.innerHTML = `
        <div class="eb-loading">
            <div class="eb-spinner"></div>
            <div>Cargando propiedades...</div>
        </div>
    `;
    
    // Cargar CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://michellhdz.github.io/eb-carousel/eb-carousel.min.css';
    document.head.appendChild(cssLink);
    
    // Obtener datos
    fetch(`${endpoint}?client_id=${clientId}&limit=${limit}&environment=${env}`)
        .then(async response => {
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Error al obtener datos');
            }
            
            renderProperties(data);
        })
        .catch(error => {
            showError(error);
            console.error('Error:', error);
        });
    
    function renderProperties(data) {
        if (!data.properties || data.properties.length === 0) {
            container.innerHTML = `
                <div class="eb-empty">
                    No hay propiedades disponibles
                    <small>Modo: ${data.environment === 'staging' ? 'Pruebas' : 'Producción'}</small>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="eb-carousel">
                ${data.properties.map(prop => `
                    <a href="${prop.url}" target="_blank" class="eb-property">
                        <div class="eb-image-container">
                            <img src="${prop.image}" alt="${prop.title}" class="eb-image">
                            ${data.environment === 'staging' ? '<div class="eb-badge">DEMO</div>' : ''}
                        </div>
                        <div class="eb-details">
                            <h3 class="eb-title">${prop.title}</h3>
                            <div class="eb-price">${prop.price}</div>
                            <div class="eb-size">${prop.size} m²</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    }
    
    function showError(error) {
        container.innerHTML = `
            <div class="eb-error">
                <div class="eb-error-icon">⚠️</div>
                <div>${error.message}</div>
                <button class="eb-retry" onclick="window.location.reload()">Reintentar</button>
            </div>
        `;
    }
})();
