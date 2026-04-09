import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './app';
import './util/i18n';

// Story-format `format.js` hydrate may bundle Snowcone dialog-forms (passage command editor) with webpack externals;
// those builds expect React/ReactDOM on the window.
if (typeof window !== 'undefined') {
	(window as Window & {__TWINE_EMBED_REACT__?: typeof React}).__TWINE_EMBED_REACT__ =
		React;
	(window as Window & {__TWINE_EMBED_REACT_DOM__?: typeof ReactDOM}).__TWINE_EMBED_REACT_DOM__ =
		ReactDOM;
	(window as Window & {__INFICT_TWINE_REACT__?: typeof React}).__INFICT_TWINE_REACT__ =
		React;
	(
		window as Window & {__INFICT_TWINE_REACT_DOM__?: typeof ReactDOM}
	).__INFICT_TWINE_REACT_DOM__ = ReactDOM;
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
