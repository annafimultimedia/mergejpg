const imageInput = document.getElementById('imageInput');
const mergeBtn = document.getElementById('mergeBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const previewArea = document.getElementById('previewArea');

mergeBtn.addEventListener('click', async () => {
    const files = Array.from(imageInput.files);
    if (files.length < 2) {
        alert("Silakan pilih minimal 2 gambar!");
        return;
    }

    const images = await Promise.all(files.map(file => {
        return new Promise(resolve => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => resolve(img);
        });
    }));

    // Hitung total dimensi (Penggabungan Vertikal)
    const maxWidth = Math.max(...images.map(img => img.width));
    const totalHeight = images.reduce((sum, img) => sum + img.height, 0);

    canvas.width = maxWidth;
    canvas.height = totalHeight;

    // Gambar ulang semua file ke canvas
    let currentY = 0;
    images.forEach(img => {
        ctx.drawImage(img, 0, currentY);
        currentY += img.height;
    });

    // Tampilkan hasil
    const mergedDataUrl = canvas.toDataURL('image/jpeg');
    previewArea.innerHTML = `<img src="${mergedDataUrl}" style="max-width:100%;">`;
    
    downloadBtn.href = mergedDataUrl;
    downloadBtn.download = "hasil-gabungan.jpg";
    downloadBtn.style.display = "inline-block";
    downloadBtn.innerText = "Unduh JPG";
});