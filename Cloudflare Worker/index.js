let Password = "CHANGE_THIS_PASSWORD_321!"
export default {
    async fetch(request, env, ctx) {
        let body = request.method === "POST" ? await request.json() : {};
        switch(request.url.split(".dev/")[1].split("/")[0]){
            case "upload":
                if(body.auth !== Password) return new Response('Hello World.')
                await env.ICS.put("file", body.file)
                return new Response('Success.')
            default:{
                if(request.url.endsWith("data.ics")) return new Response(await env.ICS.get("file"))
            }
        }
        return new Response('Hello World!');
    }};