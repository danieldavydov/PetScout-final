// Config firebase project
const firebaseConfig = {
  apiKey: "AIzaSyAvvvBU_tRsHyVBOfyRkioSRUgmGqdUqEA",

  authDomain: "petscout.firebaseapp.com",

  databaseURL: "https://petscout-default-rtdb.firebaseio.com",

  projectId: "petscout",

  storageBucket: "petscout.appspot.com",

  messagingSenderId: "358148461721",

  appId: "1:358148461721:web:13e6fa62efbda902ba9408",

  measurementId: "G-SF372HLEF3",
};

// Initailize the project
firebase.initializeApp(firebaseConfig);

// Create and References Database to anonForumDB
var anonForumDB = firebase.database().ref("anonForum");

document.getElementById("anonForum").addEventListener("submit", submitForum);

/* 
    Gets value of the id; used in the submitForum function.
*/
const getValue = (id) => {
  return document.getElementById(id).value;
};

function submitForum(e) {
  e.preventDefault(); // prevents from submitting empty forum

  var username = "Anon" + (Math.floor(Math.random() * 1000) + 1);
  var postContent = getValue("postContent");

  if (postContent != "") {
    savePost(username, postContent);

    // After successful upload, the alert shows up
    document.querySelector(".statusAlert").style.display = "block";

    // Reset forum after posting
    document.getElementById("anonForum").reset();

    // Remove alert after 3 seconds
    setTimeout(() => {
      document.querySelector(".statusAlert").style.display = "none";
    }, 3000);
  }
}

/*
    Pushes content to DB; creating a new post.
*/
const savePost = (username, postContent) => {
  var newPost = anonForumDB.push();

  newPost.set({
    username: username,
    postContent: postContent,
  });
};

/*
    Display items from database to website
*/
function addPosts(username, postContent) {
  var mainDiv = document.createElement("div");
  var name = document.createElement("h5");
  var post = document.createElement("p");

  name.innerHTML = username;
  post.innerHTML = postContent;

  mainDiv.appendChild(name);
  mainDiv.appendChild(post);
  document.querySelector("#posts").appendChild(mainDiv);
}

function fetchData() {
  var arr = [];
  anonForumDB.on("value", (snapshot) => {
    let data = snapshot.val();
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let childData = data[key];
      let username = childData.username;
      if (!arr.includes(username)) {
        let postContent = childData.postContent;
        addPosts(username, postContent);
        arr.push(username);
      }
    }
  });
  console.log(arr);
}
