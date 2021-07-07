export const dateHoursFromNow = function (hours: number): Date {
    return new Date(Date.now() + (1000 * 60 * 60 * hours))
}

export const dateWeeksFromNow = function (weeks: number = 1): Date {
    return dateHoursFromNow(24 * 7 * weeks);
}

export const dateYearFromNow = function (): Date {
    return dateHoursFromNow(24 * 365);
}

export const oldestDatePossible = function (): Date {
    return (new Date(0));
}

export const timestampInSeconds = function (): number {
    let s = new Date().getTime() / 1000;
    return Math.round(s);
}

export const sleep = async function (ms: number) {

    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    })
}