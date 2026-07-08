const mysql = require('mysql2/promise');

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '192125',
      database: 'matrip'
    });

    const [rows] = await connection.execute("SELECT * FROM usuarios WHERE email = 'dean@gmail.com'");
    console.log("RESULTADO:", JSON.stringify(rows));
    await connection.end();
  } catch (error) {
    console.error("ERRO:", error);
  }
})();
