
const jadwal = {
  1: [
    { id: "akuntansi", mulai: "12.30", selesai: "14.10", nama: "Pengantar Akuntansi dan Keuangan", dosen: "Novilia", ruang: "G.107A" },
    { id: "sip", mulai: "14.10", selesai: "15.50", nama: "Sistem Informasi Pariwisata", dosen: "Moh. Edi Saputro", ruang: "LPC" }
  ],
  2: [
    { id: "msdm", mulai: "09.10", selesai: "11.00", nama: "Manajemen Sumber Daya Manusia", dosen: "Dani Agung", ruang: "G.208" },
    { id: "inggris", mulai: "11.00", selesai: "12.30", nama: "Bahasa Inggris dan Praktikum Bahasa Inggris", dosen: "Eka", ruang: "G.107" }
  ],
  3: [
    { id: "agama", mulai: "10.00", selesai: "11.40", nama: "Agama", dosen: "Imam Wahyono", ruang: "G.201" },
    { id: "indonesia", mulai: "12.30", selesai: "14.10", nama: "Bahasa Indonesia", dosen: "Beby", ruang: "G.206" }
  ],
  4: [
    { id: "pancasila", mulai: "07.30", selesai: "09.10", nama: "Pancasila", dosen: "Ninik", ruang: "G.201" },
    { id: "kewarganegaraan", mulai: "12.30", selesai: "14.10", nama: "Kewarganegaraan", dosen: "Widhi Harsono", ruang: "G.601" },
    { id: "lintasbudaya", mulai: "14.10", selesai: "15.50", nama: "Pemahaman Lintas Budaya", dosen: "Wira", ruang: "G.601" }
  ],
  5: [],
  6: [],
  0: []
};

const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const $ = id => document.getElementById(id);
let tanggalTampil = awalHari(new Date());

function awalHari(tanggal) {
  return new Date(tanggal.getFullYear(), tanggal.getMonth(), tanggal.getDate());
}

function tambahHari(tanggal, jumlah) {
  const hasil = awalHari(tanggal);
  hasil.setDate(hasil.getDate() + jumlah);
  return hasil;
}

function tanggalKey(tanggal) {
  return `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, "0")}-${String(tanggal.getDate()).padStart(2, "0")}`;
}

function formatTanggal(tanggal) {
  return `${namaHari[tanggal.getDay()]}, ${tanggal.getDate()} ${namaBulan[tanggal.getMonth()]} ${tanggal.getFullYear()}`;
}

function kunci(jenis, tanggal, id) {
  return `dep1b-${jenis}-${tanggalKey(tanggal)}-${id}`;
}

function baca(key) {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function simpan(key, nilai) {
  try {
    if (nilai) localStorage.setItem(key, nilai);
    else localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function buat(tag, kelas, teks) {
  const elemen = document.createElement(tag);
  if (kelas) elemen.className = kelas;
  if (teks !== undefined) elemen.textContent = teks;
  return elemen;
}

function aturTanggal(tanggal) {
  tanggalTampil = awalHari(tanggal);
  $("pilihTanggal").value = tanggalKey(tanggalTampil);
  render();
}

function render() {
  const hariIni = awalHari(new Date());
  const besok = tambahHari(hariIni, 1);
  const mingguDepan = tambahHari(hariIni, 7);

  $("tanggal").textContent = formatTanggal(new Date());
  $("labelHariIni").textContent = namaHari[hariIni.getDay()];
  $("labelBesok").textContent = namaHari[besok.getDay()];

  const keyTampil = tanggalKey(tanggalTampil);
  const keyHariIni = tanggalKey(hariIni);
  const keyBesok = tanggalKey(besok);
  const keyMingguDepan = tanggalKey(mingguDepan);

  $("hariIni").classList.toggle("aktif", keyTampil === keyHariIni);
  $("hariBesok").classList.toggle("aktif", keyTampil === keyBesok);
  $("mingguDepan").classList.toggle("aktif", keyTampil === keyMingguDepan);

  $("judul").textContent =
    keyTampil === keyHariIni ? "Jadwal hari ini" :
    keyTampil === keyBesok ? "Jadwal besok" :
    keyTampil === keyMingguDepan ? "Jadwal minggu depan" : "Jadwal pilihan";

  $("subjudul").textContent = formatTanggal(tanggalTampil);

  const mataKuliah = jadwal[tanggalTampil.getDay()] || [];
  const daftar = $("daftarJadwal");
  daftar.replaceChildren();

  if (mataKuliah.length === 0) {
    const kosong = buat("div", "kosong");
    kosong.append(
      buat("div", "ikon", "☼"),
      buat("h3", "", "Tidak ada jadwal kuliah"),
      buat("p", "", `Belum ada mata kuliah yang tercatat untuk ${formatTanggal(tanggalTampil)}. Jika ada kuliah pengganti, kamu bisa menambahkannya pada bagian data jadwal di script.js.`)
    );
    daftar.append(kosong);
  }

  mataKuliah.forEach(matkul => {
    const keyCek = kunci("selesai", tanggalTampil, matkul.id);
    const keyCatatan = kunci("catatan", tanggalTampil, matkul.id);
    const sudah = baca(keyCek) === "ya";

    const kartu = buat("article", `kartu${sudah ? " selesai" : ""}`);

    const waktu = buat("div", "waktu");
    waktu.append(
      buat("strong", "", matkul.mulai),
      buat("small", "", "sampai"),
      buat("strong", "", matkul.selesai)
    );

    const info = buat("div", "info");
    info.append(buat("h3", "", matkul.nama));

    const meta = buat("div", "meta");
    meta.append(
      buat("span", "", `◉ ${matkul.dosen}`),
      buat("span", "", `⌖ ${matkul.ruang}`)
    );
    info.append(meta);

    const labelCek = buat("label", "kotak-cek");
    const cek = document.createElement("input");
    cek.type = "checkbox";
    cek.className = "cek";
    cek.checked = sudah;
    cek.setAttribute("aria-label", `Tandai ${matkul.nama} selesai`);
    const teksCek = buat("small", "", sudah ? "Selesai" : "Selesai?");
    labelCek.append(cek, teksCek);

    cek.addEventListener("change", () => {
      simpan(keyCek, cek.checked ? "ya" : "");
      kartu.classList.toggle("selesai", cek.checked);
      teksCek.textContent = cek.checked ? "Selesai" : "Selesai?";
      updateProgres(mataKuliah);
    });

    const bagianCatatan = buat("div", "catatan-matkul");
    const labelCatatan = buat("label", "", "📝 Catatan tugas / pengingat");
    const area = document.createElement("textarea");
    area.placeholder = "Contoh: rangkum materi bab 3, tugas kelompok dikumpulkan minggu depan...";
    area.value = baca(keyCatatan);
    area.setAttribute("aria-label", `Catatan tugas untuk ${matkul.nama} pada ${formatTanggal(tanggalTampil)}`);

    const status = buat("small", "status-catatan", area.value ? "Catatan tersimpan" : "Catatan disimpan otomatis saat kamu mengetik.");

    let timerSimpan;
    area.addEventListener("input", () => {
      status.textContent = "Menyimpan...";
      clearTimeout(timerSimpan);
      timerSimpan = setTimeout(() => {
        const berhasil = simpan(keyCatatan, area.value);
        status.textContent = berhasil ? "Catatan tersimpan otomatis" : "Penyimpanan browser tidak tersedia";
      }, 250);
    });

    bagianCatatan.append(labelCatatan, area, status);
    kartu.append(waktu, info, labelCek, bagianCatatan);
    daftar.append(kartu);
  });

  updateProgres(mataKuliah);
}

function updateProgres(mataKuliah) {
  const selesai = mataKuliah.filter(matkul =>
    baca(kunci("selesai", tanggalTampil, matkul.id)) === "ya"
  ).length;

  const total = mataKuliah.length;
  $("jumlah").textContent = `${selesai} dari ${total} selesai`;
  $("isiBar").style.width = total ? `${selesai / total * 100}%` : "0%";
}

$("hariIni").addEventListener("click", () => aturTanggal(new Date()));
$("hariBesok").addEventListener("click", () => aturTanggal(tambahHari(new Date(), 1)));
$("mingguDepan").addEventListener("click", () => aturTanggal(tambahHari(new Date(), 7)));

$("pilihTanggal").addEventListener("change", event => {
  if (!event.target.value) return;
  const [tahun, bulan, hari] = event.target.value.split("-").map(Number);
  aturTanggal(new Date(tahun, bulan - 1, hari));
});

// Update otomatis jika halaman dibiarkan terbuka melewati tengah malam.
let tanggalTerakhir = tanggalKey(new Date());

setInterval(() => {
  const sekarang = tanggalKey(new Date());
  if (sekarang !== tanggalTerakhir) {
    tanggalTerakhir = sekarang;
    aturTanggal(new Date());
  }
}, 30000);

$("pilihTanggal").value = tanggalKey(tanggalTampil);
render();
                                
