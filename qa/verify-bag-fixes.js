const {chromium}=require('playwright-core');const path=require('path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1100,height:1000},deviceScaleFactor:2});
 const source='file:///'+path.resolve(__dirname,'..','index.html').replace(/\\/g,'/');
 await page.goto(source,{waitUntil:'load'});
 await page.evaluate(async()=>{
   document.querySelector('#loginForm').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}));
   await new Promise(r=>setTimeout(r,1200));
   navigate('sales');
   await new Promise(r=>setTimeout(r,600));
   document.querySelector('[data-doc-open="bag"]')?.click();
   await new Promise(r=>setTimeout(r,900));
 });
 await page.waitForTimeout(2500);
 await page.screenshot({path:path.resolve(__dirname,'verify-bag-fixed.png'),fullPage:false});
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
