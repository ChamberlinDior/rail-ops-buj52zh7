const {chromium}=require('playwright-core');const path=require('path');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1000,height:1000},deviceScaleFactor:2});
 const errors=[];
 page.on('pageerror',e=>errors.push('pageerror: '+e.message));
 page.on('console',msg=>{if(msg.type()==='error')errors.push('console: '+msg.text())});
 const source='file:///'+path.resolve(__dirname,'..','index.html').replace(/\\/g,'/');
 await page.goto(source,{waitUntil:'load'});
 await page.waitForTimeout(500);
 const skipBtn=await page.$('button:has-text("Passer")');
 if(skipBtn) await skipBtn.click();
 await page.waitForSelector('#loginForm',{timeout:15000});
 await page.evaluate(()=>{document.querySelector('#loginForm').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}))});
 await page.waitForTimeout(2500);
 await page.click('[data-page="sales"]');
 await page.waitForTimeout(1200);
 await page.click('[data-story-sale]');
 await page.waitForTimeout(600);
 await page.screenshot({path:path.resolve(__dirname,'cart-1-empty.png')});

 // add ticket item
 await page.click('[data-wz-kind="ticket"]');
 await page.click('[data-wz-addkind]');
 await page.waitForTimeout(300);
 await page.screenshot({path:path.resolve(__dirname,'cart-2-fields.png')});
 await page.click('[data-wz-addcart]');
 await page.waitForTimeout(300);
 await page.screenshot({path:path.resolve(__dirname,'cart-3-after-add.png')});

 // add bag item too
 await page.click('[data-wz-kind="bag"]');
 await page.click('[data-wz-addkind]');
 await page.waitForTimeout(300);
 await page.click('[data-wz-addcart]');
 await page.waitForTimeout(300);
 await page.screenshot({path:path.resolve(__dirname,'cart-4-two-items.png')});

 // checkout
 await page.click('[data-wz-checkout]');
 await page.waitForTimeout(300);
 await page.screenshot({path:path.resolve(__dirname,'cart-5-payment.png')});
 await page.click('[data-wz-next]');
 await page.waitForTimeout(300);
 await page.screenshot({path:path.resolve(__dirname,'cart-6-recap.png')});
 await page.click('[data-wz-submit]');
 await page.waitForTimeout(1200);
 await page.screenshot({path:path.resolve(__dirname,'cart-7-submitted.png')});

 console.log('ERRORS:', JSON.stringify(errors));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
