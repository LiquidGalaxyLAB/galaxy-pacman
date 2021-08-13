[![License](https://img.shields.io/github/license/LiquidGalaxyLAB/galaxy-pacman.svg)](https://opensource.org/licenses/Apache-2.0) [![github-languages-image](https://img.shields.io/github/languages/top/LiquidGalaxyLAB/galaxy-pacman.svg?color=red)]() [![github-language-count-image](https://img.shields.io/github/languages/count/LiquidGalaxyLAB/galaxy-pacman.svg)]() [![Issues](https://img.shields.io/github/issues/LiquidGalaxyLAB/galaxy-pacman.svg)](https://github.com/LiquidGalaxyLAB/galaxy-pacman/issues) [![forks](https://img.shields.io/github/forks/LiquidGalaxyLAB/galaxy-pacman.svg)]() [![github-repo-size-image](https://img.shields.io/github/repo-size/LiquidGalaxyLAB/galaxy-pacman.svg?color=yellow)]()

# Galaxy Pacman

The Pac-man game will be a multiplayer and multiscreen remake with a few new fun mechanics. The players will spawn as a Pac-Man, each one with a different color, except for one of them that will start as a Ghost. The Pac-Man's goal is to collect as many points by eating food along the map while the Ghost’s goal is to catch all the Pac-Mans, but, once a Ghost catches a Pac-Man, the player will also turn into a ghost and start hunting other Pac-Mans, which makes the game fun and challenging for both teams. The game ends once all the foods are eaten by the Pac-Mans or all the Pac-Mans get caught.

## Before Running
- Make sure Node.js version 14 is installed on the master machine, if necessary use the following link for tips on how to install it:
[How To Install Node.js on Ubuntu 16.04.](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/)
- Make sure pm2 is installed on the master machine, if necessary use the following command to install it afyer Node.js is installed:
```bash
sudo npm i -g pm2
```
- Make sure Chromium Browser is installed on all machines.

## Running Project For The Liquid Galaxy
Firstly, open a new terminal and clone the repository **in the home directory (default directory on terminal)** of the master machine with the command:
```bash
git clone https://github.com/LiquidGalaxyLAB/galaxy-pacman.git
```

Once the repository is cloned, navigate to the cloned folder and execute the installation script by running the following commands:
```bash
cd galaxy-pacman

bash install.sh
```

After the game is installed make sure to reboot your machine! Once it is done rebooting, the game can be opened by executing the open script in the galaxy-pacman directory with:
```bash
cd galaxy-pacman

bash ./Bash/open-pacman.sh
```
If you experience any problems, check the installation logs for any possible errors in the logs folder, there will be a file with the date of installation as it's name.

## Connecting Players To The Game On LG
Once the screens are open, you can open the controller on any browser with the url **masterIp**:8128/controller, where **masterIp** is the IPv4 of the master machine.

## Running Project Locally
Firstly, clone the repository with the command:
```bash
git clone https://github.com/LiquidGalaxyLAB/galaxy-pacman.git
```

Once the repository is cloned, navigate to the cloned folder and execute the installation script by running the following commands:
```bash
cd galaxy-pacman

npm install
``` 

Once the installation is finished you can run the project by running the command:
```bash
npm run server 5
```
Here you can change the number 5 to any amount of screens that you wish, if you don't give a number it will default to 5!

With the server running, the game is going to be available in the 8128 port, to open a game screen use the url: localhost:8128/**screen**, where **screen** is the number of the screen you want, e.g. screen 1 will be localhost:8128/1.

If you experience any problems, check the installation logs for any possible errors in the logs folder, there will be a file with the date of installation as it's name.

## Connecting Players To The Game Locally
Once the screens are open, you can open the controller on any browser with the url **machineIp**:8128/controller, where **machineIp** is the IPv4 of the machine where the server is running.
