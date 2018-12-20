
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDGRgvzH2zPO8WmAAe_E0TdRPsOO_fbgDo",
    authDomain: "spruce-kets.firebaseapp.com",
    databaseURL: "https://spruce-kets.firebaseio.com",
    projectId: "spruce-kets",
    storageBucket: "spruce-kets.appspot.com",
    messagingSenderId: "627442779427"
};
firebase.initializeApp(config);
var db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

function submitForm() {

    // link html
    var contactName = document.getElementById("contactName").value;
    var contactEmail = document.getElementById("contactEmail").value;
    var contactWho = document.getElementById("contactWho").value;
    var contactMessage = document.getElementById("contactMessage").value;

    // get date
    var time = new Date().getTime();
    var date = new Date(time);

    // create object
    var mailObject = {
        Name: contactName,
        Email: contactEmail,
        For: contactWho,
        Message: contactMessage,
        Date: date
    };

    verifyObject(mailObject);

}

function verifyObject(mailObject) {

    // check Email
    var isEmail = mailObject.Email.includes("@");
    if (isEmail == true) {
        isEmail = mailObject.Email.includes(".");
        if (isEmail == true) {
            isEmail = mailObject.Email.length;
            if (isEmail >= 7)
            // Check Name length
            var isName = mailObject.Name.length;
            if (isName < 50 && isName >= 2) {
                //    check message length
                var isMessage = mailObject.Message.length;
                if (isMessage < 500) {
                    pushMail(mailObject);
                }
            }
        }
    }
}

function pushMail(verifiedObject) {

    // create Ref
    var personRef = db.collection(verifiedObject.For).doc(verifiedObject.Email);

    // check old or new mailer?
    personRef.get().then(function (doc) {
        if (doc.exists) {
            console.log("OLD MAILER");
           

            var lastMail = doc.data();


            var lastDate = lastMail.mail[lastMail.mail.length - 1].Date;
            lastDate = lastDate.seconds;
           

            var newDate = new Date().getTime()/1000;

         



            var timePassed = newDate - lastDate;

            console.log("time gone by:" + timePassed);


            // if not same day
            if (timePassed > 86400) {

                // upadate Object
                return personRef.update({
                    mail: firebase.firestore.FieldValue.arrayUnion(verifiedObject)
                })
                    .then(function () {
                        console.log("Document successfully updated!");
                    })
                    .catch(function (error) {
                        // The document probably doesn't exist.

                    });

            }
            else{
                console.error("SPAM!")
            }


        } else {
            // doc.data() will be undefined in this case
            console.log("NEW MAILER");
            // new mailer
            
            // create List
            var mailArray = [verifiedObject];


            // Save Array as Object
            var forFirebase = {
                mail: mailArray
            }

            // push to firebase as NEW
            personRef.set(forFirebase);
            console.log("Sent!")
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });




}
