const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));// Config
const form = document.getElementById('form');
const preview = document.getElementById('preview');

// Color picker
const picker = new iro // Init color picker

// On submit
document.getElementById('submit').addEventListener('click', () => {

  // Get data
  const data = new FormData(form);

  // Send webhook
  axios.post(data.get('webhookUrl'), {
    content: data.get('message'),
    embeds: [{
      color: parseInt(data.get('color').replace('#', '0x')) 
    }]
  })
  .then(() => {
    console.log('Sent!');
    preview.innerHTML = ''; // Clear preview
  })
  .catch(err => {
    console.error('Error!', err);
  })

});
app.use(express.static('public'));

app.post('/send-webhook', async (req, res) => {
    const webhookUrl = req.body['webhook-url'];
    
    // Build embed object
    const embed = {
        title: req.body['embed-title'],
        description: req.body['embed-description'],
        color: parseInt(req.body['embed-color'].replace('#', ''), 16),
        fields: JSON.parse(req.body['embed-fields'])
    };

    try {
        await axios.post(webhookUrl, { embeds: [embed] });
        res.send('Webhook sent successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending webhook');
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
