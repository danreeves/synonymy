const path = require('path');
const http = require('http');
const merry = require('merry'); // A cute server framework
const bankai = require('bankai'); // A cute asset streaming helper
const compression = require('compression'); // Compresssss 🙏

const { apiError, apiWord } = require('./server/api');

const notFound = merry.notFound;
const mw = merry.middleware;
const clientPath = path.join(__dirname, 'client.js');
const assets = bankai(clientPath, {
    html: {
      title: 'Synonymy',
      body: `
        <div id="app"></div>
        <div class="remix">
            <a href="https://glitch.com/~synonymy">
                <img width="160" src="https://cdn.glitch.com/26c5151f-1a54-404d-ba45-7bb83ee14283%2Flogo.png?1490487062941" alt="Remix on Glitch">
            </a>
            <style scoped>
                .remix {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                }
            </style>
        </div>
      `,
    },
    js: {
        transform: ['yo-yoify', 'sheetify/transform', 'babelify'],
    },
    uglify: true,
    assert: false,
});

var env = merry.env({ PORT: 8080 });
var app = merry();

app.use({
    onRequest: compression(),
});

app.router([
    ['/', (req, res) => assets.html(req, res).pipe(res)],
    ['/bundle.js', (req, res) => assets.js(req, res).pipe(res)],
    ['/bundle.css', (req, res) => assets.css(req, res).pipe(res)],
    ['/api', apiError, [['/:word', apiWord]]],
    ['/404', notFound()],
]);

const server = http.createServer(app.start());
server.listen(env.PORT);
