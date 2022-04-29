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