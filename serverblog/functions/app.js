const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("./permissions.json");
const cors = require('cors');
//app.use(cors({ origin: true }));
admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    databaseURL: "https://reactblog-c4b86.firebaseio.com"
});
const db = admin.firestore();
const express = require('express')
const app = express();
app.listen(8080);
app.get('/api/read/:item_id',(req,res)=>{
    (async ()=> {
        try{
            const document = db.collection('post').doc(req.params.item_id);
            let item =  await document.get();
            let response = item.data();
            return res.status(200).send(response);
        }catch (error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
app.get('/api/read',(req,res)=>{
    (async ()=> {
        try {
            let query = db.collection('post');
            let response = [];
            query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        item: doc.data().item
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();

});
app.post('api/create',(req,res)=>{
    (async ()=> {
        try{
            await db.collection('post').doc('/'+req.body.id+'/').create({item: req.body.item});
            return res.status(200).send();
        }catch (error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
app.put('api/update/:item_id',(req,res)=>{
    (async ()=> {
        try{
            const document = db.collection('post').doc(req.params.item_id);
            await document.update({
                item: req.body.item
            })
            return res.status(200).send();
        }catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})
app.delete('api/delete/:item_id',(req,res)=>{
    (async ()=> {
        try{
            const document = db.collection('post').doc(req.params.item_id);
            await document.delete();
            return res.status(200).send();
        }catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
exports.app = functions.https.onRequest(app);









