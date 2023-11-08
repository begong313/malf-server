/*Passport 모듈 초기화 작업하는 파일*/

import passport from "passport";
import kakao from "./kakaoStrategy";
import local from "./localStrategy";
import google from "./googleStrategy";
import apple from "./appleStrategy";
// import line from "./lineStrategy";

function passportInit() {
    passport.initialize();
    kakao();
    local();
    google();
    apple();
}

export default passportInit;
