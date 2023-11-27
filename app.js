const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
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
