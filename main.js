const  CLIENT_ID = '150122456951-k5rvsalmuc6s7efl0qgvk7fk5ri70qqv.apps.googleusercontent.com';

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');

const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'GoogleDevelopers';

// form submit
channelForm.addEventListener('submit', e=>{
  e.preventDefault();
  console.log("inside form submit");
  const channel = channelInput.value;

  getChannel(channel);
});
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

 function showChannelData(data){
   console.log("inside show channel data");
   const channelData = document.getElementById('channel-data');
   channelData.innerHTML = data;
 }
      /**
       * Print files. new line
       */
      function getChannel(channel) { 
        console.log("inside getchannel "+channel);
        gapi.client.youtube.channels.list({
          'part': 'snippet,contentDetails,statistics',
          'forUsername': channel
        }).then(function(response) {
          console.log(response);
          const channel = response.result.items[0];
          const output = `<ul class="collection">
          <li class="collection-item">Title : ${channel.snippet.title}</li>
          <li class="collection-item">ID : ${channel.id}</li>
          <li class="collection-item">Subscribers : ${numberWithCommas(channel.statistics.subscriberCount)}</li>
          <li class="collection-item">Views : ${numberWithCommas(channel.statistics.viewCount)}</li>
          <li class="collection-item">Videos :  ${numberWithCommas(channel.statistics.videoCount)}</li>
          </ul>
          <p>${channel.snippet.description}</p>
          <hr>
          <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${
            channel.snippet.customUrl
          }">Visit Channel</a>`;
          showChannelData(output);
         // playlist info
         const playlistId = channel.contentDetails.relatedPlaylists.uploads;
         console.log("playlist id "+playlistId);
         videoPlaylist(playlistId);
        })
        .catch(function(err){
          alert('no channels by that name');
        })
      }

      // number formatting
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      // video playlist
     function videoPlaylist(playlistId){
       console.log("inside video playlist");
            const requestOptions = {
              playlistId : playlistId,
              part : 'snippet',
              maxResultss : 10
            }
           const request = gapi.client.youtube.playlistItems.list(requestOptions);
           request.execute(resp =>{
             console.log("videos "+resp);
             const playlistItems = resp.result.items;
             if(playlistItems){
               let output = `<h4 class="center-align">Latest Videos</h4>`;
               playlistItems.forEach(item => {
                 const videoId = item.snippet.resourceId.videoId;
                 output += `<div class="col s3">
                 <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                 </div>`;
               })

               // output the videos
               videoContainer.innerHTML = output;
             }
             else{
               videoContainer.innerHTML = "no uploads for this channel";
             } 
           });
      }
