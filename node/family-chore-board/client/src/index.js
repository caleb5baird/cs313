import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Choreboard from './Choreboard';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Choreboard />, document.getElementById('root'));
registerServiceWorker();
