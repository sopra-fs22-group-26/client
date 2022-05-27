import {handleError} from "./api";

/**
 * This helper function checks whether a given date lies in the current week.
 * Returns true, if dateToCheck is in current week, false otherwise
 * @param dateToCheck {Date}
 * @returns {boolean}
 */
export const isInCurrentWeek = (dateToCheck) => {

    const weekLength = 604800000; // 7 * 24 * 60 * 60 * 1000 milliseconds

    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() - tempDate.getDay() + 1);
    tempDate.setHours(0,0,0,0);

    let lastMondayTimestamp = tempDate.getTime(); // time in milliseconds
    let nextMondayTimestamp = lastMondayTimestamp + weekLength;
    let dateToCheckTimestamp = dateToCheck.getTime();

    return (lastMondayTimestamp <= dateToCheckTimestamp && dateToCheckTimestamp < nextMondayTimestamp);
}

export const convertDateToIcsDatestring = (myDate) => {
    return [
        myDate.getFullYear(),
        myDate.getMonth() < 9 ? "0" : "",
        myDate.getMonth() + 1,
        myDate.getDate() < 10 ? "0" : "",
        myDate.getDate()
    ].join("");
}


/**
 * Notify user when dueDate is set on a national Holiday
 */
//Get calendar holidays
const api_url = "https://www.googleapis.com/calendar/v3/calendars/en.ch%23holiday%40group.v.calendar.google.com/events?key=AIzaSyDr53V_g_IctWuuNYyq10yiAqyJXWsIOU4";
async function fetchHolidays() {
    try {
        return await fetch(api_url).then((r) => {
            return r.json()
        });
    }
    catch(error) {
        console.error(`Could not fetch holidays: \n${handleError(error)}`);
    }
}
let holidays;
fetchHolidays().then(r => holidays = r);

// Check if date is a holiday
export function checkHoliday(date) {
    let errorMessage = null;
    for (const holiday of holidays.items) {
        if (holiday["start"]["date"] === date) {
            errorMessage = "Attention! This is a national holiday: " + holiday["summary"];
            return errorMessage;
        }
    }
}
