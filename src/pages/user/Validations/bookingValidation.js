export const flexValidation = (slots) => {
    const slotNumber = Number(slots);

    if (isNaN(slotNumber)) {
        return { isValid: false, message: 'You must input a number' };
    }

    if (slotNumber > 10) {
        return { isValid: false, message: 'You can only book a maximum of 10 slots each time' };
    }

    return { isValid: true, message: '' };
};