# link-sync

Syncs your test package in parent directory or relative to it into your current project without creating symlinks and node_module conflicts like npm link.

`npx link-sync -p test-package-in-parent-dir-or-relative-parent-dir -w`


## Comandline params

`-p --path` : package path relative to the parent directory 

`-w --watch` : watch mode

`-v, --version` : link-sync version 


## link-sync vs npm link

Testing npm packages before publishing to npm using npm link node_modules directory must be deleted in your test package to avoid dependencies conflicts. Also it creates  symlinks, and it can mess your time with npm unlink. You can do it all manualy, or use this util.

