# DiBook-downloader
Script to download your Laterza DiBook books to pdf for offline use. This only works with books that are available as PDFs online.

## Requirements

- [Node](https://nodejs.org/it/) >= 14.0
- Java installed (or if you are on linux you can install pdftk from your package manager, just make sure it's version 3 or above, also known as `pdftk-java`)
- A modern browser (Chrome, Firefox, Edge, etc.)

## Installation

1. Download the source code from [here](https://github.com/Leone25/dibook-downloader/archive/refs/heads/main.zip) or click the above green button `Code` and click `Download Zip`
2. Extract the zip file in a new folder and open it
3. Open the folder in a terminal
   1. If you are on Windows 11, just right click and press `Open with Windows Terminal`
   2. If you are on Windows 10, hold `shift` on your keyboard and right click on a white space, then press `Open command window here`
4. Type in the terminal:
   ```shell
   npm i
   ```
5. Optional for linux users that can install pdftk from their package manager, go to https://gitlab.com/pdftk-java/pdftk and under `Pre-built binaries`, click on `Standalone jar`, then copy the downloaded file to the script directory

## How to use

1. Open the folder of the script in a terminal (same way as installation) and run the script with node typing:

   ```shell
   node .
   ```
   - if you are a linux user add the `--useSystemExecutable` flag
2. In a browser, login into your [DiBook Laterza account](https://www.dibooklaterza.it/), and open the book you'd like to download
3. Open the dev tools (`f12` works) and open the `Application` tab if you are using a chromium based browser or `Storage` if you are using firefox, then select `Local Storage` > `https://www.dibooklaterza.it` and copy the value of the `jwtToken` entry
4. Paste this value into the terminal wen asked for the `jwtToken`
5. Enter the ISBN of the book you want to download (you can copy it from the url of the book you've opened)
6. Wait, the book will be downloaded and saved to the script' directory

## Disclaimer

Remember that you are responsible for what you are doing on the internet and even tho this script exists it might not be legal in your country to create personal backups of books.

I may or may not update this script depending on my needs, but I'm open to pull requests ecc.

## License

This software uses the MIT License
