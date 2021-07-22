[![License](https://img.shields.io/github/license/LiquidGalaxyLAB/galaxy-pacman.svg)](https://opensource.org/licenses/Apache-2.0) [![github-languages-image](https://img.shields.io/github/languages/top/LiquidGalaxyLAB/galaxy-pacman.svg?color=red)]() [![github-language-count-image](https://img.shields.io/github/languages/count/LiquidGalaxyLAB/galaxy-pacman.svg)]() [![Issues](https://img.shields.io/github/issues/LiquidGalaxyLAB/galaxy-pacman.svg)](https://github.com/LiquidGalaxyLAB/galaxy-pacman/issues) [![forks](https://img.shields.io/github/forks/LiquidGalaxyLAB/galaxy-pacman.svg)]() [![github-repo-size-image](https://img.shields.io/github/repo-size/LiquidGalaxyLAB/galaxy-pacman.svg?color=yellow)]()

# Galaxy Pacman

The Pac-man game will be a multiplayer and multiscreen remake with a few new fun mechanics. The players will spawn as a Pac-Man, each one with a different color, except for one of them that will start as a Ghost. The Pac-Man's goal is to collect as many points by eating food along the map while the Ghost’s goal is to catch all the Pac-Mans, but, once a Ghost catches a Pac-Man, the player will also turn into a ghost and start hunting other Pac-Mans, which makes the game fun and challenging for both teams. The game ends once all the foods are eaten by the Pac-Mans or all the Pac-Mans get caught.

## Before Running
- Make sure Node.js version 14 is installed on the master machine, if necessary use the following link for tips on how to install it:
[How To Install Node.js on Ubuntu 16.04](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/)

- Make sure Chromium Browser is installed on all machines

- Make sure port 8128 is open

## Running Project For The Liquid Galaxy
After cloning the repository in the master machine navigate to the cloned folder and install all dependencies by runing:
```bash
cd galaxy-pacman

npm install
```

Once the installation is finished you can run the project by running the command:
```bash
npm run server 5
```
Here you can change the number 5 to any amount of screens that you wish, if you don't give a number it will default to 5!

With the server running, open the game by executing the open script with:
```bash
bash ./Bash/open-pacman.sh
```

Once the screens are open, you can open the controller on any browser with the url {masterIp}:8128/controller, where **masterIp** is the IPv4 of the master machine

## Running Project Locally
After cloning the repository navigate to the cloned folder and install all dependencies by runing:
```bash
cd galaxy-pacman

npm install
``` 

Once the installation is finished you can run the project by running the command:
```bash
npm run server 5
```
Here you can change the number 5 to any amount of screens that you wish, if you don't give a number it will default to 5!

With the server running, the game is going to be available in the 8128 port, to open a game screen use the url: localhost:8128/{screen}, where screen is the number of the screen you want, i.e. screen 1 will be localhost:8128/1

Once the screens are open, you can open the controller on any browser with the url localhost:8128/controller