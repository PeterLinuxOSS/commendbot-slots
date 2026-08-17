
import os 
slotid = 8 

value = os.popen("pm2 start /root/selfbots/check.py  --name jobs --interpreter python3").read(2000)
print(value)