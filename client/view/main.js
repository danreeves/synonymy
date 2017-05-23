const html = require('choo/html');
const css = require('sheetify');
const synonym = require('./synonym');

const globalcss = css`
    html, body {
      margin:0;
      padding:0;
      font-family: sans-serif;
      background-color: palegreen;
    }
    body {
      margin: 2em;
    }
    a {
      text-decoration: none;
      font-weight: bold;
      color: deeppink;
    }
    button {
      background: none;
      border: none;
      color: deeppink;
      font-weight: bold;
    }
    button:hover {
      text-shadow: 0.1em 0.1em 0px hotpink;
      cursor: pointer;
    }
`;

const nav = css`
  :host {
    padding-left: 10px;
  }
  h1 {
    display: inline-block;
  }
  button {
    display: inline-block;
  }

`;

const flexContainer = css`
  :host {
    display: flex;
  }
`;

const btn = css`
  :host {
    padding: 10px;
    font-size: 2em;
  }
`;

const resultcss = css`
  :host {
    border-bottom: 0.2em solid black;
    padding-bottom: 0.2em;
    font-size: 1.25em;
  }
`;

function mainView (state, emit) {
  
  function addColumn() {
    emit('add-column');
  }
  
  return html`
    <div class=${globalcss}>
      <div class="${nav}">
        <h1>Synonymy ✨</h1>
        <button class="${btn}" onclick="${addColumn}">Add column</button>
        <div class="${resultcss}">
          ${state.columns.reduce((string, col) => {
            return `${string} ${col.synonyms.filter(s => s.selected === true).map(s => s.val).join(' ')}`;
          }, '').trim() || 'Type something...'}
        </div>
      </div>
      <div class=${flexContainer}>
        ${state.columns.map(s => synonym(s.id, s.synonyms, emit))}
      </div>
    </body>
  `;
}

module.exports = mainView;