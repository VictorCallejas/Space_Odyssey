'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const dialogflow = require('dialogflow');
const fetch = require('isomorphic-fetch');
const round = require( 'math-round' );

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://console.firebase.google.com/project/hal-kkxfot/database/firestore/data/'
});
 
const db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
let action = '';

 try{
     action = request.body.queryResult.action;
 }catch(err){}


   function proxLaunch(agent) {
     var doc;
     var agency = request.body.queryResult.parameters.agency;
     if(agency === ''){
        agent.add(`This is the next launch`); 
         doc = db.collection('launches').orderBy('date', 'asc').limit(1);
     } else {
        agent.add(`This is the next launch of ` + agency); 
         doc = db.collection('launches').where('agency', '==', agency).orderBy('date', 'asc').limit(1);
     }
      
      return doc.get()
      .then(res => {
         res.forEach(d => {
        if (!d.exists) {
          agent.add('No data found in the database with that condition');
        } else {
          console.log(data);
          var data = d.data();
          console.log(data);
          var text2 = "Date: " + data.date.toDate() + "\nLocation: " + data.location + "\nAgency: " + data.agency + "\n"+data.text;
          var title2 = data.title;
          var imageUrl2 = data.imageUrl;
          var streamUrl2 = data.streamUrl;
      agent.add(new Card({
         title: title2,
         imageUrl: imageUrl2,
         text: text2,
         buttonText: 'Stream',
         buttonUrl: streamUrl2
     }));
        }
        return Promise.resolve('Read complete');
      });
     
     });
   }
   
   function infoagencies (agent){
     var doc;
     var agency = request.body.queryResult.parameters.agency;
     doc = db.collection('agencies').doc(agency);
     return doc.get()
      .then(d => {
        if (!d.exists) {
          agent.add('No data found in the database with that condition');
        } else {
          var data = d.data();
          var text2 = data.text;
          var title2 = data.title;
          var imageUrl2 = data.imageUrl;
          var streamUrl2 = data.buttonUrl;
      agent.add(new Card({
         title: title2,
         imageUrl: imageUrl2,
         text: text2,
         buttonText: 'More Info',
         buttonUrl: streamUrl2
     }));
        }
        return Promise.resolve('Read complete');
     
     });
   }
   
   
   function iss(agent){
     const url = "http://api.wheretheiss.at/v1/satellites/25544";
     return fetch(url)
    .then((res) => {
      if (res.status < 200 || res.status >= 300) {
        console.log(res);
      } else {
        return res.json();
      }
    })
    .then((json) => {
       var response = json;
       var latitude = response.latitude;
       var longitude = response.longitude;
       var vel = response.velocity;
       vel = round(vel);
       var alt = response.altitude;
       alt = round(alt);
       var iurl ='https://maps.googleapis.com/maps/api/staticmap?center='+latitude+','+longitude+'&zoom=3&scale=1&size=600x400&maptype=roadmap&key=AIzaSyDFFMO-xIgMFKtdrqkwg8XrtfHROgHtbLU&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C'+latitude+','+longitude;
       agent.add(new Card({
                title: 'International Space Station',
                imageUrl:iurl,
                text: 'International space station travels now at '+vel+' m/s at an altitude of '+alt+' km over image ubication.',
                buttonText: 'More information',
                buttonUrl: 'https://www.nasa.gov/mission_pages/station/main/index.html'
   }));
});
}
   
   
function welcome (agent){
    var source = request.body.originalDetectIntentRequest.source;
    var id = request.body.originalDetectIntentRequest.payload.data.message.chat.id;
    var name = request.body.originalDetectIntentRequest.payload.data.message.chat.first_name;
    id = id.toString();
    var data = {
        'name': name,
        'platform': source,
        'level': 0,
        'news': 'default',
        'remind':0
      };
      
    var doc = db.collection('users').doc(id).set(data).then(() => {
      return Promise.resolve('Read complete');
    });
}  

function actconfig (agent){
    
    var id = request.body.originalDetectIntentRequest.payload.data.message.chat.id;
    id = id.toString();
    console.log(id); 
    var data,name,level,news,remind,platform;
    var doc = db.collection('users').doc(id).get().then((res) => {
      data = res.data();
      name = data.name;
      platform = data.platform;
      if(data.level==1){
          level='rockie';
      }else if(data.level==2){
          level='amateur';
      }else{
          level='expert';
      }
      news = data.news;
      remind = data.remind;
      return Promise.resolve('Read complete');
    });
    agent.add('This is your actual configuration');
    agent.add('Name: '+name);
    agent.add('Platform: '+platform);
    agent.add('Level: '+level);
    agent.add('News: '+news);
    if(remind==-1){
          agent.add('Reminder: never');
      }else if(remind==5){
          agent.add('Reminder: 5 minutes before');
      }else if(level==15){
          agent.add('Reminder: 15 minutes before');
      }else if(remind == 60){
          agent.add('Reminder: 1 hour before');
      }else{
          agent.add('Reminder: 1 day before');
      }
    agent.add("Remember, if you want to change your configuration you only have to  say it");
}  

if(action=='updateLevel'){
    var level = request.body.queryResult.parameters.level;
    var n = 3;
    if(level == 'rookie'){
        n = 1;
    }else if(level == 'amateur'){
        n = 2;
    }
    var id = request.body.originalDetectIntentRequest.payload.data.callback_query.message.chat.id;
    id = id.toString();
    var data = {
        'level' : n
    };
    var doc = db.collection('users').doc(id).update(data).then(() => {
    console.log('Write level succeeded!');
    return Promise.resolve('Read complete');
  });
}

if(action=='updateNews'){
    var newsfreq = request.body.queryResult.parameters.newsfreq;
    var id = request.body.originalDetectIntentRequest.payload.data.callback_query.message.chat.id;
    id = id.toString();
    var data = {
        'news' : newsfreq
    };
    var doc = db.collection('users').doc(id).update(data).then(() => {
    console.log('Write news succeeded!');
    return Promise.resolve('Read complete');
  });
}

if(action=='updateRemind'){
    var reminder = request.body.queryResult.parameters.reminder;
    var n3 = 5;
    var id = request.body.originalDetectIntentRequest.payload.data.callback_query.message.chat.id;
    id = id.toString();
    console.log(reminder);
    if(reminder == 'never'){
        n3=-1;
    }else if(reminder=='5min'){
        n3=5;
    }else if(reminder=='15min'){
        n3=15;
    }else if(reminder =='1hour'){
        n3=60;
    } else {
        n3 = 1440;
    }
    var data = {
        'remind' : n3
    };
    var doc = db.collection('users').doc(id).update(data).then(() => {
    return Promise.resolve('Read complete');
  });
}



  let intentMap = new Map();
  intentMap.set('Default Welcome Intent (setup)', welcome);
  intentMap.set('actconfig', actconfig);
  intentMap.set('nextlaunch', proxLaunch);
  intentMap.set('infoagencies', infoagencies);
  intentMap.set('iss', iss);
  agent.handleRequest(intentMap);
});
