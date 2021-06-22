export const dateHoursFromNow = function (hours: number): Date {
    return new Date(Date.now() + (1000 * 60 * 60 * hours))
}

export const dateYearFromNow = function (): Date {
    return dateHoursFromNow(24 * 365);
}

export const oldestDatePossible = function (): Date {
    return (new Date(0));
}

export const base64 = function (data: string) {
    return Buffer.from(data).toString('base64');
}