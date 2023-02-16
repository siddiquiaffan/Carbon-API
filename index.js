const puppeteer = require('puppeteer');
var path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fileSystem = require('fs');
let browser;

const openBrowser = async () => {
    if(!browser) {
        return browser = await puppeteer.launch({
            defaultViewPort:"none",
            handleSIGINT:false,
            handleSIGTERM:false,
            handleSIGHUP:false,
            headless:false,
            args: ['--no-sandbox','--disable-gpu','--disable-setuid-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions']
        });
    }
    return browser = browser;
}

app.get('/api/', async function (req, res) {
    const text = req.query.text;
    if(text){
        // intiate browser
        await openBrowser();
        const {ss} = req.query || req.body;

        const params = {
            bg      : req.query.bg      || 'rgba%28171%2C+184%2C+195%2C+1%29',
            t       : req.query.t       || 'seti',
            wt      : req.query.wt      || 'none',
            l       : req.query.l       || 'auto',
            ds      : req.query.ds      || 'true',
            dsyoff  : req.query.dsyoff  || '20px',
            blur    : req.query.blur    || '68px',
            wc      : req.query.wc      || 'true',
            wa      : req.query.wa      || 'true',
            pv      : req.query.pv      || '56px',
            ph      : req.query.ph      || '56px',
            ln      : req.query.ln      || 'false',
            fl      : req.query.fl      || '1',
            fm      : req.query.fm      || 'Hack',
            fs      : req.query.fs      || '14px',
            lh      : req.query.lh      || '133%25',
            si      : req.query.si      || 'false',
            es      : req.query.es      || '2x',
            wm      : req.query.wm      || 'false',
            type    : req.query.type    || 'png',
            fileName: req.query.name    || 'carbon',
        }

        const options = Object.keys(params)
            .map(k => k + '=' + params[k])
            .join('&')

        //! Code to get image.
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080});
        await page.goto(`https://carbon.now.sh/?${options}&code=${text}`);
        // await page.waitForSelector('.CodeMirror-code', { visible: true, timeout: 60000 })

        const imgName = `${params.fileName || 'carbon'}.${ss != 'true' ? params.type : 'png'}`

        if(ss == 'true'){
            const element = await page.$('#export-container  .container-bg')
            await element.screenshot({path: imgName})
        }else {
            await page.click('#export-menu')
            await page.type('div.popout > .export-row > input[title=filename]', imgName.slice(-4, 0))  
            await page.evaluate(el => el.value , await page.$("div.popout > .export-row > input[title=filename]"))
            await page.click('#export-' + params.type)
            
            try{
                await page._client.send("Page.setDownloadBehavior", {
                    behavior: "allow",
                    downloadPath: __dirname
                });
                await page.waitFor(5000);
            }catch(e){
                res.send({"error" : "Can not generate carbon due to" + e})
            }

        }
        res.sendFile(path.join(__dirname, imgName))

        await page.close();
        fileSystem.unlinkSync(imgName)
        //! Code to get image.
    }else{
        let err = {error:"Please provide valid code/text."}
        res.send(JSON.stringify(err))
    }
})

app.get('/' , (req , res) => { res.redirect('https://affanthebest.github.io/APIs/Carbon')})

app.listen(port , () => {console.log('listening to the port at ' + port)})