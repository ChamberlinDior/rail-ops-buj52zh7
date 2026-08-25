const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const sourceFiles=fs.readdirSync(root).filter(name=>/\.(?:html|css|js)$/.test(name));
const references=[];
const patterns=[/(?:src|href)=["']([^"'#?]+)["']/g,/url\(["']?([^"')?#]+)["']?\)/g,/fetch\(["']([^"']+)["']/g];
for(const file of sourceFiles){const source=fs.readFileSync(path.join(root,file),'utf8');for(const pattern of patterns){for(const match of source.matchAll(pattern)){const reference=match[1].trim();if(!reference||/^(?:https?:|data:|#|%23|var\(|blob:)/.test(reference)||reference.includes('${'))continue;references.push({file,reference})}}}
const unique=[...new Map(references.map(item=>[`${item.file}|${item.reference}`,item])).values()];
const missing=unique.filter(item=>!fs.existsSync(path.resolve(root,path.dirname(item.file),item.reference)));
const caseErrors=[];
for(const item of unique.filter(item=>!missing.includes(item))){let current=path.resolve(root,path.dirname(item.file));for(const part of item.reference.replace(/\\/g,'/').split('/').filter(Boolean)){const actual=fs.readdirSync(current).find(entry=>entry.toLowerCase()===part.toLowerCase());if(actual&&actual!==part)caseErrors.push({...item,expected:actual});current=path.join(current,actual||part)}}
const unsafe=unique.filter(({reference})=>reference.includes('..')||reference.startsWith('/')||reference.includes('\\'));
console.log(JSON.stringify({sourceFiles:sourceFiles.length,references:references.length,uniqueReferences:unique.length,missing,caseErrors,unsafe},null,2));
if(missing.length||caseErrors.length||unsafe.length)process.exitCode=1;
