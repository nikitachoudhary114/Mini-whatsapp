const mongoose = require("mongoose");
const chat = require("./models/chat");
main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
};

let allChats = [
    {
        from: "Rahul",
        to: "Anay",
        msg: "Let's go to play cricket",
        created_at: new Date(),
    },
    {
        from: "Kaushal",
        to: "Abhinay",
        msg: "Soory bro,got work to do",
        created_at: new Date(),
    },
    {
        from: "Aroohi",
        to: "Nikhil",
        msg: "I'm sleepy",
        created_at: new Date(),
    },
    {
        from: "Atharva",
        to: "Smiet",
        msg: "How are you?",
        created_at: new Date(),
    },
]

chat.insertMany(allChats)


