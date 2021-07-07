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

export const getItemsFromCommaList = function (str: string): Array<string> {

    let result = new Array<string>();

    result = str.split(',').filter(function (val: string) {
        return val.length > 0;
    });

    return result;
}

export const stringContainsAnyFromArray = function (str: string, substringArray: Array<string>): boolean {

    let contains = false;

    for (const sub of substringArray) {

        // substring cannot be empty
        if (sub.length && str.includes(sub)) {
            contains = true;
            break;
        }
    }

    return contains;
}