#!/bin/bash

#Create logs directory if it doesnt exist yet
mkdir -p ./logs

#Create file name with name as date
date=$(date +%m-%d-%y)
filename="$date.txt"

# Add to log with timestamp
time=$(date +%H:%M:%S)
echo "[$time] Installing Galaxy Pacman..." | tee -a ./logs/$filename
read -p "Please type the number of screens in the Liquid Galaxy: " nScreens

# Open port 8128

LINE=`cat /etc/iptables.conf | grep "tcp" | grep "8111" | awk -F " -j" '{print $1}'`

RESULT=$LINE",8128"

DATA=`cat /etc/iptables.conf | grep "tcp" | grep "8111" | grep "8128"`

if [ "$DATA" == "" ]; then
    time=$(date +%H:%M:%S)
    echo "[$time] Port 8128 not open, opening port..." | tee -a ./logs/$filename
    sudo sed -i "s/$LINE/$RESULT/g" /etc/iptables.conf 2>> ./logs/$filename
else
    time=$(date +%H:%M:%S)
    echo "[$time] Port already open." | tee -a ./logs/$filename
fi

# Install dependencies
time=$(date +%H:%M:%S)
echo "[$time] Installing dependencies..." | tee -a ./logs/$filename
npm install 2>> ./logs/$filename

# Add access for pm2
sudo chown lg:lg /home/lg/.pm2/rpc.sock /home/lg/.pm2/pub.sock

# Stop server if already started
pm2 delete PACMAN_PORT:8128 2> /dev/null

# Start server
time=$(date +%H:%M:%S)
echo "[$time] Starting pm2..." | tee -a ./logs/$filename
pm2 start index.js --name PACMAN_PORT:8128 -- $nScreens 2>> ./logs/$filename

pm2 save 2>> ./logs/$filename

# Add automatic pm2 resurrect script
time=$(date +%H:%M:%S)
echo "[$time] Updating resurrect script..." | tee -a ./logs/$filename
RESURRECT=$(pm2 startup | grep 'sudo')
eval $RESURRECT 2>> ./logs/$filename

time=$(date +%H:%M:%S)
echo "[$time] Installation complete. Reboot machine to finish installation" | tee -a ./logs/$filename

read -p "Do you want to reboot your machine now? [Y/n]: " yes

if [[ $yes =~ ^[Yy]$ ]]
then
  reboot
fi