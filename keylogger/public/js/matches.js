import { matches, venues } from './data.js';

// Renderizar partidos
export function renderMatches(filteredMatches) {
    const container = document.getElementById('matches-container');
    if (!container) return;
    container.innerHTML = '';
    
    filteredMatches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl transition-all group match-card';
        matchCard.setAttribute('data-pais', match.pais);
        matchCard.setAttribute('data-fase', match.fase);
        matchCard.setAttribute('data-fecha', match.fecha.includes('JUN') ? 'junio' : 'julio');
        matchCard.setAttribute('data-categoria', match.categoria);
        
        
        matchCard.innerHTML = `
            <div class="relative h-40 overflow-hidden">
                <img src="${match.imagen}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Stadium" onerror="this.src='https://via.placeholder.com/400x200?text=Estadio'">
                <div class="absolute inset-0 stadium-gradient"></div>
                <div class="absolute bottom-3 left-3 text-white">
                    <span class="text-[8px] font-bold uppercase bg-[--fifa-red] px-2 py-1 rounded-full">${match.destacado}</span>
                    <p class="text-sm font-black italic uppercase leading-tight mt-1">${match.local} vs ${match.visitante}</p>
                </div>
            </div>
            <div class="p-4">
                <div class="flex items-center gap-2 mb-3 text-gray-500 text-[10px] font-bold uppercase">
                    <i class="fas fa-calendar"></i> ${match.fecha} | ${match.sede}
                </div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-2xl font-black text-black">$${match.precio.toLocaleString('es-MX')} <span class="text-[8px]">MXN</span></span>
                    <span class="bg-green-100 text-green-700 text-[8px] font-bold px-2 py-1 rounded-full">DISPONIBLE</span>
                </div>
                <button onclick="window.openSeatMap('${match.local} vs ${match.visitante}', ${match.precio}, '${match.sede.replace(/'/g, "\\'")}')"
                    class="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all">SELECCIONAR</button>
            </div>
        `;
        container.appendChild(matchCard);
    });
}

// Renderizar sedes
export function renderVenues() {
    const container = document.getElementById('venues-container');
    if (!container) return;
    container.innerHTML = '';
    
    venues.forEach(venue => {
        const venueDiv = document.createElement('div');
        venueDiv.className = 'group cursor-pointer';
        venueDiv.innerHTML = `
            <div class="relative rounded-2xl overflow-hidden shadow-lg h-48 group-hover:shadow-2xl transition-all duration-300">
                <img src="${venue.imagen}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${venue.city}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div class="absolute top-3 right-3">
                    <img src="https://flagcdn.com/w40/${venue.flag}.png" class="h-5 rounded shadow" alt="${venue.flag}">
                </div>
                <div class="absolute bottom-3 left-3 text-white">
                    <p class="font-black text-lg uppercase leading-tight">${venue.name}</p>
                    <p class="text-[10px] text-white/70 font-medium">${venue.city}</p>
                </div>
            </div>
        `;
        container.appendChild(venueDiv);
    });
}

// Función de filtrado
export function applyFilters() {
    const sedeFilter = document.getElementById('filter-sede').value;
    const faseFilter = document.getElementById('filter-fase').value;
    const fechaFilter = document.getElementById('filter-fecha').value;
    const categoriaFilter = document.getElementById('filter-categoria').value;
    
    let filtered = [...matches];
    
    if (sedeFilter !== 'all') filtered = filtered.filter(m => m.pais === sedeFilter);
    if (faseFilter !== 'all') filtered = filtered.filter(m => m.fase === faseFilter);
    if (fechaFilter !== 'all') {
        const [rangeStart, rangeEnd] = fechaFilter.split('-').map(Number);
        filtered = filtered.filter(m => {
            const day = parseInt(m.fecha);
            return day >= rangeStart && day <= rangeEnd;
        });
    }
    if (categoriaFilter !== 'all') filtered = filtered.filter(m => m.categoria === categoriaFilter);
    
    renderMatches(filtered);
}

// Función para limpiar filtros
export function clearFilters() {
    document.getElementById('filter-sede').value = 'all';
    document.getElementById('filter-fase').value = 'all';
    document.getElementById('filter-fecha').value = 'all';
    document.getElementById('filter-categoria').value = 'all';
    renderMatches(matches);
}