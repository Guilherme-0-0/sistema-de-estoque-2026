// Funcionalidades da página de histórico
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const actionFilter = document.getElementById('actionFilter');
    
    // Configurar data inicial como 7 dias atrás
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    dateFrom.valueAsDate = sevenDaysAgo;
    dateTo.valueAsDate = new Date();

    // Debounce para busca
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFilters();
        }, 300);
    });

    // Event listeners para filtros de data
    dateFrom.addEventListener('change', applyFilters);
    dateTo.addEventListener('change', applyFilters);
    actionFilter.addEventListener('change', applyFilters);
});

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const actionFilter = document.getElementById('actionFilter');
    
    // Construir query string
    const params = new URLSearchParams({
        q: searchInput.value,
        from: dateFrom.value,
        to: dateTo.value,
        action: actionFilter.value
    });

    // Redirecionar com filtros
    window.location.href = `/historico?${params.toString()}`;
}

// Formatação de data para exibição
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Highlight da linha sob hover
document.querySelectorAll('.movement-row').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.transition = 'background-color 0.2s';
    });
});
