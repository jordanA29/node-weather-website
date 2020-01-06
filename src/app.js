const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;
// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
// Set up static directory
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather app',
    name: 'Jordan'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About page',
    name: 'Jordan'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help page',
    helpText: 'Some helpful text',
    name: 'Jordan'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    });
  }

  geocode(
    req.query.address,
    (error, { longitude, latitude, location } = {}) => {
      if (error) {
        return res.send({
          error
        });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error
          });
        }
        res.send({
          location,
          forecast: forecastData,
          address: req.query.address
        });
      });
    }
  );
});

app.get('/help/*', (req, res) => {
  res.render('not_found', {
    error: 'Help article not found',
    title: '404',
    name: 'Jordan'
  });
});

app.get('*', (req, res) => {
  res.render('not_found', {
    error: 'Page not found',
    title: '404',
    name: 'Jordan'
  });
});

app.listen(port, () => {
  console.log('Server started on port' + port);
});
