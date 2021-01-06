import {
  withStyles
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const CssTextField = withStyles({
  root: {
    '& input.MuiFilledInput-input' : { 
      color: '#fffffff0'
    },
    '& label': {
      color: '#fa445482',
    },
    '& label.Mui-focused': {
      color: '#ffffff82'
    },
    '& .MuiFilledInput-underline:before': {
      borderBottomColor: '#fa445482'
    },
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: '#ffffff82'
    },
  },
})(TextField);

export default CssTextField;