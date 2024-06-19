const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat");
const exp = require("constants");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next(err));
  };
} 


app.get("/chats",wrapAsync( async (req, res, next) => {
 
    let chats = await Chat.find();
    res.render("chat.ejs", { chats });
  

}));

app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "page not found");
  res.render("new.ejs");
});

app.get("/chats/:id/edit",wrapAsync( async (req, res, next) => {
  
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });

  
}));

app.patch("/chats/:id", wrapAsync(async (req, res,next) => {

    let { id } = req.params;
    let { msg } = req.body;
    let chat = await Chat.findByIdAndUpdate(
      id,
      { msg: msg },
      { runValidators: true, new: true }
    );
    res.redirect("/chats");
  
  
}));

app.delete("/chats/:id", wrapAsync(async (req, res, next) => {

    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");

 
}));

app.post("/chats", wrapAsync(async (req, res, next) => {

    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
    });

    await newChat.save();
    // .then((res) => {
    //   console.log("chat saved");
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
    res.redirect("chats");

}));

app.get("/chats/:id", wrapAsync(async (req, res, next) => {

    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      next(new ExpressError(404, "chat not found"));
    }
    res.render("edit.ejs", { chat });

}));

app.get("/", (req, res) => {
  res.send("working");
});
//error handling
app.use((err, req, res, next) => {
  let { status = 500, message = "some error occured" } = err;
  res.status(status).send(message);
});

app.listen(8080, () => {
  console.log("listening to port 8080");
});
