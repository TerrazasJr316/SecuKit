import { stadiumSections } from './data.js';

// Variables locales de estado
let selectedSeats = [];
let currentPrice = 1450;
let currentMatch = "";

// Getters exportados para que main.js pueda acceder al estado actual
export const getSelectedSeats = () => selectedSeats;
export const getCurrentMatch = () => currentMatch;

// Funciones globales anexadas a 'window' para los onClick del HTML
window.toggleSection = function(element) {
    const sectionTier = element.closest('.section-tier');
    if(sectionTier) sectionTier.classList.toggle('expanded');
};

window.selectSeat = function(seatId, price, row, number, type) {
    const existingIndex = selectedSeats.findIndex(s => s.id === seatId);
    if(existingIndex !== -1) {
        selectedSeats.splice(existingIndex, 1);
    } else {
        selectedSeats.push({
            id: seatId,
            price: price,
            row: row,
            number: number,
            type: type,
            displayName: `${type.toUpperCase()} - Fila ${row}, Asiento ${number}`
        });
    }
    updateSeatSummary();
    renderStadiumSections();
};

window.selectSuite = function(suiteId, multiplier, suiteName) {
    const suitePrice = Math.round(currentPrice * multiplier);
    const existingIndex = selectedSeats.findIndex(s => s.id === suiteId);
    if(existingIndex !== -1) {
        selectedSeats.splice(existingIndex, 1);
    } else {
        selectedSeats.push({
            id: suiteId,
            price: suitePrice,
            name: suiteName,
            type: 'suite',
            displayName: `${suiteName} (Suite Ejecutiva)`
        });
    }
    updateSeatSummary();
    renderStadiumSections();
};

export function updateSeatSummary() {
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    
    const listContainer = document.getElementById('selected-seats-list');
    if(selectedSeats.length === 0) {
        listContainer.innerHTML = '<div class="text-sm text-gray-400">No hay asientos seleccionados</div>';
    } else {
        listContainer.innerHTML = selectedSeats.map(seat => {
            if(seat.type === 'suite') {
                return `<div class="flex justify-between text-sm py-2 border-b border-white/10">
                    <span><i class="fas fa-building text-purple-400 mr-2"></i>${seat.name}</span>
                    <span class="text-[--fifa-gold]">$${seat.price.toLocaleString('es-MX')}</span>
                </div>`;
            } else {
                return `<div class="flex justify-between text-sm py-2 border-b border-white/10">
                    <span><i class="fas fa-chair mr-2"></i>Fila ${seat.row} - Asiento ${seat.number}</span>
                    <span class="text-[--fifa-gold]">$${seat.price.toLocaleString('es-MX')}</span>
                </div>`;
            }
        }).join('');
    }
    
    document.getElementById('modal-total').innerHTML = `$${total.toLocaleString('es-MX')} MXN`;
    
    const paymentTotal = document.getElementById('payment-total');
    if(paymentTotal) paymentTotal.innerHTML = `$${total.toLocaleString('es-MX')} MXN`;
    
    const payBtn = document.getElementById('btn-pay');
    if(selectedSeats.length > 0) {
        payBtn.disabled = false;
        payBtn.classList.remove('bg-gray-600', 'text-gray-300');
        payBtn.classList.add('bg-[--fifa-red]', 'text-white');
    } else {
        payBtn.disabled = true;
        payBtn.classList.add('bg-gray-600', 'text-gray-300');
        payBtn.classList.remove('bg-[--fifa-red]', 'text-white');
    }
}

export function renderStadiumSections() {
    const container = document.getElementById('stadium-sections');
    if(!container) return;
    container.innerHTML = '';
    
    const sections = [
        { id: 'suites', name: 'SUITES EJECUTIVAS', icon: 'fa-building', type: 'suite', items: stadiumSections.suites.filter(s => s.available).length + ' disponibles' },
        { id: 'vip', name: 'PALCOS VIP', icon: 'fa-crown', type: 'vip', items: stadiumSections.vip.length + ' filas' },
        { id: 'premium', name: 'PREFERENTE', icon: 'fa-star', type: 'premium', items: stadiumSections.premium.length + ' filas' },
        { id: 'general', name: 'GENERAL', icon: 'fa-users', type: 'general', items: stadiumSections.general.length + ' filas' }
    ];

    sections.forEach(sec => {
        const div = document.createElement('div');
        div.className = 'section-tier';
        div.innerHTML = `
            <div class="tier-bar ${sec.type}" onclick="window.toggleSection(this)">
                <span><i class="fas ${sec.icon} mr-2"></i> ${sec.name}</span>
                <span class="flex items-center gap-2">
                    <span class="text-xs opacity-80">${sec.items}</span>
                    <i class="fas fa-chevron-down text-xs transition-transform"></i>
                </span>
            </div>
            <div class="tier-details">
                ${sec.id === 'suites' ? '<div id="suites-list"></div>' : `<div class="seat-grid-mini" id="${sec.id}-seats"></div>`}
            </div>
        `;
        container.appendChild(div);
    });
    
    const suitesList = document.getElementById('suites-list');
    if(suitesList) {
        stadiumSections.suites.filter(s => s.available).forEach(suite => {
            const isSelected = selectedSeats.some(s => s.id === suite.id);
            suitesList.innerHTML += `
                <div class="suite-card ${isSelected ? 'selected-suite' : ''}">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-bold text-white">${suite.name}</div>
                            <div class="text-xs text-gray-300">Capacidad: ${suite.capacity} personas</div>
                            <div class="text-xs text-[--fifa-gold]">$${(currentPrice * suite.priceMultiplier).toLocaleString('es-MX')} MXN / persona</div>
                        </div>
                        <button onclick="window.selectSuite('${suite.id}', ${suite.priceMultiplier}, '${suite.name}')" class="bg-[--fifa-red] text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700">
                            ${isSelected ? 'Quitar' : 'Seleccionar'}
                        </button>
                    </div>
                </div>`;
        });
    }
    
    renderSeatsInSection('vip-seats', stadiumSections.vip, 2.2, 'vip');
    renderSeatsInSection('premium-seats', stadiumSections.premium, 1.3, 'premium');
    renderSeatsInSection('general-seats', stadiumSections.general, 1.0, 'general');
}

function renderSeatsInSection(containerId, sectionData, multiplier, type) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    
    sectionData.forEach(rowData => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Etiqueta de fila
        const label = document.createElement('div');
        label.className = 'seat-row-label';
        label.textContent = rowData.row;
        rowDiv.appendChild(label);
        
        // Contenedor de asientos
        const seatsContainer = document.createElement('div');
        seatsContainer.className = 'seat-row-seats';
        
        for(let i = 1; i <= rowData.seats; i++) {
            const seatPrice = Math.round(currentPrice * multiplier);
            const seatId = `${type}_${rowData.row}${i}`;
            const isSelected = selectedSeats.some(s => s.id === seatId);
            const seatBtn = document.createElement('div');
            seatBtn.className = `mini-seat available ${isSelected ? 'selected' : ''}`;
            seatBtn.textContent = i;
            seatBtn.title = `Fila ${rowData.row} - Asiento ${i} | $${seatPrice.toLocaleString('es-MX')} MXN`;
            seatBtn.onclick = (function(sId, sPrice, sRow, sNum, sType) {
                return function() { window.selectSeat(sId, sPrice, sRow, sNum, sType); };
            })(seatId, seatPrice, rowData.row, i, type);
            seatsContainer.appendChild(seatBtn);
        }
        rowDiv.appendChild(seatsContainer);
        
        // Precio de referencia
        const priceLabel = document.createElement('div');
        priceLabel.className = 'text-[10px] text-white/40 font-medium w-16 text-right flex-shrink-0';
        priceLabel.textContent = `$${Math.round(currentPrice * multiplier).toLocaleString('es-MX')}`;
        rowDiv.appendChild(priceLabel);
        
        container.appendChild(rowDiv);
    });
}

// Mapeo de sede a imagen de asientos
const stadiumSeatImages = {
    'Estadio Banorte': '/src/azteca-asientos.jpg',
    'Akron': '/src/akron-asientos.jpg',
    'BBVA': '/src/bbva-asientos.jpg',
    'BMO Field': '/src/bmo-asientos.jpg',
    'BC Place Vancouver': '/src/bc-asientos.jpg',
    'SoFi Stadium': '/src/sofi-asientos.jpg',
    'MetLife Stadium': '/src/metlife-asientos.jpg',
    'Gillette Stadium': '/src/gillette-asientos.jpg',
    'AT&T Stadium': '/src/att-asientos.jpg',
    'Hard Rock Stadium': '/src/hard-asientos.jpg',
    'NRG Stadium': '/src/nrg-asientos.jpg',
    'Lincoln Financial Field': '/src/lincoln-asientos.jpg',
    'Levi\'s Stadium': '/src/levis-asientos.jpg',
    'Lumen Field': '/src/lumen-asientos.jpg',
    'Mercedes-Benz Stadium': '/src/mercedes-asientos.jpg',
    'Arrowhead Stadium': '/src/arrowhead-asientos.jpg',
};

window.openSeatMap = function(match, price, sede) {
    currentPrice = price;
    currentMatch = match;
    selectedSeats = [];
    
    document.getElementById('modal-title').innerText = match;
    document.getElementById('modal-match-name').innerText = match;
    document.getElementById('modal-price').innerHTML = `$${price.toLocaleString('es-MX')} MXN`;
    document.getElementById('modal-total').innerHTML = `$${price.toLocaleString('es-MX')} MXN`;
    
    // Cargar imagen de asientos del estadio correspondiente
    const stadiumImg = document.getElementById('stadium-img');
    const sedeLabel = document.getElementById('stadium-sede-label');
    if (stadiumImg) {
        stadiumImg.src = stadiumSeatImages[sede] || '/src/azteca-asientos.jpg';
        stadiumImg.alt = sede || 'Estadio';
    }
    if (sedeLabel) {
        sedeLabel.textContent = sede || 'Estadio';
    }
    
    renderStadiumSections();
    updateSeatSummary();
    document.getElementById('seat-modal').classList.remove('hidden');
};

window.openPayment = function() {
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const paymentTotal = document.getElementById('payment-total');
    if(paymentTotal) paymentTotal.innerHTML = `$${total.toLocaleString('es-MX')} MXN`;
    document.getElementById('payment-modal').classList.remove('hidden'); 
};

// Esta función es llamada desde el modal de éxito en ui.js
window.goBackToSelection = function() {
    window.closeModals();
    document.getElementById('entradas').scrollIntoView({ behavior: 'smooth' });
};