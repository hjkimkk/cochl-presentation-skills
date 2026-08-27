// Cochl Press / Media Kit — 5-page editable SVG (Letter portrait 612×792), Cochl brand.
// Mirrors the CREWIST media-kit layout grammar: right "MEDIA KIT" spine, heavy display headers,
// accent blocks, stats, testimonials, contact. Indigo→purple replaces orange; real cochl. logo;
// gradient-disc mark instead of the asterisk. [NEEDS INPUT] on any unconfirmed fact.
import { writeFileSync, mkdirSync } from 'node:fs';
const OUT='/Users/hyo/Desktop/cochl-press-kit'; mkdirSync(OUT+'/pages',{recursive:true});
const W=612,H=792,M=48, SPINE=74, SX=W-SPINE; // spine band x-start
const SYMB='M89.1755 69.9242C89.1813 78.5359 86.636 86.9564 81.8606 94.1229C77.0853 101.289 70.2941 106.881 62.344 110.191C54.3939 113.502 45.6413 114.383 37.1907 112.724C28.7402 111.065 20.9705 106.94 14.8621 100.87C8.75382 94.799 4.58065 87.0552 2.86931 78.6152C1.15797 70.1752 1.98515 61.4175 5.24647 53.4472C8.50779 45.4769 14.0571 38.6512 21.194 33.8317C28.3309 29.0122 36.7355 26.4148 45.3473 26.3673C51.0978 26.3034 56.8036 27.3844 62.1322 29.5473C67.4608 31.7103 72.3058 34.9119 76.3849 38.9658C80.464 43.0196 83.6956 47.8446 85.8915 53.1596C88.0874 58.4746 89.2038 64.1735 89.1755 69.9242Z';
const WORD='M436.064 34.8165C431.563 31.8932 426.339 30.3563 421.012 30.3884C415.608 30.255 410.269 31.6058 405.545 34.3009C400.336 37.3178 395.826 41.4567 392.327 46.4327V2.15166H382.331V58.7161C371.271 72.425 354.799 92.7761 353.764 93.5647C350.651 96.8173 346.923 99.385 342.81 101.111C338.697 102.837 334.284 103.685 329.84 103.604C324.049 103.813 318.325 102.284 313.368 99.206C308.422 96.632 304.312 92.6382 301.539 87.7111C298.821 82.8588 297.336 77.3832 297.221 71.7881C297.104 67.5689 297.873 63.3731 299.475 59.485C301.077 55.597 303.475 52.1076 306.507 49.2533C309.563 46.1781 313.204 43.7827 317.204 42.2171C321.203 40.6515 325.475 39.9493 329.751 40.1545C335.075 39.9459 340.367 41.0813 345.162 43.4611C349.957 45.8409 354.11 49.3921 357.254 53.8028L365.179 48.8287C362.977 45.0792 360.108 41.7871 356.721 39.1233C353.01 36.564 348.982 34.524 344.744 33.0574C340.086 31.4109 335.179 30.6303 330.254 30.7523C322.627 30.5838 315.078 32.3552 308.282 35.9083C301.88 39.5237 296.532 44.8204 292.786 51.2551C289.253 57.6735 287.361 64.9037 287.285 72.2734C287.248 77.7228 288.293 83.1229 290.357 88.1445C292.421 93.166 295.461 97.7036 299.292 101.481C303.226 105.466 307.905 108.595 313.048 110.68C318.19 112.765 323.691 113.762 329.219 113.612C336.538 113.664 343.758 111.872 350.245 108.396C354.069 106.343 357.593 103.75 360.714 100.692C361.66 99.8429 373.164 85.2544 382.272 73.6382V113.612H392.031L392.208 82.2821C392.078 75.1243 392.473 67.9665 393.391 60.8695C395.025 55.0938 398.261 49.9302 402.706 46.0081C407.18 42.1443 412.827 39.9995 418.676 39.9422C423.206 39.5668 427.71 40.9331 431.312 43.7753C434.914 46.6175 437.356 50.7323 438.164 55.3192C438.933 61.3517 439.269 67.434 439.169 73.5169L438.962 113.764H448.603V71.0299C448.603 59.8686 448.041 52.2256 445.646 47.3123C443.801 42.224 440.451 37.8548 436.064 34.8165ZM238.609 30.3884C233.091 30.2799 227.614 31.3912 222.552 33.6469C217.49 35.9025 212.961 39.2495 209.273 43.4604C207.64 45.2721 206.156 47.2199 204.837 49.2837C195.965 61.2335 172.307 92.4122 171.065 93.4131C168.032 96.6981 164.357 99.2902 160.28 101.02C156.204 102.75 151.817 103.579 147.407 103.452C141.579 103.66 135.817 102.133 130.817 99.0543C125.979 96.4025 121.955 92.4226 119.195 87.5595C116.415 82.7242 114.868 77.2475 114.7 71.6365C114.634 67.4048 115.446 63.2069 117.083 59.3217C118.72 55.4365 121.143 51.9528 124.193 49.1017C127.244 46.0288 130.88 43.6347 134.875 42.0691C138.869 40.5034 143.136 39.8 147.407 40.0028C152.754 39.8089 158.066 40.9496 162.888 43.327C167.71 45.7044 171.896 49.2473 175.087 53.6511L182.776 48.6771C180.663 44.9258 177.861 41.63 174.525 38.9716C170.755 36.3844 166.655 34.3432 162.341 32.9057C157.686 31.2897 152.794 30.5099 147.881 30.6007C140.254 30.4397 132.707 32.2107 125.908 35.7567C119.524 39.3847 114.188 44.6791 110.442 51.1034C106.874 57.5131 104.942 64.7424 104.823 72.1217C105.033 83.2129 109.497 93.7723 117.247 101.511C124.997 109.249 135.408 113.543 146.224 113.461C153.779 113.503 161.236 111.716 167.99 108.244C171.782 106.183 175.275 103.59 178.37 100.54C179.109 99.7519 189.666 86.0127 199.07 73.7899C199.595 84.2985 203.962 94.2183 211.301 101.571C218.64 108.924 228.412 113.169 238.668 113.461C244.12 113.473 249.515 112.317 254.505 110.066C259.496 107.815 263.973 104.518 267.649 100.389C274.634 92.6944 278.559 82.5979 278.652 72.0854C278.745 61.5728 274.999 51.405 268.152 43.5817C264.451 39.3213 259.894 35.9353 254.793 33.6575C249.693 31.3797 244.171 30.2643 238.609 30.3884ZM264.426 87.6505C261.905 92.4248 258.096 96.3526 253.454 98.9634C248.974 101.876 243.78 103.422 238.476 103.422C233.172 103.422 227.977 101.876 223.497 98.9634C218.971 96.1979 215.198 92.3071 212.526 87.6505C210.084 82.7335 208.779 77.3058 208.711 71.7881C208.64 67.609 209.388 63.4579 210.912 59.5814C212.436 55.7049 214.705 52.1823 217.583 49.223C220.333 46.3643 223.606 44.0894 227.213 42.5282C230.821 40.967 234.693 40.1501 238.609 40.1241C242.525 40.1152 246.403 40.9164 250.011 42.4798C253.619 44.0432 256.882 46.3366 259.605 49.223C262.503 52.1676 264.784 55.6876 266.309 59.5675C267.835 63.4475 268.572 67.6058 268.477 71.7881C268.589 77.3589 267.186 82.8516 264.426 87.6505ZM462.561 113.249H472.527V2H462.472L462.561 113.249Z';
// palette (light Cochl press)
const INK='#0F1B3D', INDIGO='#4B68FF', PURPLE='#832BFB', GRAY='#5B6478', PANEL='#EEF2FF', PANEL2='#F4F7FF', LINE='#D7E0F7';
const SANS="'IBM Plex Sans','Helvetica Neue',Arial,sans-serif", MONO="'IBM Plex Mono','SF Mono',monospace";
const DEFS=`<defs>
 <linearGradient id="cg" x1="2" y1="69.5" x2="89.1" y2="69.5" gradientUnits="userSpaceOnUse"><stop stop-color="#9827FF"/><stop offset="0.5" stop-color="#4B7EFF"/><stop offset="1" stop-color="#00D7FF"/></linearGradient>
 <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#832BFB"/><stop offset="1" stop-color="#4B68FF"/></linearGradient>
 <pattern id="hatch" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="13" stroke="#4B68FF" stroke-opacity="0.16" stroke-width="1.4"/></pattern>
 <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#0F1B3D" stop-opacity="0.5"/><stop offset="1" stop-color="#0F1B3D" stop-opacity="0"/></linearGradient>
</defs>`;
const esc=(t)=>String(t).replace(/&(?!#?\w+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// Cochl logo: gradient disc symbol + wordmark/dot in `color` (dark on light pages, white on the cover photo).
const BLACK='#0b0b12';
const logo=(x,y,h,color=BLACK)=>`<g id="logo" transform="translate(${x},${y}) scale(${h/116})"><path d="${SYMB}" fill="url(#cg)"/><path d="${WORD}" fill="${color}"/><circle cx="499.067" cy="102.831" r="10.9334" fill="${color}"/></g>`;
const mark=(cx,cy,s)=>`<g transform="translate(${cx-s/2},${cy-s/2}) scale(${s/92})"><path d="${SYMB}" fill="url(#cg)"/></g>`; // gradient disc
const tx=(x,y,size,wt,fill,text,{f,anchor,ls,up}={})=>`<text x="${x}" y="${y}" font-family="${f==='mono'?MONO:SANS}" font-size="${size}" font-weight="${wt}" fill="${fill}"${anchor?` text-anchor="${anchor}"`:''}${ls?` letter-spacing="${ls}"`:''}${up?` style="text-transform:uppercase"`:''}>${esc(text)}</text>`;
// vertical spine text reading top→bottom on the right band
const spineTxt=(cx,topY,text,color,size)=>`<text transform="translate(${cx},${topY}) rotate(90)" font-family="${SANS}" font-weight="800" font-size="${size}" letter-spacing="6" fill="${color}">${esc(text)}</text>`;
const spineTxtThin=(cx,topY,text,color,size)=>`<text transform="translate(${cx},${topY}) rotate(90)" font-family="${SANS}" font-weight="400" font-size="${size}" letter-spacing="8" fill="${color}">${esc(text)}</text>`;
// light image drop-zone (hatch + corner ticks + photo icon + caption)
function imgBox(id,x,y,w,h,caption,corner){
  const t=13,cn=(a,b,c,d)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${INDIGO}" stroke-opacity="0.6" stroke-width="2"/>`;
  const lx=corner?x+34:x+w/2, ly=corner?y+46:y+h/2, anc=corner?'start':'middle';
  return `<g id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PANEL}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hatch)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${LINE}" stroke-width="1.5"/>`
   +cn(x,y+t,x,y)+cn(x,y,x+t,y)+cn(x+w-t,y,x+w,y)+cn(x+w,y,x+w,y+t)+cn(x,y+h-t,x,y+h)+cn(x,y+h,x+t,y+h)+cn(x+w-t,y+h,x+w,y+h)+cn(x+w,y+h,x+w,y+h-t)
   +`<g transform="translate(${corner?lx+8:lx},${ly-30})" stroke="${INDIGO}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"><circle cx="-9" cy="-6" r="4"/><polyline points="-22,14 -2,-6 10,6 16,0 24,10"/></g>`
   +tx(lx,ly+8,12,'500',GRAY,'IMAGE',{f:'mono',anchor:anc,ls:'3'})+tx(lx,ly+26,10.5,'400',GRAY,caption,{f:'mono',anchor:anc})+`</g>`;
}
const NI=(x,y,size=10.5,anchor)=>tx(x,y,size,'500',INDIGO,'[NEEDS INPUT]',{f:'mono',anchor,ls:'0.5'});
const open=()=>`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${DEFS}<rect width="${W}" height="${H}" fill="#ffffff"/>`;
const foot=(dark)=>tx(M,H-30,10,'400',dark?'#fff':GRAY,'www.cochl.ai',{f:'mono',ls:'1'});
const pages={};

// ── Page 1 — COVER ──
{let s=open();
 // full-bleed image zone (top ~72%), behind everything — centered caption avoids the logo
 s+=imgBox('image-cover',0,0,SX,560,'cover photo · 표지 이미지');
 // top scrim so the white logo stays legible over any photo
 s+=`<rect x="0" y="0" width="${SX}" height="150" fill="url(#scrim)"/>`;
 // right spine band (gradient), vertical MEDIA KIT
 s+=`<rect x="${SX}" y="0" width="${SPINE}" height="${H}" fill="url(#ig)"/>`;
 s+=spineTxt(SX+50,110,'MEDIA KIT','#fff',30);
 // bottom band (white) with title + tagline
 s+=`<rect x="0" y="560" width="${SX}" height="${H-560}" fill="#fff"/>`;
 s+=tx(M,660,84,'800',INDIGO,'COCHL',{});
 s+=`<line x1="${M}" y1="694" x2="${SX-40}" y2="694" stroke="${LINE}" stroke-width="1.5"/>`;
 s+=tx(M,740,26,'600',INK,'Creating ears for AI',{});
 // white cochl logo rotated 90° on the spine, bottom (matches Figma placement)
 s+=`<g id="logo" transform="translate(589,662) rotate(90) scale(0.1953)"><path d="${SYMB}" fill="url(#cg)"/><path d="${WORD}" fill="#fff"/><circle cx="499.067" cy="102.831" r="10.9334" fill="#fff"/></g>`;
 s+='</svg>';pages['1-cover.svg']=s;}

// ── shared inner spine (thin rule + vertical COCHL / MEDIA KIT) ──
const innerSpine=()=>`<line x1="${SX}" y1="40" x2="${SX}" y2="${H-40}" stroke="${LINE}" stroke-width="1.5"/>`
  +spineTxt(SX+46,60,'SUBTITLE',INK,20)+spineTxtThin(SX+41,214,'MEDIA KIT',GRAY,13)+mark(SX+37,H-70,34);
const header=(s,l1,l2)=>{ s+=logo(M,44,24); let y=150;
  s+=tx(M,y,60,'800',INDIGO,l1,{}); if(l2){y+=64;s+=tx(M,y,60,'800',INDIGO,l2,{});}
  s+=`<line x1="${M}" y1="${y+26}" x2="${SX-40}" y2="${y+26}" stroke="${LINE}" stroke-width="1.5"/>`; return [s,y+26]; };

// ── Page 2 — TABLE OF CONTENTS ──
{let s=open(); let y; [s,y]=header(s,'TABLE OF','CONTENTS');
 const items=[['01','About Cochl'],['02','Traction & Recognition'],['03','Contact & Press']];
 let iy=y+90; items.forEach(([n,t])=>{
   s+=`<line x1="${M}" y1="${iy-30}" x2="${SX-40}" y2="${iy-30}" stroke="${LINE}" stroke-width="1"/>`;
   s+=tx(M,iy,22,'700',INDIGO,n+'.',{})+tx(M+52,iy,22,'400',INK,t,{}); iy+=66; });
 s+=`<line x1="${M}" y1="${iy-30}" x2="${SX-40}" y2="${iy-30}" stroke="${LINE}" stroke-width="1"/>`;
 s+=innerSpine(); s+=foot(false); s+='</svg>';pages['2-contents.svg']=s;}

// ── Page 3 — ABOUT ──
{let s=open();
 // right photo zone + spine (narrow column so body text clears it)
 const aix=SX-168;
 s+=imgBox('image-about',aix,0,168,462,'team / product · 이미지','corner');
 s+=`<line x1="${SX}" y1="40" x2="${SX}" y2="${H-40}" stroke="${LINE}" stroke-width="1.5"/>`+spineTxt(SX+46,60,'SUBTITLE',INK,20)+spineTxtThin(SX+41,214,'MEDIA KIT',GRAY,13);
 s+=logo(M,44,24);
 s+=tx(M,150,60,'800',INDIGO,'ABOUT',{})+tx(M,214,60,'800',INDIGO,'COCHL',{});
 s+=`<line x1="${M}" y1="240" x2="${aix-24}" y2="240" stroke="${LINE}" stroke-width="1.5"/>`;
 // body (factual, safe) — wrapped to clear the image column
 const body=['Cochl is a sound AI company. Its','technology recognizes and','understands everyday, non-speech','sound in real time — giving machines','the ability to interpret the physical','world through audio: across safety,','security, industrial, mobility, and','consumer products.'];
 body.forEach((l,k)=>{ s+=tx(M,286+k*24,15,'400',INK,l||' ',{}); });
 // bottom split: stats (gray) + notable clients (indigo)
 const by=500, bh=H-by; const half=SX/2;
 s+=`<rect x="0" y="${by}" width="${half}" height="${bh}" fill="${PANEL2}"/>`;
 s+=`<rect x="${half}" y="${by}" width="${SX-half}" height="${bh}" fill="url(#ig)"/>`;
 // stats
 const stats=[['Sounds & scenes recognized'],['Third-party integrations'],['Deployments in production']];
 stats.forEach((st,k)=>{ const yy=by+70+k*74;
   s+=NI(M,yy)+tx(M,yy+22,13,'400',GRAY,st[0],{}); });
 // clients
 s+=tx(half+30,by+64,26,'800','#fff','NOTABLE',{})+tx(half+30,by+92,26,'800','#fff','CLIENTS',{});
 ['[NEEDS INPUT]','[NEEDS INPUT]','[NEEDS INPUT]'].forEach((c,k)=>{ s+=tx(half+30,by+134+k*30,13,'400','#fff','•  '+c,{f:'mono'}); });
 s+=mark(SX+37,H-70,34)+foot(false); s+='</svg>';pages['3-about.svg']=s;}

// ── Page 4 — VALUABLE FEEDBACK / PRESS ──
{let s=open();
 s+=logo(M,44,24);
 s+=tx(M,150,60,'800',INDIGO,'IN THE',{})+tx(M,214,60,'800',INDIGO,'PRESS',{});
 s+=`<line x1="${M}" y1="240" x2="${SX-40}" y2="240" stroke="${LINE}" stroke-width="1.5"/>`;
 // two testimonial/quote blocks (photo zone + quote panel)
 const blocks=[[280, false],[520, true]];
 blocks.forEach(([by,flip])=>{
   const pw=150, ph=170, gap=18;
   const px = flip ? M : M; // keep photo left for both for simplicity of columns
   const imgX = flip ? SX-40-pw : M;
   const panX = flip ? M : M+pw+gap;
   const panW = (SX-40)-(M+pw+gap);
   s+=imgBox(`image-quote-${by}`, imgX, by, pw, ph, 'headshot','corner');
   s+=`<rect x="${panX}" y="${by}" width="${panW}" height="${ph}" fill="url(#ig)"/>`;
   const q=['“Add a confirmed press quote or customer','testimonial here. Keep it to 3–4 lines so it','stays readable at print size.”'];
   q.forEach((l,k)=>{ s+=tx(panX+24,by+40+k*22,13.5,'400','#fff',l,{}); });
   s+=tx(panX+24,by+ph-46,13,'700','#fff','[NEEDS INPUT] — Name, Title',{});
   s+=tx(panX+24,by+ph-26,11,'400','rgba(255,255,255,0.85)','Publication / Company',{f:'mono'});
 });
 s+=innerSpine()+foot(false); s+='</svg>';pages['4-press.svg']=s;}

// ── Page 5 — CONTACT ──
{let s=open();
 s+=logo(M,44,24);
 s+=tx(M,150,60,'800',INDIGO,'CONTACT',{})+tx(M,214,60,'800',INDIGO,'US',{});
 s+=`<line x1="${M}" y1="262" x2="${SX-40}" y2="262" stroke="${LINE}" stroke-width="1.5"/>`;
 s+=tx(M,318,15.5,'400',INK,'For press or media queries, email',{});
 s+=tx(M,344,15.5,'700',INDIGO,'contact@cochl.ai',{})+tx(M+160,344,11,'400',GRAY,' · confirm address',{f:'mono'})+NI(M+300,344);
 s+=`<line x1="${M}" y1="380" x2="${SX-40}" y2="380" stroke="${LINE}" stroke-width="1"/>`;
 s+=tx(M,438,26,'800',INDIGO,'DOWNLOADABLES',{});
 s+=tx(M,470,15.5,'400',INK,'Logos  |  Brand assets  |  Images  |  Fact sheet',{});
 s+=`<line x1="${M}" y1="504" x2="${SX-40}" y2="504" stroke="${LINE}" stroke-width="1"/>`;
 s+=tx(M,562,26,'800',INDIGO,'SOCIAL',{});
 // simple social glyphs (rounded squares w/ letters) as placeholders
 const socials=['in','X','▶','f']; socials.forEach((g,k)=>{ const cx=M+22+k*54;
   s+=`<rect x="${cx-20}" y="580" width="40" height="40" rx="10" fill="${INK}"/>`+tx(cx,607,16,'700','#fff',g,{anchor:'middle'}); });
 s+=tx(M,650,11,'400',GRAY,'Confirm official handles',{f:'mono'})+NI(M+250,650);
 s+=`<line x1="${M}" y1="676" x2="${SX-40}" y2="676" stroke="${LINE}" stroke-width="1"/>`;
 s+=innerSpine()+foot(false); s+='</svg>';pages['5-contact.svg']=s;}

for(const [n,svg] of Object.entries(pages)) writeFileSync(`${OUT}/pages/cochl-media-kit_${n}`,svg);
console.log('✓ wrote',Object.keys(pages).length,'press-kit pages to',OUT+'/pages');
Object.keys(pages).forEach(n=>console.log('  ·',n));
