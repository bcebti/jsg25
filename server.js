var express=require("express");
var fileUploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;

var mysql2=require("mysql2");

var app=express();


//ok

app.listen(2004,function(){
    console.log("Server Started");
})


//for style and script files
app.use(express.static("public"));


app.get("/",function(req,resp){
    
    // resp.sendFile();
    let dirName=__dirname;//Global Variable for path of current directory
    //let filename=__filename;
    //resp.send(dirName+"  <br>     "+filename);
    let fullpath=dirName+"/public/index.html";
    resp.sendFile(fullpath);
})


app.get("/angular-http",function(req,resp){
    
    
    let dirName=__dirname;//Global Variable for path of current directory
    let fullpath=dirName+"/public/angular-http.html";
    resp.sendFile(fullpath);
})


app.get("/login",function(req,resp){
    resp.write("Its LOGIN Page");
    resp.end();
})

app.get("/signup",function(req,resp){
    resp.sendFile(__dirname+"/public/signup.html");
})
app.get("/forgot",function(req,resp){
    resp.send("Whats my Passowrd");// resp. to client
})

app.get("/url-signup-process",function(req,resp){
    
    //resp.send(req.query);
    let qual="NO";
    if(req.query.chkBt!=undefined)
           qual=req.query.chkBt+",";

    if(req.query.chkMt!=undefined)
        {
            if(qual=="NO")
               
                qual="";
                qual+=req.query.chkMt;
               
        }
  
        /*let all;
        if(req.query.chk==undefined)
        {
            all="No Qualification";
        }
        else
        {
        let ary=req.query.chk;
         all=ary.toString();
        }
         */
        let state=req.query.state;
        let technosAry=req.query.techs;
        let strTechnos=technosAry.toString();

    resp.send("U have  Signned Up Successfulllyy Mr/Ms="+req.query.txtEmail+"   Occupation="+req.query.occu+" <br> Qualification="+qual+"<br>State="+state+"<br>Tehnologies U Know= "+strTechnos);
});

app.get("/url-login-process",function(req,resp){
   
    resp.send("Lgged In :"+req.query.txtEmail+" password="+req.query.txtPwd);
});



app.use(express.urlencoded(true)); //convert POST data to JSON object
        app.use(fileUploader());//to recv. and upload pic on server from client

        cloudinary.config({ 
            cloud_name: 'dfyxjh3ff', 
            api_key: '261964541512685', 
            api_secret: 'PfRVIo1IagO5z_ZnNFI1TQ7DOLc' // Click 'View API Keys' above to copy your API secret
        });
        

app.post("/url-signup-process-secure",async function(req,resp)
{
    let fileName;
    if(req.files!=null)
    {
        fileName=req.files.profPic.name;
        let locationToSave=__dirname+"/public/uploads/"+fileName;//full ile path
        req.files.profPic.mv(locationToSave);//saving file in uploads folder

         //saving ur file/pic on cloudinary server
         await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
            fileName=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName);
      });
    }
    else
    fileName="nopic.jpg";

    let str=JSON.stringify(req.body);
    resp.send("U have  Signned Up Successfulllyy Mr/Ms="+req.body.txtEmail+" <br> File Name="+fileName);
});


//Connecting to DB==========================================
let dbConfig="mysql://avnadmin:AVNS_9d9lWDFvM4veF1SFvBo@mysql-174f82a4-bcebti.g.aivencloud.com:11183/defaultdb";

let mySqlServer=mysql2.createConnection(dbConfig);

mySqlServer.connect(function(err){
    if(err!=null)
    {
        console.log(err.message);
    }
    else
        console.log("Connected to DB")
    
})
//----------------------------------------------

app.get("/curd-signup",function(req,resp){
    
   
    let dirName=__dirname;//Global Variable for path of current directory
    let fullpath=dirName+"/public/curd-profile.html";
    resp.sendFile(fullpath);
})

app.post("/curd-save",async function(req,resp)
{
    let txtEmail=req.body.txtEmail;
    let txtPwd=req.body.txtPwd;
    let txtDob=req.body.txtDob;

    let fileName;
    if(req.files!=null)
    {
        fileName=req.files.ppic.name;
        let locationToSave=__dirname+"/public/uploads/"+fileName;//full ile path
        req.files.ppic.mv(locationToSave);//saving file in uploads folder

         //saving ur file/pic on cloudinary server
         await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
            fileName=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName);
      });
    }
    else
    fileName="nopic.jpg";

    mySqlServer.query("insert into curdTable values(?,?,?,?)",[txtEmail,txtPwd,txtDob,fileName],function(err)
    {
            if(err==null)
            {
                resp.send("Record Saved Successsfulllyyy.. Badhaiiii");
            }
            else
            resp.send(err.message);
    })
})


app.post("/do-delete",function(req,resp)
{
    let userMail=req.body.txtEmail;
                                                  //col name Same as  table col name
    mySqlServer.query("delete from curdTable where email=?",[userMail],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("Record Deleted Successfulllyyyy");
            else
            resp.send("Inavlid User Id");
        }
        else
        resp.send(err.message);
    })
})

app.post("/do-fetch-all",function(req,resp)
{
    mySqlServer.query("select * from curdTable",function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/do-fetch-one",function(req,resp)
{
    mySqlServer.query("select * from curdTable where email=?",[req.query.KuchBhi],function(err,resultAry)
    {
        // console.log(result);
        
            resp.send(resultAry);
    })
})


app.post("/do-update",async function(req,resp)
{
    let txtEmail=req.body.txtEmail;
    let txtPwd=req.body.txtPwd;
    let txtDob=req.body.txtDob;

    let fileName;
    if(req.files!=null)
    {
        fileName=req.files.ppic.name;
        let locationToSave=__dirname+"/public/uploads/"+fileName;//full ile path
        req.files.ppic.mv(locationToSave);//saving file in uploads folder

         //saving ur file/pic on cloudinary server
         try{
         await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
            fileName=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName);
            });
        }
        catch(err)
        {
            resp.send(err.message);
        }

    }
    else
    fileName=req.body.hdnFrm;

    mySqlServer.query("update curdTable set pwd=?, dob=?, picurl=? where email=?",[txtPwd,txtDob,fileName,txtEmail],function(err,result)
    {
            if(err==null)
            {
                if(result.affectedRows==1)
                    resp.send("Record Update Successsfulllyyy.. Badhaiiii");
                else
                    resp.send("Invalid Email ID");
            }
            else
            resp.send(err.message);
    })
})


app.get("/do-chek-email",function(req,resp)
{
    mySqlServer.query("select * from curdTable where email=?",[req.query.KuchBhi],function(err,resultAry)
    {
        // console.log(result);
        if(resultAry.length==0)
                resp.send("Available")
        else
            resp.send("Already Taken");
    })
})

app.get("/do-fetch-pwd",function(req,resp)
{
    mySqlServer.query("select pwd from curdTable where email=?",[req.query.KuchBhi],function(err,resultAry)
    {
        // console.log(result);
        if(resultAry.length==0)
                resp.send("Inavlid Emailid");
        else
            resp.send(resultAry);
    })
})


//---------------ANGULAR AJAX---------------

app.get("/all-records",function(req,resp)
{
    mySqlServer.query("select * from curdTable",function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})

app.get("/do-delete-one",function(req,resp)
{
    let userMail=req.query.emailKuch;
                                                  //col name Same as  table col name
    mySqlServer.query("delete from curdTable where email=?",[userMail],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("Record Deleted Successfulllyyyy");
            else
            resp.send("Inavlid User Id");
        }
        else
        resp.send(err.message);
    })
})

app.get("/do-fetch-1",function(req,resp)
{
    console.log(req.query)
    if(req.query.emailKuch=="All")
        query="select * from curdTable";
    else
        query="select * from curdTable where email=?";
    mySqlServer.query(query,[req.query.emailKuch],function(err,result)
    {
        console.log(result);
        resp.send(result);
    })
})