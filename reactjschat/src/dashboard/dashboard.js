import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';
import ChatListComponent from '../chatlist/chatList';
import ChatViewComponent from '../chatview/chatView';
import ChatTextBoxComponent from '../chattextbox/chatTextbox';
import NewChatComponent from '../newchat/newChat';

const firebase = require("firebase");

class DashboardComponent extends React.Component {
    
    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: []
        };
    }

    render() {

        const { classes } = this.props; 

        return (
        <div>
          {/* structuring the chat list */}
            <ChatListComponent history={this.props.history} 
            userEmail={this.state.email} 
            selectChatFn={this.selectChat} 
            chats={this.state.chats} 
            selectedChatIndex={this.state.selectedChat}
            newChatBtnFn={this.newChatBtnClicked}>
          </ChatListComponent>
          {
            // This will show the chat view, if a chat is selected. If no chat is selected, newChatFormVisible will be shown
            this.state.newChatFormVisible ? null : <ChatViewComponent 
              user={this.state.email} 
              chat={this.state.chats[this.state.selectedChat]}>
            </ChatViewComponent>
             }
             {
            // Making sure if the user has or has not, read the message
               this.state.selectedChat !== null && !this.state.newChatFormVisible ?
               <ChatTextBoxComponent messageReadFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBoxComponent> :
                 null
             }
            {
              this.state.newChatFormVisible ? <NewChatComponent goToChatFn={this.goTochat} newChatSubmitFn={this.newChatSubmit}></NewChatComponent> : null
            }
            {/* Buttons for signing out and deleting a selected chat */}
            <Button className={classes.deleteChatBtn} onClick={this.deleteChat} >delete</Button>
             <Button className={classes.signOutBtn} onClick={this.signOut} >Sign Out</Button>
        </div>
        );
    }

    // Function behind the delete selected chat
    // Making sure that you can only delete a chat, if you have selected one, if no chat is selected, it will return null
    deleteChat = () => { 
      if(this.state.selectedChat === null){
        return
      }
      const id = this.state.chats[this.state.selectedChat].id
      // const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]);
      firebase
      .firestore()
      .collection("chats")
      .doc(id)
      .delete()
      .then(() => this.setState({ selectedChat: null}))
    
    } 
    // Signing the user out of firebase
    signOut = () => firebase.auth().signOut();

    // Selecting a chat and setting it to Read
    selectChat = async (chatIndex) => {
       await this.setState({ selectedChat: chatIndex});
       this.messageRead();
    }

    // Sending a message and filtering whos email its being send from, and then setting the message to not read
    submitMessage = (msg) => {
      const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
       firebase
       .firestore()
       .collection('chats')
       .doc(docKey)
       .update({
         messages: firebase.firestore.FieldValue.arrayUnion({
           sender: this.state.email,
           message: msg,
           timestamp: Date.now()
         }),
         recieverHasRead: false
       });
    }

    // building the dockey sorting to make sure, whos email is whos and then setting a colon in between in the database
    buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

    // when no chat is seleceted, show newChatFormVisible
    newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null })

    // functions tells weather or not the person clicking on the chat, is the sender
    clickedChatWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length -1].sender !== this.state.email;

    // functions tells the database, that the user has red the recieved message, and updates the parameter of recieverHasRead to True
    messageRead = () => {
      const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
      if(this.clickedChatWhereNotSender(this.state.selectedChat)) {
        firebase
          .firestore()
          .collection('chats')
          .doc(docKey)
          .update({ recieverHasRead: true })
      } else {
        console.log('clicked message where the user was the sender');
      }
    }

    // if trying to send a new message, the function will find out if the chat is already in the database.
    // if the chat is already in the database, it will redirect the user to the chat and send the desired message
    goTochat = async (docKey, msg) => {
      const usersInChat = docKey.split(':');
      const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
      this.setState({ newChatFormVisible: false });
      await this.selectChat(this.state.chats.indexOf(chat));
      this.submitMessage(msg);
    }

    // this will create a new chat, when the user tries to send a new message
    newChatSubmit = async (chatObj) => {
      const docKey = this.buildDocKey(chatObj.sendTo)
      await firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .set({
        recieverHasRead: false,
        users: [this.state.email, chatObj.sendTo],
        messages: [{
          message: chatObj.message,
          sender: this.state.email
        }]
      })
      this.setState({ newChatFormVisible: false});
      this.selectChat(this.state.chats.length - 1);
    }

    // upon logging in componentDidMount will show the user whats in the database, this being the chats
    // it will also push the user out, if there is no user logged in
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
            if(!_usr)
              this.props.history.push('/login');
            else {
              console.log(_usr)
              await firebase
              .firestore()
              .collection('chats')
              .where('users', 'array-contains', _usr.email)
              .onSnapshot(async res => {
                const chats = []
                  res.docs.map(_doc =>  {
                    chats.push({id: _doc.id, ..._doc.data()})
                  });
                  await this.setState({
                    email: _usr.email,  
                    username: _usr.displayName,
                    chats: chats
                  });
              })
            }
        })
    }

}

export default withStyles(styles)(DashboardComponent);