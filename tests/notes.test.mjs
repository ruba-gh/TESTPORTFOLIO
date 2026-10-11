import test from 'node:test';
import assert from 'node:assert/strict';
import { createNotesHandler } from '../lib/notes-handler.mjs';
const createStore = () => {
 const records=new Map();
 return {
   records,
   async *list(){yield {blobs:[...records.keys()].map(key=>({key}))};},
   async get(key){return records.get(key)||null;},
   async setJSON(key,value){records.set(key,value);},
   async delete(key){records.delete(key);}
 };
};
const request=(method='GET',body,extra={})=>new Request('https://portfolio.test/api/notes',{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...extra},body:body?JSON.stringify(body):undefined});
test('a visitor note is shared with a second visitor and survives a new handler instance',async()=>{
 const store=createStore(),first=createNotesHandler(store);
 const response=await first(request('POST',{message:'Hello from Riyadh!',name:'Ruba',color:'blue'}));assert.equal(response.status,201);
 const note=(await response.json()).note;
 const second=createNotesHandler(store);const result=await (await second(request())).json();assert.equal(result.notes[0].id,note.id);assert.equal(result.notes[0].message,'Hello from Riyadh!');
});
test('deletion is rejected without the password, with the wrong password, and succeeds with 4321',async()=>{
 const store=createStore(),handle=createNotesHandler(store);const {note}=await (await handle(request('POST',{message:'A kind note'}))).json();
 for(const password of [undefined,'0000','']){const response=await handle(request('DELETE',{id:note.id,password}));assert.equal(response.status,403);assert.equal(store.records.size,1);}
 assert.equal((await handle(request('DELETE',{id:note.id,password:'4321'}))).status,200);assert.equal(store.records.size,0);
});
test('blank, oversized and malformed posts are rejected without saving',async()=>{
 const store=createStore(),handle=createNotesHandler(store);
 for(const data of [{message:'   '},{message:'x'.repeat(281)},{message:'hello',name:'x'.repeat(33)},null]){
  const req=new Request('https://portfolio.test/api/notes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});assert.equal((await handle(req)).status,400);
 }
 assert.equal((await handle(new Request('https://portfolio.test/api/notes',{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(4097)}))).status,413);
 assert.equal(store.records.size,0);
});
test('simultaneous posts use distinct keys rather than overwriting a shared array',async()=>{
 const store=createStore(),handle=createNotesHandler(store);
 const responses=await Promise.all(Array.from({length:12},(_,i)=>handle(request('POST',{message:`Note ${i}`}))));
 assert.ok(responses.every(r=>r.status===201));assert.equal(store.records.size,12);
});
test('messages remain plain text and unapproved colors are normalized',async()=>{
 const handle=createNotesHandler(createStore());const {note}=await (await handle(request('POST',{message:'<script>window.bad=true</script>',color:'red'}))).json();
 assert.equal(note.message,'<script>window.bad=true</script>');assert.equal(note.color,'yellow');
});
test('cross-origin changes and invalid deletion ids are rejected',async()=>{
 const handle=createNotesHandler(createStore());assert.equal((await handle(request('POST',{message:'hello'},{origin:'https://elsewhere.test'}))).status,403);
 assert.equal((await handle(request('DELETE',{id:'../outside',password:'4321'}))).status,400);
});
test('a storage failure is reported, not returned as a saved note',async()=>{
 const handle=createNotesHandler({...createStore(),setJSON:async()=>{throw Error('offline');}});assert.equal((await handle(request('POST',{message:'hello'}))).status,503);
});
