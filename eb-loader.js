(function() {
    const script = document.currentScript;
    const clientId = script.getAttribute('data-client-id') || 'DEMO';
    const limit = script.getAttribute('data-limit') || 6;
    const env = script.getAttribute('data-env') || 'staging';
    const endpoint = "https://tiendacarre.com/eb-carousel/eb-proxy.php";
    
    const container = document.createElement('div');
    container.className = 'eb-carousel-container';
    script.parentNode.insertBefore(container, script.nextSibling);
    
    // Mostrar estado de carga
    container.innerHTML = `
        <div class="eb-loading">
            <div class="eb-spinner"></div>
            Cargando propiedades...
        </div>
    `;
    
    // Cargar CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://michellhdz.github.io/eb-carousel/eb-carousel.min.css';
    document.head.appendChild(cssLink);
    
    // Obtener y mostrar propiedades
    fetch(`${endpoint}?client_id=${clientId}&limit=${limit}&environment=${env}`)
        .then(async response => {
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Error al obtener propiedades');
            }
            
            renderProperties(data.properties);
        })
        .catch(error => {
            showError(error.message);
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
                        <div class="eb-image-wrapper">
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
                <div class="eb-error-icon">!</div>
                <div>${message}</div>
                <button class="eb-retry" onclick="window.location.reload()">Reintentar</button>
            </div>
        `;
    }
})();
