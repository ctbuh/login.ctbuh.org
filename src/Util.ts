
export const dateHoursFromNow = function (hours: number): Date {
    return new Date(Date.now() + (1000 * 60 * 60 * hours))
}

export const dateYearFromNow = function (): Date {
    return dateHoursFromNow(24 * 365);
}

