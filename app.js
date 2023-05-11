const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require('mongoose'); 
const _=require('lodash');
const app = express();

// console.log(date);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public')); // to access the local or static files to the server


mongoose.connect("mongodb+srv://SankalpPatil:sankalp12@cluster0.o2au4gc.mongodb.net/todoListdb")
.then(()=> console.log("MongoDB Connected"))
.catch((err)=>console.log("Mongo Error", err));

    const itemSchema=new mongoose.Schema({
        name:{
            type:String,
            required:true
        }
    })

    const Item=new mongoose.model('Item',itemSchema);
    const item1=new Item({
        name:"Welcome to your Todo list"
    });
    const item2=new Item({
        name:"Hit + button to add item"
    });
    const item3=new Item({
        name:"Hit <-- to delete item"
    });
let defaultItems =[item1,item2,item3];

// Item.insertMany(defaultItems).then(()=>console.log("items inserted"))
// .catch((err)=>console.log("Error",err));
// let workItems=[];
const listSchema={
    name:{
        type:String
    },
    items:{
        type:[itemSchema]
    }
};
const List=new mongoose.model('List',listSchema);



app.get("/", function (req, res) {

    Item.find()
.then((itms)=>{

    if(itms.length==0){
        Item.insertMany(defaultItems).then(()=>console.log("items inserted"))
        .catch((err)=>console.log("Error",err));
        res.redirect("/");
    }
    
    else{
        res.render("list", { listTitle:"Today", newListItems: itms});
        
    }
    
})
.catch((err)=>{
    console.log(err);
});
    
   
   
});
    
app.get("/:customListName",(req,res)=>{
    const listName=_.capitalize(req.params.customListName);
    

    List.findOne({name:listName}).then((foundLs)=>{
        
           
        
            if(!foundLs){
                const list=new List({
                    name:listName,
                    items:defaultItems
                });
                list.save();
                // console.log("doesnt");
                res.redirect("/"+listName); 
            }
            else{
                res.render("list", { listTitle:foundLs.name, newListItems:foundLs.items});

            }
            
        
    });
    
});
    

app.get("/about",function(req,res){
    res.render("about");
}); 

app.post("/", function (req, res) {
    let itemName = req.body.newItem;
    let listName=req.body.list;
    const item=new Item({
        name:itemName
    });
    // console.log(listName);
    if(listName==="Today"){
        // Item.insertOne(itemName)
    
        item.save();
     res.redirect("/");
    }
    else{
        List.findOne({name:listName}).then((foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
    
   
    
});
app.post("/delete",function(req,res){
    const delIt=req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){
        Item.findByIdAndDelete(delIt)
    .then(()=>{
        console.log("delted succesfully");
        res.redirect("/");
    })
    .catch((err)=>{
        console.log(err);
    });
    }
    else{
        List.findOneAndUpdate(
            {
                name:listName
            },
            {
                $pull:{items:{_id:delIt}}
            }
        ).then((fountLlist)=>{
            res.redirect("/"+listName);
        }).catch((err)=>{
            console.log(err);
        });
    }
    
        
    
})

app.get("/work",function(req,res){
    res.render('list',{listTitle: "Work List", newListItems: workItems })
});
app.listen(3000, function () {
    console.log("Server Started...");
});