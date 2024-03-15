---
title: "vscode 初始配置"
date: 2024-03-15T08:32:57+08:00
draft: true
tags: ["vscode"]
---

# VSCODE 初始配置

```json
{
  "git.confirmSync": false,
  "tabnine.experimentalAutoImports": true,
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "vim.easymotion": true,
  "vim.incsearch": true,
  "vim.useSystemClipboard": true,
  "vim.useCtrlKeys": true,
  "vim.hlsearch": true,
  "vim.insertModeKeyBindings": [
    {
      "before": ["j", "j"],
      "after": ["<Esc>"]
    }
  ],
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "d"],
      "after": ["d", "d"]
    },
    {
      "before": ["<C-n>"],
      "commands": [":nohl"]
    },
    {
      "before": ["K"],
      "commands": ["lineBreakInsert"],
      "silent": true
    }
  ],
  "vim.leader": "<space>",
  "vim.handleKeys": {
    "<C-a>": false,
    "<C-f>": false,
    "<C-e>": false,
    "<C-d>": false,
    "<C-w>": false
  },
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "files.exclude": {
    "**/.git": true
  },
  "editor.wordWrap": "on",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.fontSize": 16,
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.minimap.maxColumn": 80
}
```
