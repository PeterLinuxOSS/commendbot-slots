import os, sys

# Original hardcoded a live Discord token on the command line.
token = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("DISCORD_SELFBOT_TOKEN", "")
if not token:
    sys.exit("usage: check.py <token>  (or set DISCORD_SELFBOT_TOKEN)")
print(os.popen(f"cd tokenchecker && node . --token={token}").read())
