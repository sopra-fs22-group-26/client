/**
 * This helper function exports a task as ics file.
 */

import {convertDateToIcsDatestring} from "./dateFuncs";
import {saveAs} from "file-saver";

export const icsExport = (task) => {
    let dueDate = new Date(task.dueDate);
    let nextDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate() + 1);
    const taskEvent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        "DTSTART;VALUE=DATE:" + convertDateToIcsDatestring(dueDate),
        "DTEND;VALUE=DATE:" + convertDateToIcsDatestring(nextDay),
        "SUMMARY:" + task.title,
        "DESCRIPTION:" + task.description,
        (task.location ? "LOCATION:" + task.location : ""),
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");
    const fileName = task.title.replace(/([\\/:"*?<>|]+)/gi, '+') + ".ics";
    const blob = new Blob([taskEvent], { type: 'text/plain;charset=utf-8', });
    saveAs(blob, fileName);
}
