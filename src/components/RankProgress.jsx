import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearWithValueLabel from './LinearWithValueLabel';
import { Card } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    '& div': {
      margin: '0.2em'
    },
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  rankLogo: {
    height: '120px',
    width: '100px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  },
  eloProgress: {
    width: '100%'
  }
}));

const ranks = {    "0": "Unrated",    "1": "Unknown 1",    "2": "Unknown 2",    "3": "Iron 1",   "4": "Iron 2",    "5": "Iron 3",    "6": "Bronze 1",    "7": "Bronze 2",    "8": "Bronze 3",    "9": "Silver 1",    "10": "Silver 2",    "11": "Silver 3",    "12": "Gold 1",    "13": "Gold 2",    "14": "Gold 3",    "15": "Platinum 1",    "16": "Platinum 2",    "17": "Platinum 3",    "18": "Diamond 1",    "19": "Diamond 2",    "20": "Diamond 3",    "21": "Immortal 1",    "22": "Immortal 2",    "23": "Immortal 3",    "24": "Radiant"  };

export default function RankProgress(props) {
  console.log({props});
  const getDetails = res => {
    if(res.Matches) {
      const matches = res.Matches;
      let currentRP, rankNum, diff;
      const validMatches = matches.filter(game => {
          return game['CompetitiveMovement'] != 'MOVEMENT_UNKNOWN';
      });

      if(validMatches && validMatches.length) {
          currentRP = validMatches[0]["TierProgressAfterUpdate"];
          rankNum = validMatches[0]["TierAfterUpdate"];
          diff = validMatches[0]["TierProgressAfterUpdate"] - validMatches[0]["TierProgressBeforeUpdate"];
      }
      
      return {rank: ranks[rankNum], elo: (rankNum * 100) - 300 + currentRP, currentRP,diff};
    }
  };
  const rankDetails = (rankRes, logout) => {
    const rankDetail = getDetails(rankRes);
    return (
    <Card className={classes.paper}>
      <Typography component="h1" variant="h5" className={classes.text}>
          Current Rank
      </Typography>
      <div className={classes.rankLogo} style={{backgroundImage: `url(../10.png)`}}> </div>
      <Typography component="h4" >
        Rank Progress
      </Typography>
      <LinearWithValueLabel color="green" progress={rankDetail.currentRP} className={classes.eloProgress}/> 
      <div>ELO : {rankDetail.elo}</div> 
      <Typography component="h4" >
        Last Match : {rankDetail.diff < 0 ? 'Lost' : 'Earned'} {Math.abs(rankDetail.diff)} Elo Points
      </Typography>
      <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={ () => logout()}
        >
        Go Back
      </Button>
    </Card>
    );
  }
  const classes = useStyles();
  
  return (
    <Container component="main" maxWidth="xs">
      { props.res && props.res.Matches ? <div> {rankDetails(props.res, props.logout)} </div> : <div> Please login to see your ELO details </div>}
    </Container>
  );
}