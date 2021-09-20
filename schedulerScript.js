const File = require("./models/file");
const fs = require("fs");
const connectDb = require("./config/db");
connectDb();

const deletedata = async () => {
  const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const files = await File.find({
    createdAt: { $lt: pastDate },
  });
  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);
        await file.remove();
        console.log(`Successfully deleted ${file.filename}`);
      } catch (error) {
        console.log(`Error for file ${file.filename}`);
      }
    }
  }
};
deletedata().then(() => {
  console.log("All files deleted");
  process.exit();
});
