export function buildInitialOrderFormState(user, selectedOptions = {}) {
    return {
        name: sanitizeNameInput(user?.name || ''),
        phone: normalizePhoneInput(user?.phone || ''),
        address: '',
        whatsapp: false,
        paymentMethod: 'CASH',
        comment: '',
        selectedOptions
    };
}

export function sanitizeNameInput(value) {
    return value
        .replace(/[^A-Za-zА-Яа-яЁё\s]/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/^\s+/, '');
}

export function normalizePhoneInput(value) {
    let digits = String(value || '').replace(/\D/g, '');

    if (!digits) {
        return '+7';
    }

    if (digits[0] === '8') {
        digits = `7${digits.slice(1)}`;
    } else if (digits[0] !== '7') {
        digits = `7${digits}`;
    }

    return `+${digits.slice(0, 11)}`;
}

export function formatPhoneDisplay(value) {
    const digits = String(value || '').replace(/\D/g, '');
    const national = digits.startsWith('7') ? digits.slice(1, 11) : digits.slice(0, 10);

    let formatted = '+7';

    if (national.length > 0) {
        formatted += ` (${national.slice(0, 3)}`;
    }

    if (national.length >= 4) {
        formatted += `) ${national.slice(3, 6)}`;
    }

    if (national.length >= 7) {
        formatted += `-${national.slice(6, 8)}`;
    }

    if (national.length >= 9) {
        formatted += `-${national.slice(8, 10)}`;
    }

    return formatted;
}

export function sanitizeQuantityInput(value) {
    const digits = String(value || '').replace(/\D/g, '').slice(0, 3);

    if (!digits) {
        return '';
    }

    return String(Math.min(parseInt(digits, 10), 100));
}

export function parseQuantity(value) {
    const parsed = parseInt(String(value || ''), 10);

    if (!Number.isInteger(parsed)) {
        return null;
    }

    return parsed;
}

export function parsePrice(value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }

    const normalized = String(value || '')
        .replace(',', '.')
        .replace(/[^\d.]/g, '');

    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}

export function formatPrice(value) {
    return `${Math.round(value || 0).toLocaleString('ru-RU')} ₽`;
}

export function validateOrderForm(values) {
    const errors = {};
    const normalizedName = values.name.trim();
    const normalizedAddress = values.address.trim();

    if (normalizedName.length < 2) {
        errors.name = 'Введите минимум 2 символа.';
    } else if (!/^[A-Za-zА-Яа-яЁё\s]+$/.test(normalizedName)) {
        errors.name = 'Допустимы только буквы и пробелы.';
    }

    if (!/^\+7\d{10}$/.test(values.phone)) {
        errors.phone = 'Введите номер в формате +7XXXXXXXXXX.';
    }

    if (normalizedAddress.length < 5) {
        errors.address = 'Укажите адрес не короче 5 символов.';
    }

    if (!values.paymentMethod) {
        errors.paymentMethod = 'Выберите способ оплаты.';
    }

    return errors;
}

export function hasRequiredOrderFields(values) {
    return Boolean(
        values.name.trim() &&
        values.phone &&
        values.address.trim() &&
        values.paymentMethod
    );
}
