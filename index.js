const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async function (req, res) {
    const text = req.query.text;
    if(text){
        const bg = req.query.bg ? req.query.bg : 'rgba%28171%2C+184%2C+195%2C+1%29';
        const t = req.query.t ? req.query.t : 'seti';
        const wt = req.query.wt ? req.query.wt : 'none';
        const l = req.query.l ? req.query.l : 'auto';
        const ds = req.query.ds ? req.query.ds : 'true';
        const dsyoff = req.query.dsyoff ? req.query.dsyoff : '20px';
        const blur = req.query.blur ? req.query.blur : '68px';
        const wc = req.query.wc ? req.query.wc : 'true';
        const wa = req.query.wa ? req.query.wa : 'true';
        const pv = req.query.pv ? req.query.pv : '56px';
        const ph = req.query.ph ? req.query.ph : '56px';
        const ln = req.query.ln ? req.query.ln : 'false';
        const fl = req.query.fl ? req.query.fl : '1';
        const fm = req.query.fm ? req.query.fm : 'Hack';
        const fs = req.query.fs ? req.query.fs : '14px';
        const lh = req.query.lh ? req.query.lh : '133%25';
        const si = req.query.si ? req.query.si : 'false';
        const es = req.query.es ? req.query.es : '2x';
        const wm = req.query.wm ? req.query.wm : 'false';
    
        const options = `bg=${bg}&t=${t}&wt=${wt}&l=${l}&ds=${ds}&dsyoff=${dsyoff}&blur=${blur}&wc=${wc}&wa=${wa}&pv=${pv}&ph=${ph}&ln=${ln}&fl=${fl}&fm=${fm}&fs=${fs}&lh=${lh}&si=${si}&es=${es}&wm=${wm}`
    
        //! Code to get image.
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080});
        await page.goto(`https://carbon.now.sh/?${options}&code=${text}`);
        const element = await page.$('.jsx-2649486367 .page .editor .dnd-container .section #export-container .container')
        try {
            await element.screenshot({path: `carbon.png`})
            const img = await __dirname + '/carbon.png';
            await res.sendFile(img , {title:text})
        } catch(e) {
            let err = {error:"Could not create carbon."}
            res.send(JSON.stringify(err))
        }
        await browser.close();
        //! Code to get image.
    }else{
        let err = {error:"Please provide valid code/text."}
        res.send(JSON.stringify(err))
    }

})

app.get('/' , (req , res) => { res.redirect('https://affanthebest.github.io/APIs/Carbon')})

app.listen(port , () => {console.log('listening to the port at ' + port)})