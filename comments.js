// Create web server
// Create a comment
// Read a comment
// Update a comment
// Delete a comment

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const commentsData = path.join(__dirname, 'data/comments.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a comment
app.post('/comments', (req, res) => {
  const comment = req.body;

  if (!comment.name || !comment.comment) {
    res.status(400).send('Name and comment are required');
    return;
  }

  fs.readFile(commentsData, (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments.json');
      return;
    }

    let comments = JSON.parse(data);
    comments.push(comment);

    fs.writeFile(commentsData, JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing comments.json');
        return;
      }

      res.status(201).send('Comment created');
    });
  });
});

// Read a comment
app.get('/comments', (req, res) => {
  fs.readFile(commentsData, (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments.json');
      return;
    }

    res.json(JSON.parse(data));
  });
});

// Update a comment
app.put('/comments/:id', (req, res) => {
  const id = req.params.id;
  const comment = req.body;

  if (!comment.name || !comment.comment) {
    res.status(400).send('Name and comment are required');
    return;
  }

  fs.readFile(commentsData, (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments.json');
      return;
    }

    let comments = JSON.parse(data);
    comments[id] = comment;

    fs.writeFile(commentsData, JSON.stringify(comments, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing comments.json');
        return;
      }

      res.status(200).send('Comment updated');
    });
  })
});
// Delete a comment
app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(commentsData, (err, data) => {
        if (err) {
            res.status(500).send('Error reading comments.json');
            return;
        }
        let comments = JSON.parse(data);
        if (id < 0 || id >= comments.length) {
            res.status(404).send('Comment not found');
            return;
        }
        comments.splice(id, 1);
        fs.writeFile(commentsData, JSON.stringify(comments, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error writing comments.json');
                return;
            }
            res.status(200).send('Comment deleted');
        });
    });
});
