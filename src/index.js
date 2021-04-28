import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';


// there is probably a way better way to do this, but new urls are added to end of the urls csv string
ReactDOM.render(
    <React.StrictMode>
        <App
            urls={"https://global-warming.org/api/co2-api,https://global-warming.org/api/methane-api,https://global-warming.org/api/nitrous-oxide-api,https://global-warming.org/api/temperature-api"}
        />
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
