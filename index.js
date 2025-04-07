import { spawn } from 'child_process';
import yargs from 'yargs';
import PromptSync from 'prompt-sync';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const argv = yargs(process.argv.slice(2))
    .option('jwt', {
        describe: 'Input "jwtToken" token from local storage',
        type: 'string',
        default: null
    })
    .option('isbn', {
        describe: 'Book ISBN',
        type: 'string',
        default: null
    })
    .option('pdftkPath', {
        describe: 'Path to pdftk executable',
        type: 'string',
        default: 'pdftk'
    })
    .option('output', {
        describe: 'Output filename',
        type: 'string',
        default: null
    })
    .help()
    .argv;

const prompt = PromptSync({ sigint: true });

function removePassword(password, input, output) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(path.dirname(output))) {
            await fs.promises.mkdir(path.dirname(output), { recursive: true });
        }

        let pdftk = spawn(argv.pdftkPath, [input, 'input_pw', password, 'output', output]);
        pdftk.on('close', resolve);
    });
}

function mergePages(pages, output) {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(path.dirname(output))) {
            await fs.promises.mkdir(path.dirname(output), { recursive: true });
        }

        let pdftk = spawn(argv.pdftkPath, [...pages, 'cat', 'output', output]);
        pdftk.on('close', resolve);
    });
}

(async () => {
    let jwtToken = argv.jwt;
    while (!jwtToken)
        jwtToken = prompt("Input \"jwtToken\": ");

    let isbn = argv.isbn;
    while (!isbn)
        isbn = prompt("Input ISBN: ");

    let authorization = 'Bearer ' + jwtToken;

    console.log("Fetching book index");
    
    let bookIndex = await fetch(`https://api.dibooklaterza.it/api/reader/${isbn}/index`, {
        headers: {authorization}
    }).then(res => res.json());

    console.log(`Downloading ${bookIndex.name}`);

    let pages = [];
    const password = `AB8374JJ${isbn.padEnd(16, "0")}H48js83A`;
    
    await fs.promises.mkdir('./tmp', {recursive: true});

    for (let i = 0; i < bookIndex.chapters.length; i++) {
        let chapter = bookIndex.chapters[i];
        for (let j = 0; j < chapter.pageLabels.length; j++) {
            console.log(`Downloading page ${chapter.pageLabels[j]}`);
            pages.push(`${chapter.id}/${chapter.pageLabels[j]}.pdf`);
            fs.promises.mkdir(`./tmp/password/${chapter.id}`, {recursive: true})
            let pageUrl = await fetch(`https://api.dibooklaterza.it/api/reader/${isbn}/${chapter.id}/pdf-secure/${chapter.pageLabels[j]}`, {
                headers: {authorization}
            }).then(res => res.text());
            let page = await fetch(pageUrl).then(res => res.arrayBuffer());
            await fs.promises.writeFile(`./tmp/password/${chapter.id}/${chapter.pageLabels[j]}.pdf`, Buffer.from(new Uint8Array(page)));
            await removePassword(password, `./tmp/password/${chapter.id}/${chapter.pageLabels[j]}.pdf`, `./tmp/pages/${chapter.id}/${chapter.pageLabels[j]}.pdf`);
        }
    }

    console.log("Merging pages");

    await mergePages(pages.map(p => `./tmp/pages/${p}`), bookIndex.name.replace(/[^a-z0-9]/gi, '_') + '.pdf');

    console.log("Cleaning up");

    await fs.promises.rm('./tmp', { recursive: true, force: true });

    console.log("Done!");
})();