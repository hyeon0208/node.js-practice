const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

    // 사용자 스키마
let UserSchema = new mongoose.Schema({ 
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    profile: String,

        // Post (인스턴스) Document 와 매핑
    posts: [
        {
            // ObjectId 는 각각의 Document를 식별하는 고유의 아이디.
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],

    liked_posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],

    liked_comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

    // 이 메서드를 통해 사용자 인증을 위한 passport-local-mongoose 모듈과 연결.
UserSchema.plugin(passportLocalMongoose);

    // UUserShema 구조를 따르는 User 인스턴스 (Document) 생성. 
let User = mongoose.model("User", UserSchema);
module.exports = User;