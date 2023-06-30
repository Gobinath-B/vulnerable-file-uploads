const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const message = 'Welcome to the File Upload Site!';

  // Fetch the list of uploaded files
  fs.readdir('uploads', (err, filenames) => {
    if (err) {
      console.error(err);
      filenames = [];
    }

    const files = filenames.map((filename) => ({
      filename,
      originalname: path.basename(filename),
    }));

    res.render('index', { message, files });
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;
  const originalName = uploadedFile.originalname;
  const destination = path.join(__dirname, 'uploads', originalName);

  fs.rename(uploadedFile.path, destination, (err) => {
    if (err) {
      console.error(err);
      res.send('Error occurred while storing the file.');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filePath);
});

app.listen(7000, () => {
  console.log('Server is running on port 7000');
});
