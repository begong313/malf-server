var fcmAdmin = require("firebase-admin");
import * as serviceAccount from "./fcmSecret.json";

fcmAdmin.initializeApp({
    credential: fcmAdmin.credential.cert(serviceAccount),
});

const fcm = fcmAdmin.messaging();
fcmAdmin.messaging().createTopic("test");
export default { fcm, fcmAdmin };

//주제생성 => 주제에 구독자 추가 => 해당 주제로 알림 발송
