<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://github.com/walkxcode/dashboard-icons/blob/main/png/jellyfin.png?raw=true" width="200" alt="Nest Logo" /></a>
</p>

  <br/>
  <h1 align="center">Jellyfin Discord Bot</h1>

  <p align="center">A simple <a href="https://discord.com" target="_blank">Discord</a> bot that enables you to broadcast<br/>your <a href="https://jellyfin.org/" target="_blank">Jellyfin Media Server</a> music collection to voice channels.<br/>It's Open Source and can easily be hosted by yourself!</p>

<p align="center">
  <small>Thank you <a href="https://github.com/manuel-rw/jellyfin-discord-music-bot/">manuel-rw</a> for forking this project.<br/>This is a fork of their fork and uses most of it's code.</small>
</p>



## ✨ Features

- Lightweight and extendable using the [Nest](https://github.com/nestjs/nest) framework
- Easy usage with Discord command system (eg. ``/play``, ``/pause``, ...)
- Fast and validated configuration using environment variables
- Typesafe code for quicker development and less bugs
- Supports ``Music``, ``Playlists`` and ``Albums`` from your Jellyfin instance

## 📌 About this project
This project is a fork of [manuel-rw's fork of ](https://github.com/manuel-rw/jellyfin-discord-music-bot) [KGT1's fork](https://github.com/KGT1/jellyfin-discord-music-bot/), adding functionality such as presence, defered messages, higher bitrate.

## ⛔ Limitations

- Bot does not support shards. This means, you cannot use it in multiple servers concurrently.
- Album covers are not visible, unless they are remote (eg. provided by external metadata provider)
- Streaming any video content in voice channels (See [this issue](https://github.com/discordjs/discord.js/issues/4116))

## 🚀 Installation

Please check out manuel-rw's Wiki section in his repository for installation instructions:

https://github.com/manuel-rw/jellyfin-discord-music-bot/wiki


## 💻 Development

Clone it, make your changes and create a pull request. Simple as that

## 👤 Credits

- https://tabler-icons.io/
- https://docs.nestjs.com/
- https://discord.js.org/
- https://github.com/fjodor-rybakov/discord-nestjs
- https://github.com/jellyfin/jellyfin-sdk-typescript
- https://jellyfin.org/
- https://github.com/KGT1/jellyfin-discord-music-bot
- https://gitmoji.dev/
- https://github.com/manuel-rw/jellyfin-discord-music-bot
