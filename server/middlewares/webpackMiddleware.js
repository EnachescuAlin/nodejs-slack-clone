import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import path from 'path';
import config from '../webpack.dev';
const compiler = webpack(config);


function addWebpackHotMiddleware(app) {
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }));
    const filename = path.join(compiler.outputPath, "../index.html");
    app.use('*', (req, res) => {
        compiler.outputFileSystem.readFile(filename, (err, file) => {
            if (err) {
                console.log(err);
                res.sendStatus(404);
            } else {
                res.send(file.toString());
            }
        });
    });
}

export default addWebpackHotMiddleware;