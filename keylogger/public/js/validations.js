// Funciones de validación para formularios de pago

export function validateEmail(email) {
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email);
}

export function validateCardNumber(number) {
    const cleanNumber = number.replace(/\s/g, '');
    return /^\d{16}$/.test(cleanNumber);
}

export function validateExpiryDate(expiry) {
    const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!re.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    return true;
}

export function validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

export function validateCardName(name) {
    return name.trim().length >= 5;
}