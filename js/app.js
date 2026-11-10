const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3500)}
async function kirim(data){ if(APPS_SCRIPT_URL.startsWith('ISI_')){toast('URL Apps Script belum diisi di js/config.js');return false}
 try{await fetch(APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',body:JSON.stringify(data)});return true}catch(e){toast('Gagal mengirim. Periksa koneksi internet.');return false}}
// Router
function route(){const id=(location.hash||'#beranda').slice(1);const ok=$('#'+id)?id:'beranda';
 $$('section').forEach(s=>s.classList.toggle('on',s.id===ok));$$('#nav a').forEach(a=>a.classList.toggle('on',a.hash==='#'+ok));scrollTo(0,0)}
addEventListener('hashchange',route);
// Perangkat
const TIPE={in:['Input','var(--grn)'],pr:['Process','var(--blue)'],out:['Output','var(--pink)']};
$('#devices').innerHTML=['in','pr','out'].map(t=>`<span class="tag" style="background:${TIPE[t][1]}">${TIPE[t][0]}</span><div class="dev-g">`+PERANGKAT.filter(p=>p[3]===t).map(p=>`<div class="dev t-${t}"><div class="ic"><img src="assets/devices/${p[0]}.png" alt="${p[2]}" onerror="this.replaceWith('${p[1]}')"></div><b>${p[2]}</b><small>${p[4]}</small></div>`).join('')+'</div>').join('');
// Tes
function buatTes(id,jenis,judul){const s=$('#'+id);
 s.innerHTML=`<h2>${judul}</h2><div class="card c-r"><div class="row"><div><label>Nama</label><input id="${id}-n"></div><div><label>No. absen</label><input id="${id}-a" type="number" min="1"></div><div><label>Kelas</label><input id="${id}-k" placeholder="mis. X-1"></div></div></div><div id="${id}-q"></div><button class="g" id="${id}-b">Kirim jawaban</button><div id="${id}-r"></div>`;
 $('#'+id+'-q').innerHTML=SOAL.map((q,i)=>`<div class="q" id="${id}-q${i}"><p>${i+1}. ${esc(q[0]).replace(/\n/g,'<br>')}</p>`+q[1].map((o,j)=>`<label class="opt"><input type="radio" name="${id}${i}" value="${j}"><span>${'ABCD'[j]}. ${esc(o)}</span></label>`).join('')+'</div>').join('');
 $('#'+id+'-b').onclick=async()=>{const n=$('#'+id+'-n').value.trim(),a=$('#'+id+'-a').value.trim(),k=$('#'+id+'-k').value.trim();
  if(!n||!a||!k)return toast('Isi nama, nomor absen, dan kelas dulu.');
  let benar=0,kosong=0;SOAL.forEach((q,i)=>{const c=$(`input[name=${id}${i}]:checked`);$('#'+id+'-q'+i).classList.toggle('miss',!c);if(!c)kosong++;else if(+c.value===q[2])benar++});
  if(kosong)return toast(`Masih ${kosong} soal belum dijawab.`);
  const skor=benar*100/SOAL.length;$('#'+id+'-b').disabled=true;
  $('#'+id+'-r').innerHTML=`<div class="score">Skor kamu<br><b>${skor}</b><br>${benar} dari ${SOAL.length} soal benar 🎉</div>`;
  await kirim({type:'test',jenis,nama:n,absen:a,kelas:k,skor,benar});scrollTo({top:document.body.scrollHeight,behavior:'smooth'})}}
buatTes('pretest','pre','Pre-test');buatTes('posttest','post','Post-test');
// LKM (tabel). Form dan PDF dibuat dari struktur HTML yang sama.
const COL={b:['#4D96FF',[77,150,255]],g:['#6BCB77',[107,203,119]],o:['#FF9F45',[255,159,69]],p:['#9B5DE5',[155,93,229]],r:['#FF6B9D',[255,107,157]],y:['#F2A900',[242,169,0]]};
const H=(t,c)=>`<h3 class="bh" data-c="${c}" style="background:${COL[c][0]}">${t}</h3>`;
const I=(t,x,c='y')=>`<div class="card info c-${c}"><b>${t}</b><p>${x}</p></div>`;
const TB=(head,rows,c,x='')=>`<div class="sc"><table class="lt ${x}" data-c="${c}"><thead><tr>${head.map(h=>`<th style="background:${COL[c][0]}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(d=>`<td>${d===null?'<textarea></textarea>':d}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const QA=(rows,c)=>TB(['Pertanyaan','Jawaban'],rows.map(r=>[r,null]),c);
function buatLKM(){
 const mem=[1,2,3,4,5,6].map(i=>[`<input type="number" min="1" placeholder="Absen">`,`<input placeholder="Nama anggota ${i}${i>3?' (opsional)':''}">`,`<select><option value="">Pilih peran</option>${PERAN.map(p=>`<option>${p}</option>`).join('')}</select>`]);
 const h=`<h2>Lembar Kerja Murid (LKM)</h2><p>Topik: Arsitektur Von Neumann dan Dinamika Input–Process–Output · Kelas X / Fase E</p>
<div class="card c-b"><h3>Tujuan Pembelajaran</h3><ul><li>Menentukan perangkat input, process, dan output yang sesuai untuk kebutuhan dengan tepat.</li><li>Menilai kesesuaian spesifikasi komputer dengan kebutuhan pengguna berdasarkan informasi yang tersedia dengan alasan logis.</li></ul></div>
<div class="card c-y"><h3>Petunjuk dan Protokol K3</h3><ul><li>Kerjakan secara berkelompok; semua anggota wajib berpartisipasi.</li><li>Gunakan informasi di website ini untuk mendukung jawaban, lalu siapkan untuk presentasi.</li><li>Jangan menyentuh, mencabut, atau memasang kabel dan komponen tanpa izin guru.</li><li>Jangan membongkar perangkat yang masih terhubung listrik.</li><li>Jaga posisi duduk dan jarak pandang; saling menghargai dan tidak berebut perangkat.</li></ul></div>
<form id="lkmForm" onsubmit="return false">${H('Identitas Kelompok','r')}
${TB(['Identitas','Isian'],[['Nama kelompok','<input>'],['Kelas','<input placeholder="mis. X-1">']],'r')}
${TB(['No. absen','Nama anggota','Peran'],mem,'p','free')}
${H('TAHAP 1 – Menentukan Perangkat Input, Process, dan Output','g')}
<div class="card c-g"><b>Kenali perangkat dulu</b><div id="lkm-devs"></div></div>
${KASUS.map((k,i)=>I(`Kasus ${i+1} – ${k[0]}`,k[1],'b')).join('')}
${H('Tugas 1.1 – Tentukan Perangkat I-P-O','o')}
${TB(['Pengguna','Perangkat input','Komponen process (dan alasannya)','Perangkat output','Alasan pemilihan (hubungkan dengan kebutuhan)'],KASUS.map(k=>[k[0],null,null,null,null]),'o')}
${H('Tugas 1.2 – Telusuri Alur Data','p')}
${TB(['Skenario yang dipilih'],[[`<select>${KASUS.map(k=>`<option>${k[0]}</option>`).join('')}</select>`]],'p','free')}
${TB(['Langkah','Apa yang terjadi?','Komponen yang berperan'],['1. Input','2. Data/program dimuat','3. Proses eksekusi','4. Output'].map(s=>[s,null,null]),'p')}
${H('Tugas 1.3 – Uji Pemahaman','b')}
${QA(['1. Mengapa kasir tidak harus memakai komputer dengan GPU dedicated, sedangkan gamers membutuhkannya?','2. Sebutkan satu perangkat yang berperan sebagai input sekaligus output, lalu jelaskan alasannya.','3. Apa perbedaan peran RAM dan SSD saat sebuah aplikasi dijalankan?','Kesimpulan kelompok (1–2 kalimat)'],'b')}
${H('TAHAP 2 – Menilai Kesesuaian Spesifikasi Komputer','g')}
${I('Studi kasus: Pengadaan Komputer Laboratorium Informatika','Sekolah akan membeli komputer baru untuk mengetik dan presentasi, pemrograman (editor kode dan Python), peramban dengan beberapa tab, aplikasi perkantoran, simulator sederhana, serta editing gambar dan video dasar. Sekolah menerima dua penawaran.')}
${TB(['Spesifikasi','Komputer A','Komputer B'],SPEK,'y')}
${H('Tugas 2.1 – Analisis Spesifikasi','o')}
${TB(['Aspek','Komputer A','Komputer B'],['Prosesor','RAM','Penyimpanan','Grafis','Harga','Kesesuaian dengan kebutuhan'].map(a=>[a,null,null]),'o')}
${I('Tips analisis','Jangan hanya memilih spesifikasi tertinggi. Nilailah kesesuaian antara kemampuan komputer, kebutuhan pengguna, dan anggaran.','p')}
${H('Tugas 2.2 – Berikan Penilaian','p')}
${QA(['a. Komputer manakah yang lebih sesuai untuk kebutuhan laboratorium sekolah?','b. Apa kelebihan dan kekurangan masing-masing komputer?','c. Apakah komputer dengan spesifikasi lebih tinggi selalu menjadi pilihan terbaik? Jelaskan.','d. Alasan yang mendukung keputusan kelompok'],'p')}
${H('Tugas 2.3 – Rekomendasi dan Pertimbangan','b')}
${QA(['1. Penawaran yang direkomendasikan','2a. Alasan objektif pertama (berdasarkan data)','2b. Alasan objektif kedua','2c. Alasan objektif ketiga','3. Kekurangan/risiko pilihan kelompok dan cara mengatasinya','4. Informasi tambahan yang masih diperlukan'],'b')}
${H('Refleksi Kelompok','r')}
${QA(['1. Pemahaman baru tentang komponen penyusun komputer','2. Mengapa memahami fungsi komponen penting sebelum memilih atau membeli komputer?','3. Cara kelompok mengambil keputusan ketika berbeda pendapat'],'r')}
</form><div class="actions"><button class="g" id="kirimLkm">📤 Kirim ke guru</button><button class="b" id="unduhLkm">⬇️ Download PDF</button></div>`;
 $('#lkm').innerHTML=h;
 $('#lkm-devs').innerHTML=['in','pr','out'].map(t=>`<span class="tag" style="background:${TIPE[t][1]}">${TIPE[t][0]}</span><div class="dev-g">`+PERANGKAT.filter(p=>p[3]===t).map(p=>`<div class="dev t-${t}"><div class="ic"><img src="assets/devices/${p[0]}.png" alt="${p[2]}" onerror="this.replaceWith('${p[1]}')"></div><b>${p[2]}</b><small>${p[4]}</small></div>`).join('')+'</div>').join('');
 $('#unduhLkm').onclick=()=>{const d=buatPDF();if(d)d.doc.save(d.nama)};
 $('#kirimLkm').onclick=async e=>{const d=buatPDF();if(!d)return;e.target.disabled=true;
  const ok=await kirim({type:'lkm',kelompok:d.kel,kelas:d.kls,anggota:d.ang,filename:d.nama,pdf:d.doc.output('datauristring').split(',')[1]});
  e.target.disabled=false;if(ok)toast('LKM terkirim ke guru ✅')}}
function buatPDF(){const f=$('#lkmForm'),tbs=$$('table.lt',f),v=c=>{const x=c.querySelector('textarea,input,select');return (x?x.value:c.textContent).trim()};
 const idr=$$('tbody tr',tbs[0]),kel=v($$('td',idr[0])[1]),kls=v($$('td',idr[1])[1]);
 const mem=$$('tbody tr',tbs[1]).map(r=>$$('td',r).map(v)).filter(r=>r.some(Boolean));
 if(!kel||!kls||!mem.length||mem.some(r=>!r[0]||!r[1]||!r[2])){toast('Lengkapi nama kelompok, kelas, serta absen, nama, dan peran anggota.');scrollTo(0,$('#lkm').offsetTop);return null}
 const doc=new window.jspdf.jsPDF({unit:'pt',format:'a4'});
 doc.setFillColor(155,93,229);doc.rect(0,0,595,70,'F');doc.setFillColor(255,217,61);doc.rect(0,70,595,5,'F');
 doc.setTextColor(255);doc.setFont(undefined,'bold');doc.setFontSize(18);doc.text('LEMBAR KERJA MURID (LKM)',40,32);
 doc.setFont(undefined,'normal');doc.setFontSize(10);doc.text('Informatika Fase E (Kelas X) · Arsitektur Von Neumann dan Dinamika Input–Process–Output',40,52);
 let y=92;const at=o=>{doc.autoTable({startY:y,margin:{left:40,right:40},theme:'grid',styles:{fontSize:9,cellPadding:5,lineColor:[220,220,235],lineWidth:.5,valign:'top',textColor:[43,45,66]},...o});y=doc.lastAutoTable.finalY+10};
 [...f.children].forEach(el=>{
  if(el.matches('h3.bh'))at({body:[[{content:el.textContent,styles:{fillColor:COL[el.dataset.c][1],textColor:255,fontStyle:'bold',fontSize:11}}]]});
  else if(el.matches('.info'))at({body:[[{content:$('b',el).textContent+'\n'+$('p',el).textContent,styles:{fillColor:[255,248,220]}}]]});
  else if(el.matches('.sc')){const t=$('table',el),c=COL[t.dataset.c][1],free=t.classList.contains('free');
   const body=t===tbs[1]?mem:$$('tbody tr',t).map(r=>$$('td',r).map(v));
   at({head:[$$('th',t).map(th=>th.textContent)],body,headStyles:{fillColor:c,textColor:255},columnStyles:free?{}:{0:{fontStyle:'bold',fillColor:[255,246,214],cellWidth:120}}})}});
 const n=doc.getNumberOfPages();for(let i=1;i<=n;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(130);doc.text(`${kel} · Kelas ${kls} · halaman ${i}/${n}`,40,820)}
 return{doc,kel,kls,ang:mem.map(m=>`${m[0]}. ${m[1]} (${m[2]})`).join('; '),nama:`LKM_${kls}_${kel}.pdf`.replace(/[^\w.\-]+/g,'_')}}
buatLKM();route();

