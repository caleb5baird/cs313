import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChoreBoard from './ChoreBoard';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ChoreBoard />, document.getElementById('root'));
registerServiceWorker();
