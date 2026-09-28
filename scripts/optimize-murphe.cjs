// Authoring only: see public/murph-e/SOURCES.md for the pinned toolchain.
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const [modelSource,screenSource,toolchain]=process.argv.slice(2);
if (!modelSource || !screenSource || !toolchain) throw new Error('Usage: node scripts/optimize-murphe.cjs original.glb original-screen.png toolchain-directory');
const toolRequire=createRequire(path.resolve(toolchain,'package.json'));
const output=path.resolve(__dirname,'../public/murph-e/model');
const modelOutput=path.join(output,'arcade-machine-diagram.glb');
const screenOutput=path.join(output,'crt-screen.webp');
if (path.resolve(modelSource) === modelOutput) throw new Error('Use the uncompressed source model, not the served output.');
const assert=require('node:assert/strict');
const {NodeIO}=toolRequire('@gltf-transform/core');
const {ALL_EXTENSIONS,EXTMeshoptCompression,EXTTextureWebP}=toolRequire('@gltf-transform/extensions');
const {MeshoptEncoder}=toolRequire('meshoptimizer');
const sharp=require('sharp');
(async()=>{
 const {MeshoptDecoder}=await import('three/addons/libs/meshopt_decoder.module.js');
 await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready]);
 const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
 const doc=await io.read(modelSource);
 const source=await io.read(modelSource);
 for(const texture of doc.getRoot().listTextures()) {
   const before=Buffer.from(texture.getImage());
   const webp=await sharp(before).webp({lossless:true,effort:6}).toBuffer();
   if(webp.length<before.length) {
     texture.setImage(webp).setMimeType('image/webp');
     console.log('texture',texture.getName(),before.length,webp.length);
   }
 }
 doc.createExtension(EXTTextureWebP).setRequired(true);
 doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.QUANTIZE});
 // No quantization, geometry simplification, or lossy filters.
 const binary=await io.writeBinary(doc);
 const result=await io.readBinary(binary);
 const nodes=d=>d.getRoot().listNodes().map(n=>({name:n.getName(),extras:n.getExtras(),translation:n.getTranslation(),rotation:n.getRotation(),scale:n.getScale(),children:n.listChildren().map(c=>c.getName())}));
 assert.deepEqual(nodes(result),nodes(source));
 const meshes=d=>d.getRoot().listMeshes().map(m=>({name:m.getName(),primitives:m.listPrimitives().map(p=>({mode:p.getMode(),attributes:p.listSemantics().map(s=>[s,Array.from(p.getAttribute(s).getArray())]),indices:p.getIndices()?Array.from(p.getIndices().getArray()):null}))}));
 assert.deepEqual(meshes(result),meshes(source));
 for(let i=0;i<source.getRoot().listTextures().length;i++) {
  const a=await sharp(Buffer.from(source.getRoot().listTextures()[i].getImage())).ensureAlpha().raw().toBuffer();
  const b=await sharp(Buffer.from(result.getRoot().listTextures()[i].getImage())).ensureAlpha().raw().toBuffer();
  assert.deepEqual(b,a);
 }
 fs.writeFileSync(modelOutput,binary);
 const crt=await sharp(screenSource).resize({width:768}).webp({quality:88}).toFile(screenOutput);
 console.log(JSON.stringify({modelBefore:fs.statSync(modelSource).size,modelAfter:fs.statSync(modelOutput).size,crtBefore:fs.statSync(screenSource).size,crtAfter:crt.size,verified:'All mesh attributes, indices, node transforms, assembly metadata, and decoded model texture pixels match exactly.'}));
})();
