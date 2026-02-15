
const fs = require('fs');
const path = require('path');

const srcDir = 'f:\\PieceOfShit\\Projects\\Portfolio\\xabir\\src\\assets';
const destDir = 'f:\\PieceOfShit\\Projects\\Portfolio\\xabir\\public';
const srcFile = 'TechVault_img.png';

console.log('--- DIAGNOSTICS START ---');

// 1. Check source dir files and their char codes
try {
    const files = fs.readdirSync(srcDir);
    console.log('Files in src/assets:');
    const match = files.find(f => f.trim().toLowerCase() === srcFile.toLowerCase());

    if (match) {
        console.log(`Found match: "${match}"`);
        console.log(`Char codes: ${match.split('').map(c => c.charCodeAt(0)).join(',')}`);

        const srcPath = path.join(srcDir, match);
        const destPath = path.join(destDir, 'techvault.png');

        // 2. Try to read source file stats
        const stats = fs.statSync(srcPath);
        console.log(`Source file size: ${stats.size} bytes`);

        // 3. Try to copy using ReadStream/WriteStream
        console.log(`Attempting stream copy from ${srcPath} to ${destPath}`);
        const readStream = fs.createReadStream(srcPath);
        const writeStream = fs.createWriteStream(destPath);

        readStream.on('error', (err) => console.error('Read Stream Error:', err));
        writeStream.on('error', (err) => console.error('Write Stream Error:', err));

        writeStream.on('finish', () => {
            console.log('Stream copy finished.');
            if (fs.existsSync(destPath)) {
                console.log(`Dest file exists. Size: ${fs.statSync(destPath).size}`);
            } else {
                console.error('Dest file MISSING after stream finish.');
            }
        });

        readStream.pipe(writeStream);

    } else {
        console.error(`File ${srcFile} NOT found in ${srcDir}`);
        files.forEach(f => console.log(`- "${f}" (${f.length})`));
    }
} catch (err) {
    console.error('Error listing src dir:', err);
}

// 4. Test copy within public
try {
    const testSrc = path.join(destDir, 'vite.svg');
    const testDest = path.join(destDir, 'vite_copy.svg');
    if (fs.existsSync(testSrc)) {
        fs.copyFileSync(testSrc, testDest);
        console.log('Test copy inside public (vite.svg -> vite_copy.svg) SUCCESS');
    } else {
        console.log('vite.svg not found for test copy');
    }
} catch (err) {
    console.error('Test copy inside public FAILED:', err);
}

console.log('--- DIAGNOSTICS END ---');
