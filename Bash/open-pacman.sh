#!/bin/bash
. ${HOME}/etc/shell.conf

port=8128;
screenNumber=0;
for lg in $LG_FRAMES ; do
    screenNumber=${lg:2}
	if [ $lg == "lg1" ]; then
		export DISPLAY=:0
        nohup chromium-browser http://localhost:$port/$screenNumber --start-fullscreen --autoplay-policy=no-user-gesture-required </dev/null >/dev/null 2>&1 &

	else
        ssh -Xnf lg@$lg " export DISPLAY=:0 ; chromium-browser http://lg1:$port/$screenNumber --start-fullscreen --autoplay-policy=no-user-gesture-required </dev/null >/dev/null 2>&1 &" || true
	fi

   sleep 1
done
