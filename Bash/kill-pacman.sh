#!/bin/bash
. ${HOME}/etc/shell.conf

for lg in $LG_FRAMES ; do
	if [ $lg == "lg1" ]; then
		export DISPLAY=:0
        pkill chromium-browse 
	else
        ssh -Xnf lg@$lg " pkill chromium-browse " || true
	fi
done
