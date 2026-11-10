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
// LKM
const ta=(l,ph='')=>`<label>${l}</label><textarea data-l="${esc(l)}" placeholder="${ph}"></textarea>`;
const tf=(l,x='')=>`<label>${l}</label><input data-l="${esc(l)}" ${x}>`;
const ph=(n)=>`<h3 data-h>${n}</h3>`;
function buatLKM(){let h=`<h2>Lembar Kerja Murid (LKM)</h2><p>Topik: Arsitektur Von Neumann dan Dinamika Input–Process–Output · Kelas X / Fase E</p>
<div class="card c-b"><h3>Tujuan Pembelajaran</h3><ul><li>Menentukan perangkat input, process, dan output yang sesuai untuk kebutuhan dengan tepat.</li><li>Menilai kesesuaian spesifikasi komputer dengan kebutuhan pengguna berdasarkan informasi yang tersedia dengan alasan logis.</li></ul></div>
<div class="card c-y"><h3>Petunjuk dan Protokol K3</h3><ul><li>Kerjakan secara berkelompok; semua anggota wajib berpartisipasi.</li><li>Gunakan informasi di website ini untuk mendukung jawaban, lalu siapkan untuk presentasi.</li><li>Jangan menyentuh, mencabut, atau memasang kabel dan komponen tanpa izin guru.</li><li>Jangan membongkar perangkat yang masih terhubung listrik.</li><li>Jaga posisi duduk dan jarak pandang; saling menghargai dan tidak berebut perangkat.</li></ul></div>
<form id="lkmForm" class="card c-r" onsubmit="return false">${ph('Identitas Kelompok')}<div class="row">${tf('Nama kelompok')}${tf('Kelas')}</div><label>Anggota dan peran</label>`;
 for(let i=1;i<=6;i++)h+=`<div class="row3"><input class="ma" type="number" placeholder="Absen"><input class="mn" placeholder="Nama anggota ${i}${i>3?' (opsional)':''}"><select class="mp"><option value="">Pilih peran</option>${PERAN.map(p=>`<option>${p}</option>`).join('')}</select></div>`;
 h+=`${ph('TAHAP 1 – Menentukan Perangkat Input, Process, dan Output')}<div id="lkm-dev" class="card c-g"><b>Kenali perangkat dulu</b><div id="lkm-devs"></div></div>
<p><b>Skenario pengguna</b></p>`+KASUS.map((k,i)=>`<div class="card c-b"><b>Kasus ${i+1} – ${k[0]}</b><p>${k[1]}</p></div>`).join('')+
 `${ph('Tugas 1.1 – Tentukan Perangkat I-P-O')}`+KASUS.map(k=>`<div class="card c-o"><b>${k[0]}</b>${ta(k[0]+': Perangkat input')}${ta(k[0]+': Komponen process (dan alasannya)')}${ta(k[0]+': Perangkat output')}${ta(k[0]+': Alasan pemilihan (hubungkan dengan kebutuhan)')}</div>`).join('')+
 `${ph('Tugas 1.2 – Telusuri Alur Data')}<label>Skenario yang dipilih</label><select data-l="Skenario simulasi">${KASUS.map(k=>`<option>${k[0]}</option>`).join('')}</select>`+
 ['Input','Data/program dimuat','Proses eksekusi','Output'].map((s,i)=>`<div class="card c-p"><b>Langkah ${i+1}: ${s}</b>${ta('Langkah '+(i+1)+' ('+s+') – apa yang terjadi?')}${tf('Langkah '+(i+1)+' ('+s+') – komponen yang berperan')}</div>`).join('')+
 `${ph('Tugas 1.3 – Uji Pemahaman')}${ta('1. Mengapa kasir tidak harus memakai GPU dedicated, sedangkan gamers membutuhkannya?')}${ta('2. Satu perangkat yang berperan sebagai input sekaligus output, dan alasannya')}${ta('3. Perbedaan peran RAM dan SSD saat aplikasi dijalankan')}${ta('Kesimpulan kelompok Tahap 1 (1–2 kalimat)')}
 ${ph('TAHAP 2 – Menilai Kesesuaian Spesifikasi Komputer')}<div class="card c-y"><b>Studi kasus: Pengadaan komputer Laboratorium Informatika</b><p>Komputer dipakai untuk mengetik dan presentasi, pemrograman (editor kode dan Python), peramban dengan beberapa tab, aplikasi perkantoran, simulator sederhana, serta editing gambar dan video dasar. Sekolah menerima dua penawaran.</p><div class="sc"><table class="sp"><tr><th>Spesifikasi</th><th>Komputer A</th><th>Komputer B</th></tr>${SPEK.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table></div></div>
 ${ph('Tugas 2.1 – Analisis Spesifikasi')}`+['Prosesor','RAM','Penyimpanan','Grafis','Harga','Kesesuaian dengan kebutuhan'].map(a=>`<div class="card c-b"><b>${a}</b><div class="row"><div>${ta(a+' – Komputer A')}</div><div>${ta(a+' – Komputer B')}</div></div></div>`).join('')+
 `<div class="card c-p"><b>Tips analisis</b><p>Jangan hanya memilih spesifikasi tertinggi. Nilailah kesesuaian antara kemampuan komputer, kebutuhan pengguna, dan anggaran.</p></div>
 ${ph('Tugas 2.2 – Berikan Penilaian')}${ta('a. Komputer yang lebih sesuai untuk laboratorium')}${ta('b. Kelebihan dan kekurangan masing-masing komputer')}${ta('c. Apakah spesifikasi lebih tinggi selalu terbaik? Jelaskan')}${ta('d. Alasan yang mendukung keputusan kelompok')}
 ${ph('Tugas 2.3 – Rekomendasi dan Pertimbangan')}${tf('1. Penawaran yang direkomendasikan')}${tf('2a. Alasan objektif pertama')}${tf('2b. Alasan objektif kedua')}${tf('2c. Alasan objektif ketiga')}${ta('3. Kekurangan/risiko pilihan kelompok dan cara mengatasinya')}${ta('4. Informasi tambahan yang masih diperlukan')}
 ${ph('Refleksi Kelompok')}${ta('1. Pemahaman baru tentang komponen penyusun komputer')}${ta('2. Mengapa memahami fungsi komponen penting sebelum membeli komputer?')}${ta('3. Cara kelompok mengambil keputusan saat berbeda pendapat')}</form>
 <div class="actions"><button class="g" id="kirimLkm">📤 Kirim ke guru</button><button class="b" id="unduhLkm">⬇️ Download PDF</button></div>`;
 $('#lkm').innerHTML=h;
 $('#lkm-devs').innerHTML=['in','pr','out'].map(t=>`<span class="tag" style="background:${TIPE[t][1]}">${TIPE[t][0]}</span><div class="dev-g">`+PERANGKAT.filter(p=>p[3]===t).map(p=>`<div class="dev t-${t}"><div class="ic"><img src="assets/devices/${p[0]}.png" alt="${p[2]}" onerror="this.replaceWith('${p[1]}')"></div><b>${p[2]}</b><small>${p[4]}</small></div>`).join('')+'</div>').join('');
 $('#unduhLkm').onclick=()=>{const d=buatPDF();if(d)d.doc.save(d.nama)};
 $('#kirimLkm').onclick=async e=>{const d=buatPDF();if(!d)return;e.target.disabled=true;
  const ok=await kirim({type:'lkm',kelompok:d.kel,kelas:d.kls,anggota:d.ang,filename:d.nama,pdf:d.doc.output('datauristring').split(',')[1]});
  e.target.disabled=false;if(ok)toast('LKM terkirim ke guru ✅')}}
function buatPDF(){const f=$('#lkmForm'),kel=$('[data-l="Nama kelompok"]').value.trim(),kls=$('[data-l="Kelas"]').value.trim();
 const mem=$$('.row3',f).map(r=>({a:$('.ma',r).value,n:$('.mn',r).value.trim(),p:$('.mp',r).value})).filter(m=>m.n);
 if(!kel||!kls||!mem.length||mem.some(m=>!m.p||!m.a)){toast('Lengkapi nama kelompok, kelas, serta absen, nama, dan peran anggota.');scrollTo(0,$('#lkm').offsetTop);return null}
 const {jsPDF}=window.jspdf,doc=new jsPDF({unit:'pt',format:'a4'});
 doc.setFontSize(15);doc.text('LEMBAR KERJA MURID (LKM) – Informatika Fase E',40,42);doc.setFontSize(10);doc.text('Arsitektur Von Neumann dan Dinamika Input–Process–Output',40,58);
 const body=[[{content:'Anggota dan peran',colSpan:2,styles:{fillColor:[155,93,229],textColor:255}}]];
 mem.forEach(m=>body.push([m.a,m.n+' – '+m.p]));
 $$('h3[data-h],[data-l]',f).forEach(el=>{if(el.matches('h3'))body.push([{content:el.textContent,colSpan:2,styles:{fillColor:[77,150,255],textColor:255,fontStyle:'bold'}}]);else if(el.dataset.l!=='Nama kelompok'&&el.dataset.l!=='Kelas')body.push([el.dataset.l,el.value||'-'])});
 doc.autoTable({startY:70,head:[['Kelompok',kel+' (Kelas '+kls+')']],body,styles:{fontSize:9,cellPadding:4},columnStyles:{0:{cellWidth:190}},headStyles:{fillColor:[255,107,157]}});
 return{doc,kel,kls,ang:mem.map(m=>`${m.a}. ${m.n} (${m.p})`).join('; '),nama:`LKM_${kls}_${kel}.pdf`.replace(/[^\w.\-]+/g,'_')}}
buatLKM();route();
