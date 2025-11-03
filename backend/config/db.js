import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Kiểm tra kết nối khi khởi động server
pool.getConnection()
  .then(connection => {
    console.log('Kết nối database thành công!');
    connection.release(); // Trả kết nối về lại pool
  })
  .catch(err => {
    console.error('Không thể kết nối đến database:', err);
  });

// Xuất ra pool để các file khác có thể sử dụng
export const db = pool;
