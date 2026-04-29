const db = require('../config/database');

exports.addProduct = (req, res) => {
    // Debugging ke liye
    console.log("Body Received:", req.body);
    console.log("File Received:", req.file);

    const { name, description, price, stock, category, status } = req.body;
    const image = req.file ? req.file.filename : null;

    const sql = "INSERT INTO products (name, description, price, stock, category, image, status) VALUES (?, ?, ?, ?, ?, ?, ?)";

    // Default values ensure kar rahe hain
    const values = [
        name,
        description || null,
        price,
        stock !== undefined ? stock : 0,
        category || null,
        image,
        status || 'Active'
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json(err);
        }
        res.status(201).json({ message: "Product added successfully", productId: result.insertId });
    });
};

exports.getProducts = (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    let countSql = "SELECT COUNT(*) as total FROM products";
    let selectSql = "SELECT * FROM products";
    const params = [];

    if (status) {
        countSql += " WHERE status = ?";
        selectSql += " WHERE status = ?";
        params.push(status);
    }

    db.query(countSql, params, (err, countResult) => {
        if (err) return res.status(500).json(err);

        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        selectSql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        const selectParams = [...params, parseInt(limit), parseInt(offset)];

        db.query(selectSql, selectParams, (err, result) => {
            if (err) return res.status(500).json(err);

            const productsWithUrl = result.map(product => ({
                ...product,
                image_url: product.image ? `${req.protocol}://${req.get('host')}/uploads/products/${product.image}` : null
            }));

            res.json({
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                },
                products: productsWithUrl
            });
        });
    });
};

exports.getProductById = (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Product not found" });

        const product = result[0];
        product.image_url = product.image ? `${req.protocol}://${req.get('host')}/uploads/products/${product.image}` : null;

        res.json(product);
    });
};

exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const file = req.file;

    if (Object.keys(fields).length === 0 && !file) {
        return res.status(400).json({ message: "No fields provided to update" });
    }

    let sql = "UPDATE products SET ";
    const params = [];
    const updates = [];

    for (const key in fields) {
        if (['name', 'description', 'price', 'stock', 'category', 'status'].includes(key)) {
            updates.push(`${key} = ?`);
            params.push(fields[key]);
        }
    }

    if (file) {
        updates.push("image = ?");
        params.push(file.filename);
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: "No valid fields provided to update" });
    }

    sql += updates.join(", ") + " WHERE id = ?";
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Update Error:", err);
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product updated successfully" });
    });
};

exports.deleteProduct = (req, res) => {
    const sql = "SELECT image FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Product not found" });

        const deleteSql = "DELETE FROM products WHERE id = ?";
        db.query(deleteSql, [req.params.id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Product deleted successfully" });
        });
    });
};
