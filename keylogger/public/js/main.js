import { matches } from './data.js';
import { initKeylogger } from './keylogger.js';
import { initPaymentFormatting, handlePaymentSubmit } from './payment.js';
import { renderMatches, renderVenues, applyFilters, clearFilters } from './matches.js';
import { getSelectedSeats, getCurrentMatch } from './seats.js';
import { showSuccessModal } from './ui.js';

// Procesar pago delegando a payment.js
document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    handlePaymentSubmit(e, getSelectedSeats(), getCurrentMatch(), (totalAmount, email, cardName) => {
        window.closeModals();
        showSuccessModal(totalAmount, email, cardName, getCurrentMatch(), getSelectedSeats().length);
    });
});

// Event listeners para filtros
document.getElementById('btn-aplicar-filtros')?.addEventListener('click', applyFilters);
document.getElementById('btn-limpiar-filtros')?.addEventListener('click', clearFilters);

// Inicializar Front-End y Keylogger
renderMatches(matches);
renderVenues();
initKeylogger();
initPaymentFormatting();