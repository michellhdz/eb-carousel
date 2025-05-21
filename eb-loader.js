(function() {
    const script = document.currentScript;
    const config = {
        clientId: script.getAttribute('data-client-id') || 'DEMO',
        limit: script.getAttribute('data-limit') || 5,
        env: script.getAttribute('data-env') || 'staging',
        filters: script.getAttribute('data-filters') || '',
        endpoint: "https://tiendacarre.com/eb-carousel/eb-proxy.php"
    };
    
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
    fetchData();
    
    async function fetchData() {
        try {
            const url = `${config.endpoint}?client_id=${config.clientId}&limit=${config.limit}&environment=${config.env}&filters=${encodeURIComponent(config.filters)}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Error en la respuesta del servidor');
            }
            
            renderProperties(data.properties);
            
        } catch (error) {
            showError(error.message);
            console.error('Error:', error);
        }
    }
    
    function renderProperties(properties) {
        if (!properties || properties.length === 0) {
            container.innerHTML = `
                <div class="eb-empty">
                    No hay propiedades disponibles
                    <small>Client ID: ${config.clientId}</small>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="eb-carousel">
                ${properties.map(prop => `
                    <a href="${prop.url}" target="_blank" class="eb-property">
                        <div class="eb-image-container">
                            ${prop.image ? 
                                `<img src="${prop.image}" alt="${prop.title}" loading="lazy">` : 
                                '<div class="eb-no-image">Sin imagen</div>'
                            }
                        </div>
                        <div class="eb-details">
                            <h3 class="eb-title">${prop.title}</h3>
                            <div class="eb-price">${prop.price}</div>
                            ${prop.size ? `<div class="eb-size">${prop.size} m²</div>` : ''}
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    }
    
    function showError(message) {
        container.innerHTML = `
            <div class="eb-error">
                <div class="eb-error-icon">⚠️</div>
                <div>${message}</div>
                <button class="eb-retry" onclick="fetchData()">Reintentar</button>
            </div>
        `;
    }
})();
