import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
let chromium;
try{({chromium}=await import('playwright'));}catch{throw new Error('Rendered regression requires Playwright and Chromium; install them locally before claiming browser validation.');}
const server=spawn('python3',['-m','http.server','4173'],{stdio:'ignore'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{
  await sleep(500);
  const browser=await chromium.launch({headless:true});
  for(const viewport of [{width:1280,height:800},{width:1920,height:1200}]){
    const page=await browser.newPage({viewportSize:viewport});
    await page.goto('http://127.0.0.1:4173/index.html');
    await page.waitForFunction(()=>document.querySelectorAll('.cell').length===15);
    const geometry=await page.evaluate(()=>{const cell=document.querySelector('.cell'),img=cell.querySelector('img'),c=cell.getBoundingClientRect(),i=img.getBoundingClientRect(),style=getComputedStyle(img);return{cell:{width:c.width,height:c.height},image:{width:i.width,height:i.height},padding:parseFloat(style.paddingTop),objectFit:style.objectFit,winCount:!!document.querySelector('#winCount')};});
    assert.equal(geometry.objectFit,'contain');assert.ok(geometry.image.height<=geometry.cell.height);assert.ok(geometry.image.width<=geometry.cell.width);assert.ok(geometry.padding>0);assert.equal(geometry.winCount,false);
    const grid=await page.evaluate(()=>Array.from({length:5},(_,reel)=>Array.from({length:3},(_,row)=>document.querySelector(`.cell[data-reel="${reel}"][data-row="${row}"]`).dataset.symbol)));
    const animation=page.evaluate(grid=>window.__PRIMBEE__.animateReels({grid}),grid);await page.waitForSelector('.reel-window');
    const moving=await page.evaluate(async()=>{const strip=document.querySelector('.reel-strip'),cells=[...strip.children],cell=document.querySelector('.cell:not(.passing)').getBoundingClientRect(),a=getComputedStyle(strip).transform;await new Promise(r=>setTimeout(r,350));const b=getComputedStyle(strip).transform,rect=strip.getBoundingClientRect(),windowRect=document.querySelector('.reel-window').getBoundingClientRect();return{cells:cells.length,heights:cells.map(x=>x.getBoundingClientRect().height),stripHeight:rect.height,cellHeight:cell.height,windowHeight:windowRect.height,a,b};});
    assert.equal(moving.cells,15);assert.ok(moving.stripHeight>=moving.cellHeight*15-.5);assert.ok(moving.heights.every(height=>Math.abs(height-moving.cellHeight)<.5));assert.ok(moving.windowHeight>=moving.cellHeight*3);assert.notEqual(moving.a,moving.b);
    await animation;const landed=await page.evaluate(()=>Array.from({length:5},(_,reel)=>Array.from({length:3},(_,row)=>document.querySelector(`.cell[data-reel="${reel}"][data-row="${row}"]`).dataset.symbol)));assert.deepEqual(landed,grid);
    const positions=[[0,0],[1,1],[2,2],[3,1],[4,0]];await page.evaluate(p=>window.__PRIMBEE__.drawPayline(p),positions);const line=await page.locator('#lineLayer polyline.payline').getAttribute('points');assert.equal(line,'50,50 150,150 250,250 350,150 450,50');
    await page.screenshot({path:`/tmp/primbee-${viewport.width}x${viewport.height}.png`});await page.close();
  }
  await browser.close();console.log('Rendered geometry passed at 1280x800 and 1920x1200');
}finally{server.kill();}
