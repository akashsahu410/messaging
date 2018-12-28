const userdb=require('./signupschema')
module.exports={
    //to save the data of signup form
    savedata(data){
        return new Promise((resolve,reject)=>{
            console.log("inside the api",data)
            userdb.create(data,(err,result)=>{
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
    finddata(data){
        return new Promise((resolve,reject)=>{
            console.log("inside the api",data)
            userdb.find(data,(err,result)=>{
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