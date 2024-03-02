const getShifts = require("./util/UKG");
process.env.UKG_SCHEDULE_EVENT_URL = `${process.env.UKG_BASE}/${process.env.UKG_EVENT_ENDPOINT}`
const dayjs = require("dayjs");
const {createEvents} = require("ics");
async function updateSchedule(){
    const shifts = await getShifts()
    console.log(shifts)

    const changed = shifts.map(({startDateTime, endDateTime}) => {
        const start = dayjs(startDateTime).format("YYYY-M-D-H-m").split("-").map(Number)
        const end = dayjs(endDateTime).format("YYYY-M-D-H-m").split("-").map(Number)
        const shiftTime = (((end[3] * 100) + end[4]) -  ((start[3] * 100) + start[4])) / 100
        return {title: `Work Shift - ${shiftTime} Hours`, start, end, location: shiftTime >=6 ? "Bring a meal" : "Break only"}
    })
    const {value: icsData} = createEvents(changed)
    await fetch(process.env.CF_WORKER, {
        method: "POST",
        body: JSON.stringify({"file": icsData, "auth": process.env.PASSKEY})
    })
    console.log("Success")


}

updateSchedule();

setInterval(updateSchedule, 1*60*60*1000) // update the schedule every hour