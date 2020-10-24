# Web-Presensi

Ini adalah sebuah Web Absen Online sederhana yang dibuat dengan:
- Express JS
- EJS
- MongoDb

# installations

Silakan Clone / downloads repository ini

### npm install

Buat database baru di mongodb, contoh: db-presensi. Lalu masuk ke folder config dan ubah file database yang di dalamnya beriskan seperti ini

module.exports = {
  database: 'mongodb://localhost:27017/<nama Database kamu >',
  secret: 'yoursecret'
}
 
### Start Server
buka terminal dan ketik nodemon dev untuk menjalankan server
