const mongo=require("mongoose");
const username="slim";
const password="slimshady45"
const url=`mongodb://${username}:${password}@cluster0-shard-00-00.dzinj.mongodb.net:27017,cluster0-shard-00-01.dzinj.mongodb.net:27017,cluster0-shard-00-02.dzinj.mongodb.net:27017/?ssl=true&replicaSet=atlas-m7xgv4-shard-0&authSource=admin&retryWrites=true&w=majority`;
const data=async ()=>
{
    console.log("Connection Successful!!!");
}
const connectToMongo=async ()=>{(mongo.connect(url,data))};
module.exports=connectToMongo;