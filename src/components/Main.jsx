import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import CssTextField from './CssTextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import RankProgress from './RankProgress';
import { login } from '../util/riotUtils';
import { CircularProgress, Paper } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 'calc(50vh - 200px)',
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  avatar: {
    margin: theme.spacing(0.2),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(0.2),
    color: 'white'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#6c3fb582',
    color: '#ddd'
  },
  text: {
    color: 'white'
  },
  footer: {
    color: 'white',
    position: 'fixed',
    bottom: '0',
    textAlign: 'center',
    width: '100%'
  }
}));


export default function Main() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  
  function getModalStyle() {

    return {
      backgroundColor: '#11111182',
      color: 'white',
      position: 'absolute',
      top: `${50}%`,
      left: `${50}%`,
      transform: 'translate(-50%, -50%)',
      width: '50%',
      padding: '2em'
    };
  }
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle}>
      <h2 id="simple-modal-title">Hi Team</h2>
      <p id="simple-modal-description">
        This project was inspired by <a href="https://github.com/RumbleMike/ValorantStreamOverlay">RumbleMike</a>
        And I only intend to provide my fellow Valorant players with some insight on their rank progress. 
        If you don't want this tool to be out there, Please dm me on Twitter: @yogesh_p7
        Entire source code of this web application is available on <a href="https://github.com/yogeshpatki/ValorantEloDisplay/">Github</a>, and it does not store any of the data 
        entered by the user for any intents or purposes. Much Love.
      </p>
    </div>
  );
  const [state, setstate] = React.useState({
    loginState: NOT_LOGGED_IN,
    response: {}
  });

  const userSignIn = async (username, password) => {
    setstate({...state, loginState: LOGGING_IN});
    const res = await login(username, password);
    setstate({loginState: LOGGED_IN, response: res, username, password});
  };

  const loginDisplay = () => {
    return (
    <>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.text}>
          Sign In
        </Typography>
        <form className={classes.form}>
          <CssTextField
            color="primary"
            variant="filled"
            margin="normal"
            required
            fullWidth
            id="account"
            label="Riot Username"
            name="account"
            autoComplete="account"
            autoFocus
          />
          <CssTextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => {
              e.preventDefault();
              userSignIn(document.getElementById('account').value, document.getElementById('password').value);
            }}
          >
            Fetch ELO Details
          </Button>
        </form>
      </>)
  }

  return (<>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper className={classes.paper}>
      {
        state.loginState === LOGGING_IN ? 
        <CircularProgress /> 
         : state.loginState === NOT_LOGGED_IN ? loginDisplay() 
         : <RankProgress 
              res={state.response}
              refresh={() => {
                userSignIn(state.username, state.password)
              }} 
              logout={
                () => {
                  setstate({...state, loginState:NOT_LOGGED_IN})
                }
              }
            />

      }
      </Paper>
    </Container>
    <footer className={classes.footer}>
    Are you from RIOT and don't like this tool? Click 
    <Button
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={handleOpen}>
        Here
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </footer>
    </>
  );
}

const NOT_LOGGED_IN = 0;
const LOGGING_IN = 1;
const LOGGED_IN = 2;