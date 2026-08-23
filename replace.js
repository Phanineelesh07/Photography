const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                replaceInDir(fullPath);
            }
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.json')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('Obscura') || content.includes('obscura')) {
                    const original = content;
                    content = content.replace(/Obscura/g, 'Inspire');
                    content = content.replace(/obscura/g, 'inspire');
                    content = content.replace(/OBSCURA/g, 'INSPIRE');
                    if (content !== original) {
                        fs.writeFileSync(fullPath, content, 'utf8');
                        console.log('Updated', fullPath);
                    }
                }
            }
        }
    }
}

replaceInDir('client');
replaceInDir('server');
console.log('Done!');
