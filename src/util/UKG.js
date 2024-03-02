let cookies=""
let xsrf = ""
let csrf = ""
const dayjs = require("dayjs")();
const yesterday = dayjs.add(-1, "day").format("YYYY-MM-DD");
const endDay = dayjs.subtract(1, "day").add(1, "month").format("YYYY-MM-DD");

module.exports = async function getSchedule() {
    const {authId} = await getAuthID(process.env.UKG_AUTH_URL)
    await Authenticate(process.env.UKG_AUTH_URL, authId)
    const {regularShifts: shifts} = await getScheduleObj(process.env.UKG_SCHEDULE_EVENT_URL);
    return shifts.map(({startDateTime, endDateTime}) => {
        return {startDateTime, endDateTime}
    })
}
async function getAuthID(url) {
    return await fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-api-version": "protocol=1.0,resource=2.1",
            "accept-language": "en-US",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Opera GX\";v=\"105\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-nosession": "true",
            "x-password": "anonymous",
            "x-requested-with": "XMLHttpRequest",
            "x-username": "anonymous",
            "Referer": process.env.UKG_LOGIN_URL,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "POST"
    }).then(e => {
        cookies = parseCookies(Array.from(e.headers.entries()));
            return e.json()
        }
    )
}
async function Authenticate(url, authId){
    return await fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-api-version": "protocol=1.0,resource=2.1",
            "accept-language": "en-US",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Opera GX\";v=\"105\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-nosession": "true",
            "x-password": "anonymous",
            "x-requested-with": "XMLHttpRequest",
            "x-username": "anonymous",
            "Referer": process.env.UKG_LOGIN_URL,
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "cookie": `VANITY_URL=${process.env.UKG_BASE}:443/wfd/home/tile/; ` + cookies
        },
        "body": JSON.stringify({
            authId,
            "callbacks": [
                {
                    type: "NameCallback",
                    output:[{name:"prompt",value:"Username"}],
                    input:[{name:"IDToken1",value:process.env.UKG_USER}],
                    _id:0
                },
                {
                    type:"PasswordCallback",
                    output:[{name:"prompt",value:"Password"}],
                    input:[{name:"IDToken2","value":process.env.UKG_PASS}],
                    _id:1
                }
            ]
        }),
        method: "POST"
    }).then(e => {
        // cookies = e.headers.get("set-cookie");
        cookies = parseCookies(Array.from(e.headers.entries()))

        // parseCookies(cookies);
        return e.json()
    }
)
}

async function getScheduleObj(URL){
    const headers ={
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-api-version": "protocol=1.0,resource=2.1",
        "accept-language": "en-US",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Opera GX\";v=\"105\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "device-type": "phone",
        "page": "ess",
        "x-nosession": "true",
        "x-password": "anonymous",
        "x-requested-with": "XMLHttpRequest",
        "x-username": "anonymous",
        "Referer": process.env.UKG_SCHEDULE_EVENT_URL,
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "cookie":  `VANITY_URL=${process.env.UKG_BASE}:443/wfd/home/tile/; ` + cookies
    }


    await fetch(`${process.env.UKG_BASE}/wfd/ess/myschedule`, {
        headers
    }).then(async e => {
        console.log(e.status)
        xsrf = e.headers.get("set-cookie").split("XSRF-TOKEN=")[1].split(";")[0]
        csrf = e.headers.get("set-cookie").split("_csrf=")[1].split(";")[0]
        headers["cookie"] += `; XSRF-TOKEN=${xsrf}; _csrf=${csrf}`
        headers["x-xsrf-token"] = xsrf
    })


    return await fetch(URL, {
        headers,
        method: "POST",
        body: JSON.stringify({data: {
                calendarConfigId: 3002003,
                includedEntities: [ 'entity.regularshift' ],
                includedCoverRequestsStatuses: [],
                includedSwapRequestsStatuses: [],
                includedTimeOffRequestsStatuses: [],
                includedOpenShiftRequestsStatuses: [],
                includedSelfScheduleRequestsStatuses: [],
                includedAvailabilityRequestsStatuses: [],
                includedAvailabilityPatternRequestsStatuses: [],
                dateSpan: { start: yesterday, end: endDay },
                showJobColoring: true,
                showOrgPathToDisplay: true,
                includeEmployeePreferences: true,
                includeNodeAddress: true,
                removeDuplicatedEntities: true
            }
        })
    }).then(e=>{
        console.log(e.status)
        return e.json()
    })
}

function parseCookies(cookieSet){
    return (cookieSet.filter(([k, v]) => k === "set-cookie").map(([k, v]) => v).reduce((prev, current, _, arr) => {
        return prev += current + "; "
    }, ""))
        .replaceAll("Secure; ", "")
        .replaceAll("path=/; ", "")
        .replaceAll("Path=/; ", "")
        .slice(0, -2)
}

