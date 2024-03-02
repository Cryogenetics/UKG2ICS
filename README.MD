# UKG Schedule to Calendar

# Disclaimer:
## I am not responsible for any issues / trouble you get into for using this tool, you are responsible for yourself and use this at your own risk.

simple app i made to convert my workplace's UKG shift entries into my calendar so i didnt have to put up with the garbage interface that likes to stop working
move example.env to .env and fill it out with your store/companies information

this requires a [Node.js runtime](https://nodejs.org)
Directions:
1. clone this repo
2. run `npm i`
3. Create a cloudflare worker following the directions in
[Cloudflare Worker](Cloudflare%20Worker)
4. after making the cloudflare worker, create a subscription in your calendar of choice, to https://YOURWORKERURL/data.ics,
and you should be done!
5. Optionally make it run on startup by doing the following:
- startup folder: 
```
%appdata%/Microsoft\Windows\Start Menu\Programs\Startup
```
- startupScript.bat
```bat
cd /Path/To/Folder
npm run start

```

If it doesn't work, i can't really help you, i attempted to make it as easy to modify for other companies as i could, but it's mostly for my usage.
