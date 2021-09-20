const router = require("express").Router();
const multer = require("multer");
const File = require("../models/file");
const path = require("path");
const { v4: uuid4 } = require("uuid");
const sendmail = require("../services/emailService");
const emailTemplate = require("../services/emailTemplate");

// multer config
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "user-uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myFile");

// multer config ends

router.post("/files", (req, res) => {
  // store file
  upload(req, res, async (err) => {
    // validate data
    // if (!req.file) {
    //   return res.json({ error: "All fields are required" });
    // }
    if (err) {
      console.log(err);
      return res.status(500).send({ error: err.message });
    }
    const file = new File({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uuid: uuid4(),
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URl}/files/${response.uuid}`,
    });
  });
});

router.post("/files/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  console.log(req.body);

  if (!uuid || !emailFrom || !emailTo) {
    return res.status(422).send({ error: "All fields are required" });
  }
  // get data from database
  const file = await File.findOne({ uuid: uuid });

  if (file.sender) {
    return res.status(422).send({ error: "Email already sent" });
  }
  file.sender = emailFrom;
  file.reciver = emailTo;
  const response = await file.save();

  sendmail({
    from: emailFrom,
    to: emailTo,
    subject: "FarShare file sharing",
    text: `${emailFrom} shared a file with you`,
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URl}/files/${uuid}`,
      size: parseInt(file.size / 1000) + " KB ",
      expires: "24 hours",
    }),
  });
  return res.send({ success: true });
});

module.exports = router;
