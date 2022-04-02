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
            window.location = "index.html";

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

function logOut(){
    localStorage.removeItem("userName"); //logout user
    window.location.href = "index.html";
}

function signUp(){

    var userId = db.collection("users").doc().id;

    var newuser = document.getElementById("addusername").value;
    var newrealname = document.getElementById("addrealname").value;
    var newpass = document.getElementById("addpassword").value;
    var newemail = document.getElementById("addemail").value;

    db.collection("users").doc(userId).set({
        realname: newrealname,
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

        window.location = "index.html";

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


    var checkuserexist = localStorage.getItem("userName");

    console.log(checkuserexist);
    if (checkuserexist == null){
        alert("You need to log in / sign up to create a room first");
        window.location.href="auth.html";
        return;
    }
    else{

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
            localStorage.setItem("sessionID", myId);

            //todo: bring user to create questions
            window.location.href = "set-question-answers.html";

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
}

//used in set-question-answers.html for setting questions
var questionNo = 1;
function questNo(){
    var questionnumb = document.getElementById("questionno");
    questionnumb.innerHTML = "";
    questionnumb.innerHTML = "Question No. " + questionNo;
}
function createQuestions(){
    
    var sessionid = localStorage.getItem("sessionID"); //get session id from sessionstorage

    var myId = db.collection("questions").doc().id;
    


    var question = document.getElementById("addquestion").value;
    var answer = document.getElementById("addanswer").value;
    var newa = document.getElementById("adda").value;
    var newb = document.getElementById("addb").value;
    var newc = document.getElementById("addc").value;
    var newd = document.getElementById("addd").value;

    if (answer == newa || answer == newb || answer == newc || answer == newd){
        db.collection("questions").doc(myId).set({
            question: question,
            sessionid: sessionid,
            questionno: questionNo.toString(),
            answer: answer,
            a: newa,
            b: newb,
            c: newc,
            d: newd,
        })
        .then(function(docRef) {
            console.log("Question inserted!");
    
            //todo: redirect user back to control page
            questionNo++;
            document.getElementById("addquestion").value = '';
            document.getElementById("addanswer").value = '';
            document.getElementById("adda").value = '';
            document.getElementById("addb").value = '';
            document.getElementById("addc").value = '';
            document.getElementById("addd").value = '';
            questNo(questionNo);
    
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
    else{
        alert("Please enter an answer that matches one of the options!")
    }
}

//once user has created enough questions and clicked "finish", trigger this
function createQuestionsGoNext(){
    
    var sessionid = localStorage.getItem("sessionID"); //get session id from sessionstorage

    var myId = db.collection("questions").doc().id;
    
    var question = document.getElementById("addquestion").value;
    var answer = document.getElementById("addanswer").value;
    var newa = document.getElementById("adda").value;
    var newb = document.getElementById("addb").value;
    var newc = document.getElementById("addc").value;
    var newd = document.getElementById("addd").value;

    if (answer == newa || answer == newb || answer == newc || answer == newd){
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
    
                questionNo = 1; 
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
    else{
        alert("Please enter an answer that matches one of the options!")
    }
}

//displaying session id on the display-room page (before quiz starts)
function getSessionID(){

    var sessionid = localStorage.getItem("sessionIDTemp");

    var el_down = document.getElementById("sessionid");
    el_down.value = sessionid;
}


//joining session
function joinRoom(){
    var checkuserexist = localStorage.getItem("userName");

    localStorage.removeItem("sessionIDTemp");

    console.log(checkuserexist);
    if (checkuserexist == null){
        alert("You need to log in / sign up to join a session first");
        window.location.href="auth.html";
        return;
    }
    else{

        var sessionid = document.getElementById("joinRoomInput").value;

        var session_array = [];

        db.collection("sessions")
        .get()
        .then(snapshot => {
        //let changes = snapshot.docChanges();
        const documents = snapshot.docs //array of documents
        
        documents.forEach((doc) => {
            const docData = doc.data() //Data of that single document
            console.log(session_array);
            session_array.push(docData["sessionid"]);

            for (var i = 0; i < session_array.length; i++){
                if (sessionid == session_array[i]){

                    localStorage.setItem("sessionIDTemp", sessionid);
                    window.location.href = "question-answers.html";
                    return;
                }
                else if (i ==session_array.length-1 && sessionid != session_array[i]){
                    alert("Invalid Room Code!");
                }
            }
        })
        });

    }
}



//display questions and correct ans
var count = 0; //global variable for question count
function displayQuestions(){

    var ansfield = document.getElementById("correctans");
    ansfield.innerHTML = " ";

    var dispqns = [];

    var session_id = localStorage.getItem("sessionIDTemp");
    //var session_id = "EoV11mmUgFR9VpXBHxwH"; //for debugging
    var dispanswer = document.getElementById("disans");
    dispanswer.style.display = "none";

    var dispend = document.getElementById("disend");
    dispend.style.display = "none";

    db.collection("questions")
    .where("sessionid", "==", session_id)
    .get()
    .then(snapshot => {
        
        const documents = snapshot.docs //array of documents
        documents.forEach((doc) => {
            const docData = doc.data() //Data of that single document
            console.log("question call success!")
            dispqns.push(docData);
           
        })
        
        console.log(dispqns);

        var dispqestion = document.getElementById("disqn");
        dispqestion.style.display = "block";

        var question = document.getElementById("question");
        var choiceA = document.getElementById("choiceA");
        var choiceB = document.getElementById("choiceB");
        var choiceC = document.getElementById("choiceC");
        var choiceD = document.getElementById("choiceD");

        question.innerHTML = dispqns[count].question;
        choiceA.innerHTML = dispqns[count].a;
        choiceB.innerHTML = dispqns[count].b;
        choiceC.innerHTML = dispqns[count].c;
        choiceD.innerHTML = dispqns[count].d;

        //begin interval for displaying question (10 secs of displaying)
        timeout = setTimeout(alertFunc, 10000);

        function alertFunc() {
            var correctans = dispqns[count].answer;
            count++;

            var dispqestion = document.getElementById("disqn");
            dispqestion.style.display = "none";
            var dispanswer = document.getElementById("disans");
            dispanswer.style.display = "block";
        
            if (count < dispqns.length){
                

                //display answers for 15 secs before moving on to next qn
                timeout = setTimeout(recallFunc, 15000);

                var ansfield = document.getElementById("correctans");
                ansfield.innerHTML = correctans;
                
                function recallFunc(){
                    displayQuestions();
                }
            }
            else{ //once quiz has ended

                var ansfield = document.getElementById("correctans");
                ansfield.innerHTML = correctans;

                var dispend = document.getElementById("disend");
                dispend.style.display = "block";
                
                timeout = setTimeout(recallFunc, 15000);

                function recallFunc(){
                    window.location.href="leaderboard.html";
                }


                return;
            }

          }

    });
}




//display leaderboard function (called by leaderboards.html body onload), TEST WITH ANOTHER USER (NEED USE ANDROID STUDIO)
function displayLeaderboard(){

    var students_array = [];
    var responses_array = [];

    var pointcount;
    
    var session_id = localStorage.getItem("sessionIDTemp");
    //var session_id = "EoV11mmUgFR9VpXBHxwH"; //for debugging

    var leaderboard = document.getElementById("results");
    leaderboard.innerHTML = "";


    db.collection("responses")
    .where("sessionid", "==", session_id)
    .get()
    .then(snapshot => {
        
        const documents = snapshot.docs //array of documents
        documents.forEach((doc) => {
            const docData = doc.data() //Data of that single document
            console.log("question call success!")
            students_array.push(docData["username"]);
            responses_array.push(docData);
           
        })
        
        console.log(students_array);
        uniq = [...new Set(students_array)]; //cleanse duplicate usernames from array

        console.log(uniq);
        console.log(responses_array);

        for (i = 0; i < uniq.length; i++) {
            console.log("now at: " + uniq[i]);

            pointcount = 0;

            for (x = 0; x < responses_array.length; x++) {

                if (uniq[i] == responses_array[x].username && responses_array[x].correctWrong == 1) {

                    console.log("mathc");

                    pointcount++;
                }
                // else if (x == responses_array.length-1 && (uniq[i] != responses_array[x].username || responses_array[x].correctWrong != 1)) {
                //     //display student name and score on webpage
                //     //innerHtml = uniq[i].name + "   " + pointcount; 
                //     leaderboard.innerHTML = uniq[i] + ", score:" + pointcount;
                //     // console.log(uniq[i] + ", score:" + pointcount); 
                // }
                // else if (x == responses_array.length-1){
                //     pointcount++;
                //     //display student name and score on webpage
                //     leaderboard.innerHTML = uniq[i] + ", score:" + pointcount;
                // }
            }
            var html = "<p>student name: " + uniq[i] + ", score: " + pointcount + "</p>";
            leaderboard.insertAdjacentHTML('beforeend', html);
        }

    });
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
function endSession(){

    var sessionid = localStorage.getItem("sessionIDTemp"); //to get sessionid when user clicks 'end session'
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

    
    localStorage.removeItem("sessionIDTemp"); //remove the locally stored session id once and for all
    localStorage.removeItem("userName"); //logout user
    window.location.href = "index.html";
}