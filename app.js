// ELEMENT
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const feed = document.getElementById("feed");
const trending = document.getElementById("trending");
const ideaText = document.getElementById("ideaText");
const category = document.getElementById("category");

let currentUser = null;

// MENU
menuBtn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// THEME
function toggleTheme(){
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

// LOGIN
function login(){
  auth.signInWithPopup(provider);
}

function logout(){
  auth.signOut();
}

// AUTH STATE
auth.onAuthStateChanged(user=>{
  currentUser = user;
});

// POST IDE
function postIdea(){
  if(!currentUser){
    alert("Silakan login dulu");
    return;
  }

  if(ideaText.value.trim()==="") return;

  db.collection("ideas").add({
    text: ideaText.value,
    category: category.value,
    user: currentUser.displayName,
    uid: currentUser.uid,
    likes: 0,
    views: 0,
    created: firebase.firestore.FieldValue.serverTimestamp()
  });

  ideaText.value="";
}

// LOAD IDE + VIEW
db.collection("ideas")
.orderBy("created","desc")
.onSnapshot(snapshot=>{
  feed.innerHTML="";
  snapshot.forEach(doc=>{
    const d = doc.data();

    // tambah view
    db.collection("ideas").doc(doc.id)
      .update({ views: firebase.firestore.FieldValue.increment(1) });

    feed.innerHTML += `
      <div class="post">
        <b>${d.user}</b> - ${d.category}
        <p>${d.text}</p>
        👍 ${d.likes} | 👁 ${d.views}
        <br>
        <button onclick="likeIdea('${doc.id}')">Like</button>
        <button onclick="commentIdea('${doc.id}')">Komentar</button>
      </div>
    `;
  });
});

// LIKE
function likeIdea(id){
  db.collection("ideas").doc(id)
    .update({ likes: firebase.firestore.FieldValue.increment(1) });
}

// KOMENTAR
function commentIdea(id){
  if(!currentUser) return alert("Login dulu");

  const text = prompt("Tulis komentar");
  if(!text) return;

  db.collection("ideas")
    .doc(id)
    .collection("comments")
    .add({
      text,
      user: currentUser.displayName,
      time: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// TRENDING
db.collection("ideas")
.orderBy("likes","desc")
.limit(3)
.onSnapshot(snapshot=>{
  trending.innerHTML="";
  snapshot.forEach(doc=>{
    trending.innerHTML += `<p>🔥 ${doc.data().text}</p>`;
  });
});

