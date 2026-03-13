import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { nome, email, empresa, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ message: "Campos obrigatórios faltando" });
  }

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Site Bescheiben" <${process.env.EMAIL_USER}>`,
      to: "bescheiben@gmail.com",
      subject: "Novo contato pelo site",
      html: `
        <h2>Novo contato recebido</h2>

        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>

        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}