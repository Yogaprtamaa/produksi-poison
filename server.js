const express = require('express');
const app = express();
const port = 3000;

// 1. Import Model Database & Class OOP
const { Product, ProductionLog } = require('./models');
const PoissonAnalyzer = require('./utils/PoissonAnalyzer');

// 2. Setup View Engine (Tampilan)
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTE 1: HALAMAN UTAMA (DASHBOARD)
// ==========================================
app.get('/', async (req, res) => {
    try {
        // A. AMBIL DATA DARI DATABASE (Async/Await)
        const products = await Product.findAll({
            include: [{
                model: ProductionLog, 
                as: 'ProductionLogs' 
            }],
            // UPDATE: Urutkan agar data terbaru muncul paling atas
            order: [
                ['id', 'ASC'], // Produk urut abjad/ID
                [{ model: ProductionLog, as: 'ProductionLogs' }, 'date', 'DESC'] // Log urut tanggal terbaru
            ]
        });

        // B. PROSES DATA DENGAN OOP & MATEMATIKA
        const report = products.map(product => {
            const analyzer = new PoissonAnalyzer(product.ProductionLogs);
            const analysis = analyzer.getAnalysis();

            return {
                name: product.name,
                lambda: analysis.lambda,
                predictions: analysis.predictions,
                // PENTING: Kita kirim data logs asli ke frontend
                logs: product.ProductionLogs 
            };
        });

        // C. KIRIM KE TAMPILAN (EJS)
        res.render('index', { report: report });

    } catch (error) {
        console.error("Error:", error);
        res.send(`Terjadi Error: ${error.message}`);
    }
});

// ==========================================
// ROUTE 2: SEEDER (ISI DATA DUMMY)
// ==========================================
app.get('/seed', async (req, res) => {
    try {
        await ProductionLog.destroy({ where: {}, truncate: true });
        await Product.destroy({ where: {}, truncate: true });

        // 1. Buat Produk
        const p1 = await Product.create({ name: 'Komponen Mesin A (Baut)', target_defect_rate: 0.05 });
        const p2 = await Product.create({ name: 'Plat Besi 5mm', target_defect_rate: 0.02 });

        // 2. Buat Log Produk 1
        await ProductionLog.bulkCreate([
            { date: new Date(), total_produced: 100, defect_count: 2, productId: p1.id },
            { date: new Date(), total_produced: 100, defect_count: 5, productId: p1.id }, // Cacat tinggi
            { date: new Date(), total_produced: 100, defect_count: 0, productId: p1.id },
            { date: new Date(), total_produced: 100, defect_count: 1, productId: p1.id }
        ]);

        // 3. Buat Log Produk 2
        await ProductionLog.bulkCreate([
            { date: new Date(), total_produced: 200, defect_count: 0, productId: p2.id },
            { date: new Date(), total_produced: 200, defect_count: 0, productId: p2.id },
            { date: new Date(), total_produced: 200, defect_count: 1, productId: p2.id }
        ]);

        res.send("<h1>Sukses!</h1> <p>Data Dummy berhasil dibuat.</p> <a href='/'>Kembali ke Dashboard</a>");
    } catch (error) {
        res.send(error.message);
    }
});

// ==========================================
// ROUTE 3: HALAMAN INPUT
// ==========================================
app.get('/input', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.render('form', { products });
    } catch (error) {
        res.send(error.message);
    }
});

// ==========================================
// ROUTE 4: PROSES INPUT (POST)
// ==========================================
app.post('/add-product', async (req, res) => {
    try {
        await Product.create(req.body);
        res.redirect('/input');
    } catch (error) {
        res.send(error.message);
    }
});
// ==========================================
// ROUTE 5: HAPUS DATA LOG (DELETE)
// ==========================================
app.post('/delete-log/:id', async (req, res) => {
    try {
        // Hapus data berdasarkan ID yang dikirim
        await ProductionLog.destroy({
            where: { id: req.params.id }
        });
        
        // Balik lagi ke dashboard
        res.redirect('/');
    } catch (error) {
        res.send("Gagal menghapus: " + error.message);
    }
});

// ==========================================
// ROUTE 6: EDIT DATA (UPDATE)
// ==========================================

// A. Tampilkan Halaman Edit (GET)
app.get('/edit-log/:id', async (req, res) => {
    try {
        // Cari data log berdasarkan ID, dan sertakan nama Produknya
        const log = await ProductionLog.findOne({
            where: { id: req.params.id },
            include: ['Product'] // Pastikan model Product terhubung
        });

        res.render('edit', { log });
    } catch (error) {
        res.send("Error: " + error.message);
    }
});

// B. Proses Simpan Perubahan (POST)
app.post('/update-log/:id', async (req, res) => {
    try {
        const { date, total_produced, defect_count } = req.body;

        // Update data di database
        await ProductionLog.update({
            date,
            total_produced,
            defect_count
        }, {
            where: { id: req.params.id }
        });

        res.redirect('/'); // Balik ke dashboard
    } catch (error) {
        res.send("Gagal update: " + error.message);
    }
});

app.post('/add-log', async (req, res) => {
    try {
        const { productId, date, total_produced, defect_count } = req.body;
        await ProductionLog.create({ productId, date, total_produced, defect_count });
        res.redirect('/');
    } catch (error) {
        res.send(error.message);
    }
});

// JALANKAN SERVER
app.listen(port, () => {
    console.log(`Aplikasi jalan di http://localhost:${port}`);
});