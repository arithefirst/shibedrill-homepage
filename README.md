# Shibedrill Homepage

A custom blog website made for [@shibedrill](https://github.com/shibedrill)

## Techstack

![img](https://go-skill-icons.vercel.app/api/icons?i=astro,daisyui,tailwind)

## Deploying locally

1. Clone this repository<br>
   `git clone https://github.com/arithefirst/shibedrill-homepage.git`
2. Install dependencies
   For this step, I like to use bun, but npm, yarn, pnpm, or any similar tool should work.
   `bun install`
3. Run the server
   - For preview mode:<br>
     - `bun run dev`
     - goto `http://localhost:4321` in a browser
   - For production<br>
     - `bun run build`
     - Copy all of the files from the new `dist` directory into the root of your http server's main directory. This is usually `/srv/http/` or `/var/www/html/`
     - goto `http://localhost` in a browser
