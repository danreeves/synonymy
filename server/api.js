const fetch = require('make-fetch-happen');

function apiurl(word) {
    return `http://thesaurus.altervista.org/thesaurus/v1?word=${word}&language=en_US&output=json&key=${process.env.API_KEY}`;
}

function apiError(req, res, ctx, done) {
    done(null, { error: 'Call a path like /api/word' });
}

function apiWord(req, res, ctx, done) {
    const url = apiurl(ctx.params.word);
    fetch(url)
        .then(response => response.json())
        .then(json => {
            return json.response.reduce((acc, synonyms) => {
                const terms = synonyms.list.synonyms
                    .replace(/\(similar term\)/g, '')
                    .replace(/\(related term\)/g, '')
                    .split('|')
                    .filter(string => !string.includes('antonym'))
                    .map(str => str.trim());

                return acc.concat(terms);
            }, []);
        })
        .then(json => {
            done(null, json);
        })
        .catch(err => done(null, err));
}

module.exports = {
    apiError,
    apiWord,
};
