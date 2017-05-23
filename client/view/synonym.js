const html = require('choo/html');
const css = require('sheetify');
const debounce = require('debounce');
const Microframe = require('microframe');

const nextFrame = Microframe();
const colcss = css`
  :host {
    padding: 10px;
    height: 100%;
    flex: 0 auto;
  }
`;
const ul = css`
  :host {
    list-style-type: none;
    padding: 0;
  }
`;
const inputcss = css`
  :host {
    border: 0.4em solid black;
    padding: 0.4em;
  }
`;
const selectedcss = css`
  :host {
    color: black;
  }
  :host:before {
    content: '{ ';
  }
  :host:after {
    content: ' }';
  }
`;

function btn({ val, selected }, onclick) {
  return html`<button class="${selected ? selectedcss : ''}" onclick="${onclick(val)}">${val}</button>`;
}

function makeComponent (id, synonyms, emit) {
  
    let lastValue = '';
  
    function synonymList(synonyms) {
      if (!synonyms.length) return '';
      
      function toggleSelected(val) {
        return function () {
          emit('toggle-synonym', { id, val });
        }
      }
      
      return html`
        <ul class="${ul}">
        ${synonyms.map(s => html`<li>${btn(s, toggleSelected)}</li>`)}
        </ul>
      `;
    }

    function getSynonyms (e) {
      const word = e.target.value;
      if (word === lastValue) return;
      lastValue = word;
      nextFrame(function() {
        fetch(`/api/${word}`)
          .then(response => response.json())
          .then(json => emit('got-synonyms', {
            id,
            json,
          }));
      });
    }
  
    function removeCol(id) {
      return function () {
        emit('remove-column', { id });
      }
    }
  
    const input = html`<input type="text" value="" class="${inputcss}" onkeyup=${debounce(getSynonyms, 250)}/>`;
    input.isSameNode = () => true;
  
    return html`
      <div id="${id}" class=${colcss}>
        ${input}
        ${id > 1 ? html`<button onclick="${removeCol(id)}">Remove</button>` : ''}
        ${synonymList(synonyms)}
      </body>
    `;
}

module.exports = makeComponent;