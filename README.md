# Telegram web app Store bot

This project implements structured file access through the ability to organize files into folders. This project was implemented through the Telegram web app.

The project is written in Django Python on the backend and React on the frontend. Folder `drive_bot_web` is responsible for the backend, and folder `drive_bot_webui` is responsible for the frontend.

Verification and authorization via telegram InitData used in the project.


[@Save_Store_bot](https://t.me/save_store_bot) -- work example of this repository.

P.S. Files are not sent from the web app from some versions of Telegram desktop application (at least on MacOS). This is a bug/feature related to the Telegram application, since all deep links does not send start command by clicking.



## Development notes

The development of Telegram web applications has the following feature - to open a page in the [web app](https://core.telegram.org/bots/webapps), you need to specify a domain outside your local network. Also it is necessary to specify the HTTPS protocol for connect. This introduces difficulties for local development. 

The easiest way for local development seems to be to use a reverse proxy to connect the local environment. You can use [Ngrok](https://ngrok.com/), for example. For convenient development, you will need to use 2 domains, although you can configure local development to work through 1 domain. In case of development with 2 domains ([instruction](https://ngrok.com/docs/secure-tunnels/ngrok-agent/reference/config/)), you need to configure one domain to the backend with proxying requests to port 8000, and the second to the frontend with proxying requests to port 3000. Next, you need to specify these domains in the  `./drive_bot_webui/config.js -> serverURL` and `./drive_bot_web/.env -> FRONTEND_URL`.


For convenient development you could use [Debug Mode for Mini Apps](https://core.telegram.org/bots/webapps#debug-mode-for-mini-apps).


More detailed instructions for deploying the backend and frontend in the corresponding folders.
 

