#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');

const commandsDir = path.join(__dirname, '../lib/commands');

// 动态加载并注册所有命令
if (fs.existsSync(commandsDir)) {
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const cmdModule = require(path.join(commandsDir, file));
    
    if (cmdModule.name && cmdModule.action) {
      const cmd = program.command(cmdModule.name);
      
      if (cmdModule.description) {
        cmd.description(cmdModule.description);
      }
      
      if (cmdModule.options && Array.isArray(cmdModule.options)) {
        cmdModule.options.forEach(opt => {
          if (opt.defaultValue !== undefined) {
            cmd.option(opt.flags, opt.description, opt.defaultValue);
          } else {
            cmd.option(opt.flags, opt.description);
          }
        });
      }
      
      cmd.action(cmdModule.action);
    }
  }
}

program.version(pkg.version);
program.parse(process.argv);
