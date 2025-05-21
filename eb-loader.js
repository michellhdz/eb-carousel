(function() {
    const script = document.currentScript;
    const clientId = script.getAttribute('data-client-id') || 'DEMO';
    const limit = script.getAttribute('data-limit') || 5;
    const env = script.getAttribute('data-env') || 'staging';
    const customFilters = script.getAttribute('data-filters') || '';
    const endpoint = "https://tudominio.com/eb-carousel/eb-proxy.php";
    
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
    cssLink.href = 'https://tudominio.com/eb-carousel/eb-carousel.min.css';
    document.head.appendChild(cssLink);
    
    // Obtener datos
    fetch(`${endpoint}?client_id=${clientId}&limit=${limit}&environment=${env}&filters=${encodeURIComponent(customFilters)}`)
        .then(async response => {
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Error en la respuesta del servidor');
            }
            
            renderProperties(data.properties);
        })
        .catch(error => {
            showError(error.message);
            console.error('Error:', error);
        });
    
    function renderProperties(properties) {
        if (!properties || properties.length === 0) {
            container.innerHTML = '<div class="eb-empty">No hay propiedades disponibles</div>';
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
                <button class="eb-retry" onclick="window.location.reload()">Reintentar</button>
            </div>
        `;
    }
})();
