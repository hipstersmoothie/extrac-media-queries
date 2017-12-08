import postcss from 'postcss';
import loaderUtils from 'loader-utils';
import transform from './transform';

export default function transformMediaQueries(file) {
    const query = loaderUtils.parseQuery(this.query);
    const cb = this.async();

    const start = 'exports.push([module.id, "';
    const end = '", ""]);';
    const startIndex = file.indexOf(start);
    const endIndex = file.indexOf(end);

    const css = file
        .substring(startIndex + start.length, endIndex)
        .replace(/(\\r\\n|\\n|\\r)/gm, '');

    postcss([transform(query.breakPoints)])
        .process(css)
        .then((result) => {
            const endFile = (
                file.substring(0, startIndex + start.length) +
                result.css +
                file.substring(endIndex)
            );

            cb(null, endFile);
        });
}