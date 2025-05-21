(function() {
    const script = document.currentScript;
    const config = {
        clientId: script.getAttribute('data-client-id') || 'DEMO',
        limit: script.getAttribute('data-limit') || 5,
        env: script.getAttribute('data-env') || 'production',
        filters: script.getAttribute('data-filters') || '',
        endpoint: "https://tiendacarre.com/eb-carousel/eb-proxy.php"
    };

    const container = document.createElement('div');
    container.className = 'eb-container';
    script.parentNode.insertBefore(container, script.nextSibling);

    container.innerHTML = `
        <div class="eb-loading">
            <div class="eb-spinner"></div>
            <div>Cargando propiedades...</div>
        </div>
    `;

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://michellhdz.github.io/eb-carousel/eb-carousel.min.css';
    document.head.appendChild(cssLink);

    fetchData();

    async function fetchData() {
        try {
            const url = `${config.endpoint}?client_id=${config.clientId}&limit=${config.limit}&environment=${config.env}&filters=${encodeURIComponent(config.filters)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.success) throw new Error(data.error || 'Error en la respuesta del servidor');

            renderCarousel(data);
        } catch (error) {
            showError(error.message);
            console.error('Error:', error);
        }
    }

    function renderCarousel(data) {
        if (!data.properties || data.properties.length === 0) {
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
                ${data.properties.map(prop => {
                    const imageUrl = prop.image && prop.image.startsWith('http') 
                        ? prop.image 
                        : 'https://via.placeholder.com/600x400?text=Sin+imagen';

                    const propertyUrl = prop.url && prop.url.startsWith('http') 
                        ? prop.url 
                        : '#';

                    return `
                        <a href="${propertyUrl}" target="_blank" class="eb-property">
                            <div class="eb-image-container">
                                <img src="${imageUrl}" alt="${prop.title}" loading="lazy" class="eb-image">
                            </div>
                            <div class="eb-details">
                                <h3 class="eb-title">${prop.title}</h3>
                                <div class="eb-price">${prop.price}</div>
                                ${prop.size ? `<div class="eb-size">${prop.size} m²</div>` : ''}
                            </div>
                        </a>
                    `;
                }).join('')}
            </div>
            ${data.all_properties_url ? `
                <div class="eb-view-all">
                    <a href="${data.all_properties_url}" class="eb-view-all-button" target="_blank">
                        Ver todas las propiedades
                    </a>
                </div>
            ` : ''}
        `;
    }

    function showError(message) {
        container.innerHTML = `
            <div class="eb-error">
                <div class="eb-error-icon">⚠️</div>
                <div>${message}</div>
                <button class="eb-retry" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
})();
