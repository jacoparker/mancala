import React from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function NavBar() {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} aria-label="menu">
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Mancala!
            </Typography>
            <Button color="inherit">Animation</Button>
            <Button color="inherit">Difficulty</Button>
            <Button color="inherit">History</Button>
            <Button color="inherit">Restart</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }