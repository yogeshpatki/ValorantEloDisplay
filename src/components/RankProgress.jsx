import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearWithValueLabel from './LinearWithValueLabel';
import { Grid } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center'

  },
  submit: {
    backgroundColor: '#6c3fb582',
    color: '#ddd'
  },
  refresh: {
    backgroundColor: '#6c3fb582',
    color: '#ddd'
  },
  text: {
    color: 'white'
  },
  rankLogo: {
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '120px',
    animationName: 'spin',
    animationDuration: '2500ms',
    animationIterationCount: '5',
    animationTimingFunction: 'ease-int-out' 
  }
}));

const ranks = {    "0": "Unrated",    "1": "Unknown 1",    "2": "Unknown 2",    "3": "Iron 1",   "4": "Iron 2",    "5": "Iron 3",    "6": "Bronze 1",    "7": "Bronze 2",    "8": "Bronze 3",    "9": "Silver 1",    "10": "Silver 2",    "11": "Silver 3",    "12": "Gold 1",    "13": "Gold 2",    "14": "Gold 3",    "15": "Platinum 1",    "16": "Platinum 2",    "17": "Platinum 3",    "18": "Diamond 1",    "19": "Diamond 2",    "20": "Diamond 3",    "21": "Immortal 1",    "22": "Immortal 2",    "23": "Immortal 3",    "24": "Radiant"  };

export default function RankProgress(props) {
  console.log({props});
  const getDetails = res => {
    if(res.Matches) {
      const matches = res.Matches;
      let currentRP, rankNum, diff,elo;
      const validMatches = matches.filter(game => {
          return game['CompetitiveMovement'] !== 'MOVEMENT_UNKNOWN';
      });

      if(validMatches && validMatches.length) {
          currentRP = validMatches[0]["TierProgressAfterUpdate"];
          rankNum = validMatches[0]["TierAfterUpdate"];
          diff = validMatches[0]["TierProgressAfterUpdate"] - validMatches[0]["TierProgressBeforeUpdate"];
          elo = (rankNum * 100) - 300 + currentRP;
      }

      if(validMatches.length >= 2) {
        const previousMatch = validMatches[1];
        const prevRP = previousMatch["TierProgressAfterUpdate"];
        const prevRankNum = previousMatch["TierAfterUpdate"];
        const prevElo = (prevRankNum * 100) - 300 + prevRP;
        diff = elo - prevElo;
      }
      
      return {rank: ranks[rankNum], elo, currentRP,diff,rankNum};
    }
  };
  const rankDetails = (rankRes, logout, refresh) => {
    const rankDetail = getDetails(rankRes);
    return (
        <Grid container 
        spacing={1}
        direction="row"
        alignItems="center"
        justify="center"
        className={classes.paper}
        >
          <Grid item xs={12}>
            <Typography component="h1" variant="h5" className={classes.text}>
                Current Rank
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.rankLogo} style={{backgroundImage: `url(../${rankDetail.rankNum}.png)`}}> </div>
          </Grid>
          <Grid item xs={12}>
            <Typography component="h4" >
              Rank Progress
            </Typography>
          </Grid>
          <Grid item xs={12}>
          <LinearWithValueLabel color="green" progress={rankDetail.currentRP} className={classes.eloProgress}/> 
          </Grid>
          <Grid item xs={12}>
          <div>ELO : {rankDetail.elo}</div> 
          </Grid>
          <Grid item xs={12}>
          <Typography component="h4" >
            Last Match : {rankDetail.diff < 0 ? 'Lost' : 'Earned'} {Math.abs(rankDetail.diff)} Elo Points
          </Typography>
          </Grid>
          <Grid item xs={6}>
          <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.refresh}
              onClick={ () => refresh()}
            >
            <RefreshIcon></RefreshIcon>
          </Button>
          </Grid>
          <Grid item xs={6}>
          <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={ () => logout()}
            >
            <ExitToAppIcon></ExitToAppIcon>
          </Button>
          </Grid>
        </Grid>
    );
  }
  const classes = useStyles();
  
  return (
    <Container component="main" maxWidth="xs">
      { props.res && props.res.Matches ? <div> {rankDetails(props.res, props.logout, props.refresh)} </div> : <div> Please login to see your ELO details </div>}
    </Container>
  );
}