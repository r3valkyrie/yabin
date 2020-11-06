import * as shell from 'shelljs';

shell.cp('-R', 'src/views/', 'dist/');
shell.cp('-R', 'src/public/assets/', 'dist/public/');
shell.cp('node_modules/codemirror/lib/codemirror.css', 'dist/public/css/')
shell.cp('node_modules/codemirror/theme/nord.css', 'dist/public/css/')
