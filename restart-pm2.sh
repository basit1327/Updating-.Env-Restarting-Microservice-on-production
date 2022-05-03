#!/bin/sh
node setup-self.js
pm2 stop ecosystem.config.js
pm2 delete ecosystem.config.js
pm2 start ecosystem.config.js