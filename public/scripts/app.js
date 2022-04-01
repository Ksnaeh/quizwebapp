console.log("start")

//initialise arrays
var users = [];
var sessions = [];
var questions = [];
var responses = [];

var config = {
    apiKey: "AIzaSyBqBl6T-IuzOLXTVNVEmoE4FIIhdxUEIDc",
    authDomain: "wemediaapp.firebaseapp.com",
    projectId: "wemediaapp",
    storageBucket: "wemediaapp.appspot.com",
    messagingSenderId: "1007525656746",
    appId: "1:1007525656746:web:0ddf29cf6fd4da3c15f8d3",
    measurementId: "G-G5HNBBRLTX"
  };
  firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });


//RETRIEVE: get users
db.collection("users")
  .get()
  .then(snapshot => {
    //let changes = snapshot.docChanges();
    //console.log(snapshot.data())
    const documents = snapshot.docs //array of documents
    
    documents.forEach((doc) => {
        const docData = doc.data() //Data of that single document
        //console.log(docData)
        users.push(docData);
        //store into a js array
        //renderToHtml() // Code that creates new HTML elements
    })
});

//RETRIEVE: get questions
db.collection("questions")
  .get()
  .then(snapshot => {
    //let changes = snapshot.docChanges();
    //console.log(snapshot.data())
    const documents = snapshot.docs //array of documents
    documents.forEach((doc) => {
        const docData = doc.data() //Data of that single document
        console.log("call success!")
        questions.push(docData);
        //store into a js array
        //renderToHtml() // Code that creates new HTML elements
    })
});

//RETRIEVE: get responses
db.collection("responses")
  .get()
  .then(snapshot => {
    //let changes = snapshot.docChanges();
    //console.log(snapshot.data())
    const documents = snapshot.docs //array of documents
    documents.forEach((doc) => {
        const docData = doc.data() //Data of that single document
        //console.log(doc.getId())
        responses.push(docData);
        //store into a js array
        //renderToHtml() // Code that creates new HTML elements
    })
});

//LOGIN AND SIGNUP TESTED WORKING
function logIn(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    console.log(users);

    for (var x = 0; x < users.length; x++){
        if (users[x].username == username && users[x].password == password && users[x].role == "teacher"){
            console.log(users[x].username); 

            //todo: sessionstorage the username
            localStorage.setItem("userName", username);
            window.location = "dashboard.html";

            return;
        }
        else if (users[x].username == username && users[x].password == password && users[x].role == "student"){
            console.log(users[x].username); 
        
            alert("Dear Student, please login thru the app instead. Thank you!")

            return;
        }
        else if (x == users.length-1 && (users[x].username != username || users[x].password != password)){
            return alert("wrong username / password!");
        }
    }
}

function signUp(){

    var userId = db.collection("users").doc().id;

    var newuser = document.getElementById("addusername").value;
    var newpass = document.getElementById("addpassword").value;
    var newemail = document.getElementById("addemail").value;

    db.collection("users").doc(userId).set({
        username: newuser,
        password: newpass,
        email: newemail,
        id: userId,
        role: "teacher" 
    })
    .then(function(docRef) {
        console.log("signed up!");

        
        alert("User has been added!");


        //todo: sessionstorage the username
        localStorage.setItem("userName", newuser);

        window.location = "dashboard.html";

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}


//TODO: DISPLAYING QUESTION AND ANSWER, AS WELL AS LEADERBOARD
//view responses (insert responses to be done on mobile app side)
function getResponses(){
    for (var x = 0; x < responses.length; x++){
        console.log(responses[x]);

    }
}

//TESTED WORKING: create, retrieve sessions, then get questions and responses by sessionid
function getSessionByUsername(){
    console.log("starting session");
    //console.log(sessions);

    var sessionid = localStorage.getItem("sessionID");

    //TODO: load page when complete

    var uname = "prof";

    db.collection("sessions").get().then(snapshot => {
        //let changes = snapshot.docChanges();
        //console.log(snapshot.data())
        const documents = snapshot.docs //array of documents
        
        documents.forEach((doc) => {
            const docData = doc.data() //Data of that single document
            //console.log(docData)
            sessions.push(docData);
            //store into a js array
            //renderToHtml() // Code that creates new HTML elements
            console.log(sessions.length);
            for (var x = 0; x < sessions.length; x++){
                //console.log(sessions[x]);
               // console.log(x);
                //TODO: change this to sessionStorage variable;
        
                if (sessions[x].username == uname && sessionid == sessions[x].sessionid){
        
                    getQuestionsBySession(sessions[x].sessionid);
                    getResponsesBySession(sessions[x].sessionid);
                    //return;
                }
                //TODO: print the questions out in the html along with responses (control.html)
            }
        })
    });
}

function getQuestionsBySession(id){


    for (var x = 0; x < questions.length; x++){
       
        if (id == questions[x].sessionid){
            console.log(questions[x]);


            return;
        }

        //TODO: print the questions out in the html along with responses (control.html)
    }
}

function getResponsesBySession(id){
    for (var x = 0; x < responses.length; x++){
        
        if (id == responses[x].sessionid){
            console.log(responses[x]);

            return;
        }
        //TODO: print the responses out in the html along with qn (control.html)
        //session store sessionid here
    }
}




// //TODO: create, retrieve, update questions
// function getQuestions(){
//     for (var x = 0; x < questions.length; x++){
//         console.log(questions[x]);
//         //TODO: print the questions out in the html along with responses (control.html)
//     }
// }



//CREATE SESSION, QUESTIONS AND DISPLAYING SESSION ID BEFORE QUIZ STARTS
//add session to db and go to set-question-answers.html
function createSession(){

    var myId = db.collection("sessions").doc().id;

    myId = myId.substring(0, 7);
    
    var uname = localStorage.getItem("userName");

    // var answer = document.getElementById("addanswer").value;
    // var newa = document.getElementById("adda").value;
    // var newb = document.getElementById("addb").value;
    // var newc = document.getElementById("addc").value;
    // var newd = document.getElementById("addd").value;

    db.collection("sessions").doc(myId).set({
        sessionid: myId,
        username: uname,
    })
    .then(function(docRef) {
        console.log("Session created!");

        //add sessionid to localstorage
        localStorage.setItem("sessionID", sessionid);

        //todo: bring user to create questions
        window.location.href = "set-question-answers.html";

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

//used in set-question-answers.html for setting questions
function createQuestions(){
    
    var sessionid = localStorage.getItem("sessionID"); //get session id from sessionstorage

    var myId = db.collection("questions").doc().id;
    
    var questionNo = 1;
    var question = document.getElementById("addquestion").value;
    var answer = document.getElementById("addanswer").value;
    var newa = document.getElementById("adda").value;
    var newb = document.getElementById("addb").value;
    var newc = document.getElementById("addc").value;
    var newd = document.getElementById("addd").value;

    db.collection("questions").doc(myId).set({
        question: question,
        sessionid: sessionid,
        questionno: questionNo.toString(),
        questionid: myId,
        answer: answer,
        a: newa,
        b: newb,
        c: newc,
        d: newd,
    })
    .then(function(docRef) {
        console.log("Question inserted!");

        //todo: redirect user back to control page
        // questionNo++;
        location.reload()

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

//once user has created enough questions and clicked "finish", trigger this
function createQuestionsGoNext(){
    
    var sessionid = localStorage.getItem("sessionID"); //get session id from sessionstorage

    var myId = db.collection("questions").doc().id;
    
    var questionNo = 1;
    var question = document.getElementById("addquestion").value;
    var answer = document.getElementById("addanswer").value;
    var newa = document.getElementById("adda").value;
    var newb = document.getElementById("addb").value;
    var newc = document.getElementById("addc").value;
    var newd = document.getElementById("addd").value;

    db.collection("questions").doc(myId).set({
        question: question,
        sessionid: sessionid,
        questionno: questionNo.toString(),
        questionid: myId,
        answer: answer,
        a: newa,
        b: newb,
        c: newc,
        d: newd,
    })
    .then(function(docRef) {
        console.log("Question inserted!");

        console.log(sessionid);

        //todo: redirect user back to control page
        var nextpage = confirm("Proceed to start quiz?");
        if (nextpage == true){
            localStorage.setItem("sessionIDTemp", sessionid);

            window.location.href = "display-room.html";
        
        }
        else{
            location.reload();
        }

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

//displaying session id on the display-room page (before quiz starts)
function getSessionID(){

    var sessionid = localStorage.getItem("sessionIDTemp");

    var el_down = document.getElementById("sessionid");
    el_down.innerHTML = "Session ID = " + sessionid;
}





//ADDITIONAL FUNCTIONS, MAY IMPLEMENT
//TESTED WORKING
function editQuestions(questionid){

    var sessionid; //get session id from sessionstorage

    var questionNo = document.getElementById("editquestionNo").value; //non-editable
    var questionid = questionid;
    
    //actual editable fields
    var question = document.getElementById("editquestion").value;
    var answer = document.getElementById("editanswer").value;
    var newa = document.getElementById("edita").value;
    var newb = document.getElementById("editb").value;
    var newc = document.getElementById("editc").value;
    var newd = document.getElementById("editd").value;

    db.collection("questions").doc(questionid).update({
        question: question,
        answer: answer,
        a: newa,
        b: newb,
        c: newc,
        d: newd,
    })
    .then(function(docRef) {
        console.log("Question has been edited successfully");

        //TODO: redirect user back to control page

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}
//TESTED WORKING
function removeQuestion(){

    var questionid = document.getElementById("questionid").value; //get questionid from a hidden val

    db.collection("questions").doc(questionid).delete().then(() => {
        console.log("Document successfully deleted!");

        //redirect user / refresh page

    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    
}





//END SESSION (BUTTON TO BE FOUND IN LEADERBOARD)
function endSession(id){

    var sessionid = id; //to get sessionid when user clicks 'end session'
    db.collection("sessions").doc(sessionid).delete().then(() => {
        console.log("Document successfully deleted!");


    }).catch((error) => {
        console.error("Error removing document: ", error);
    });

    deleteAllQuestions(sessionid);

}

function deleteAllQuestions(sessionid){
    
    var jobskill_ref = db.collection('questions').where('sessionid','==',sessionid);
    let batch = db.batch();

    jobskill_ref
    .get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
        });
        return batch.commit();
    })

    deleteResponses(sessionid);

}

function deleteResponses(sessionid){
    var delete_respons = db.collection('responses').where('sessionid','==',sessionid);
    let batch = db.batch();

    delete_respons
    .get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
        });
        return batch.commit();
    })

    //TODO: refresh page / bring user back to home page
    window.location.href = "dashboard.html"
}