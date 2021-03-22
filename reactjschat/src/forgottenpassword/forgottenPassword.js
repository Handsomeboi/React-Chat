import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './styles';

const firebase = require("firebase");

class forgottenPasswordComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            email: null,
        };
    }

    render() {

        const { classes } = this.props;

        return(
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Reset Your Password!
                    </Typography>
                    <form className={classes.form} onSubmit={(e) => this.forgotPassword}>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel value={this.state.email} >
                            Enter Your Email
                        </InputLabel>
                        <Input autoComplete='email' autoFocus onChange={this.handleChange}></Input>
                    </FormControl>
                    <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={this.forgotPassword}>Send</Button>
                    <Typography component='h5' variant='h6' className={classes.noAccountHeader}>
                        Go back to Login 
                    </Typography>
                    <Link className={classes.goBackLink} to='/login'>Here!</Link>
                    </form>
                </Paper>
            </main>
        );
    }

    // this will take the email from the firebase
    handleChange = (e) => {
        this.setState ({email: e.target.value})
    }

    
    // if a user forgets their email, they can reset their password, and create a new one
    forgotPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
          .then( () => {
            alert('Please check your email...')
          }).catch(function (e) {
            console.log(e)
          })
      }
    };


    export default withStyles(styles)(forgottenPasswordComponent);