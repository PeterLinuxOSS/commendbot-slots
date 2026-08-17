# CommendBot — Slot Workers (Selfbot Automation)

Companion repository to [commendbot](https://github.com/PeterLinuxOSS/commendbot).
These are the worker processes that actually delivered commends for that
service: Node.js scripts built on `discord.js-selfbot-v13` that log in as a
real Discord **user** account and drive it programmatically.

## This automates a Discord user account

`discord.js-selfbot-v13` logs a normal user account in as if it were a bot.
**Automating a user account this way is prohibited by Discord's Terms of
Service** (ToS section on "Automated Client Access" / self-bots) and can get
the account terminated. This code is published as an archive of a retired
service, to document how the automation was structured — not as an
endorsement or invitation to run it against your own account. Do so at your
own risk and in violation of Discord's ToS.

## What it does

- `slot/` — the manager. Reads slot definitions from MongoDB
  (`commendbotstatus`), logs each one in as a selfbot, listens to the
  `slottrans` change stream from the main [commendbot](https://github.com/PeterLinuxOSS/commendbot)
  repo, and relays `~commend <steamID64> <amount>` / `~sessions kill` commands
  to an upstream in-game commend bot via DM. Progress messages from that bot
  are parsed back into MongoDB for the main bot to read.
- `template/` — a minimal single-account relay: forwards messages between a
  pair of channels and mirrors them to a Discord webhook.
- `tokenchecker/` — logs in with a given token just long enough to report
  whether the account has a phone number and MFA enabled, then logs out.

## Configuration

Real credentials were removed. `slot/config.example.json` shows the expected
shape; copy it to `slot/config.json` and fill in your own token, channel IDs
and webhook URLs (git-ignored). `slot/index.js` reads two additional values
from the environment:

- `MONGODB_URI` — same database the main commendbot repo uses
- `UPSTREAM_BOT_USER_ID` — Discord user ID of the commend bot being messaged

## License

MIT — see `LICENSE`.
