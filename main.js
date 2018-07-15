const  CLIENT_ID = '150122456951-k5rvsalmuc6s7efl0qgvk7fk5ri70qqv.apps.googleusercontent.com';

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');

const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'techguyweb';

// load Auth2 library
function handleClientLoad(){
    gapi.load('client:auth2',initClient);
}

/**
 *  *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
}

/**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          content.style.display = 'block';
          videoContainer.style.display = 'block';
          getChannel(defaultChannel);
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
          content.style.display = 'none';
          videoContainer.style.display = 'none';
        }
      }

 /**
       *  Sign in the user upon button click.
       */
function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
}

      /**
       *  Sign out the user upon button click.
       */
function handleSignoutClick() {
        gapi.auth2.getAuthInstance().signOut();
}


      /**
       * Print files. new line
       */
      function getChannel() {
        gapi.client.youtube.channels.list({
          'part': 'snippet,contentDetails,statistics',
          'forUsername': 'GoogleDevelopers'
        }).then(function(response) {
          console.log(response);
          // var channel = response.result.items[0];
          // appendPre('This channel\'s ID is ' + channel.id + '. ' +
          //           'Its title is \'' + channel.snippet.title + ', ' +
          //           'and it has ' + channel.statistics.viewCount + ' views.');
        })
        .catch(function(err){
          alert('no channels by that name');
        })
      }


