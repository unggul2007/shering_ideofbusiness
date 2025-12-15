const menu = document.getElementById("menu");
const feed = document.getElementById("feed");
const trending = document.getElementById("trending");
let user = null;

// MENU
menuBtn.onclick = () => menu.classList.toggle("hidden");

// TEMA
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
auth.onAuthStateChanged(u => user = u);

// POST IDE
function postIdea(){
  if(!user) return alert("Login dulu");
  db.collection("ideas").add({
    text: ideaText.value,
    user: user.displayName,
    uid: user.uid,
    category: category.value,
    likes: 0,
    views: 0,
    time: firebase.firestore.FieldValue.serverTimestamp()
  });
  ideaText.value="";
}

// LOAD IDE
db.collection("ideas").orderBy("time","desc")
.onSnapshot(snap=>{
  feed.innerHTML="";
  snap.forEach(doc=>{
    const d=doc.data();
    feed.innerHTML+=`
      <div class="post">
        <b>${d.user}</b> (${d.category})
        <p>${d.text}</p>
        ❤️ ${d.likes} | 👁 ${d.views}
        <button onclick="like('${doc.id}')">👍</button>
        <button onclick="comment('${doc.id}')">💬</button>
        <button onclick="follow('${d.uid}')">🤝 Follow</button>
      </div>
    `;
  });
});

// LIKE
function like(id){
  db.collection("ideas").doc(id)
  .update({ likes: firebase.firestore.FieldValue.increment(1) });
}

// KOMENTAR + BALASAN
function comment(id){
  const c = prompt("Komentar:");
  if(!c) return;
  db.collection("ideas").doc(id)
  .collection("comments").add({
    text:c,
    user:user.displayName,
    time:firebase.firestore.FieldValue.serverTimestamp()
  });
}

// FOLLOW
function follow(uid){
  if(!user) return;
  db.collection("follows").add({
    from:user.uid,
    to:uid
  });
}

// TRENDING
db.collection("ideas").orderBy("likes","desc").limit(3)
.onSnapshot(s=>{
  trending.innerHTML="";
  s.forEach(d=>{
    trending.innerHTML+=`<p>🔥 ${d.data().text}</p>`;
  });
});
