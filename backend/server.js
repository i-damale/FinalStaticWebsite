require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'portfolio';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

if(!MONGODB_URI){
  console.error('MONGODB_URI not set. Exiting.');
  process.exit(1);
}

let client, messages;
async function main(){
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  messages = db.collection('messages');
  console.log('Connected to MongoDB');
}
main().catch(err=>{ console.error('Mongo connection failed',err); process.exit(1); });

app.get('/api/health', (req,res)=> res.json({ok:true}));

app.post('/api/contact', async (req,res)=>{
  try{
    const { name, email, message } = req.body;
    if(!name || !email || !message) return res.status(400).json({ ok:false, error:'missing fields' });
    const doc = { name, email, message, createdAt: new Date() };
    const r = await messages.insertOne(doc);
    if(SMTP_HOST && SMTP_USER && NOTIFY_EMAIL){
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT ? Number(SMTP_PORT) : 587,
        secure: SMTP_PORT==465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
      });
      const mail = {
        from: `"Portfolio Contact" <${SMTP_USER}>`,
        to: NOTIFY_EMAIL,
        subject: `New message from ${name}`,
        text: `Message: ${message}\nFrom: ${name} <${email}>`
      };
      try{ await transporter.sendMail(mail); }catch(e){ console.error('Email send failed', e); }
    }
    res.json({ ok:true, id: r.insertedId });
  }catch(err){
    console.error(err);
    res.status(500).json({ ok:false, error:'server error' });
  }
});

app.listen(PORT, ()=> console.log('Server running on', PORT));
