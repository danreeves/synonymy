const choo = require('choo');
const html = require('choo/html');
const css = require('sheetify');
const logger = require('./client/logger');
const mainView = require('./client/view/main');

const app = choo();
app.use(logger);
app.use(state);
app.route('/', mainView);
app.mount('#app');

function state (state, emitter) {
  
  // Initial state
  state.columns = [
    {
      id: 1,
      synonyms: [],
    },
  ];
  
  
  // When our API returns data
  emitter.on('got-synonyms', (data) => {
    // Find the correct column
    const updated = state.columns.find(s => s.id === data.id);
    // Insert the data, creating an object with selected state per word
    updated.synonyms = data.json.map(s => ({ val: s, selected: false }));
    // Rerender the page
    emitter.emit('render');
  });
  
  // When you click a word
  emitter.on('toggle-synonym', (data) => {
    // Find the column and the word in the state
    const updated = state.columns.find(s => s.id === data.id).synonyms.find(s => s.val === data.val);
    // Set it to the opposite state of what it is now
    updated.selected = !updated.selected;
    // Rerender the page
    emitter.emit('render');
  });
  
  // When you click Add column
  emitter.on('add-column', () => {
    // Add a new object to the columns array with an incremented id
    state.columns.push({
      id: state.columns.length + 1,
      synonyms: [],
    });
    // Rerender the page
    emitter.emit('render');
  });
  
  // When you click remove on a column
  emitter.on('remove-column', (data) => {
    // Find the array index of the column with the ID
    const index = state.columns.findIndex(col => col.id === data.id);
    // Remove the object from the array
    state.columns.splice(index, 1);
    // Rerender the page
    emitter.emit('render');
  });
}