import FlatButton from 'material-ui/FlatButton';
import createComponent from './createComponent';
import mapError from './mapError';

const mapProps = props => ({ ...mapError(props) });

export default createComponent(FlatButton, mapProps);
