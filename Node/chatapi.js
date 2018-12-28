const userdb=require('./chatschema')
module.exports={
    //to save the data of chat
    savedata(key1,key2,data){
        return new Promise((resolve,reject)=>{
            console.log("inside the api",data)
            userdb.update({$or:[{$and:[{senderRoom:key1},{receiverRoom:key2}]},
                                {$and:[{senderRoom:key2},{receiverRoom:key1}]}
                                ]},{$push:{chat:data}},(err,result)=>{
                if(err)
                {
                    reject(err)
                }
                else{
                    resolve(result)
                }
            })
        });
    },
    //to check login data
    finddata(data1,data2){
        return new Promise((resolve,reject)=>{
            console.log("inside the api",data1,data2)
            userdb.find({$or:[{$and:[{senderRoom:data1},{receiverRoom:data2}]},
                {$and:[{senderRoom:data2},{receiverRoom:data1}]}]},(err,result)=>{
                if(err)
                {
                    console.log("error in api main",err)
                    reject(err)
                }
                else{
                    resolve(result)
                }
            })
        });
    },
    //to create new data
    createdata(data){
        return new Promise((resolve,reject)=>{
            console.log("inside the create api",data)
            userdb.create(data,(err,result)=>{
                if(err)
                {
                    console.log("error in api main",err)
                    reject(err)
                }
                else{
                    resolve(result)
                }
            })
        });
    },
}