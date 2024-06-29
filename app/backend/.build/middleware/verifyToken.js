"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_config_1 = __importDefault(require("../firebase-config"));
/* The following is an example of how a user might be logged in and then a token is used
    to get information from the backend, and the token is verified by the verifyToken middlewear.

 const userCredential = await signInWithEmailAndPassword(auth, email, password);
 await userCredential.user.reload();
 const idToken = await userCredential.user.getIdToken();

This is how you would make a get request to the backend using a token to get data from a protected route
In this case we don't actually do anything with whats returned, its just an example

const response = await axios.get('http://localhost:3000/protected', {
  headers: {
    Authorization: `Bearer ${idToken}`,
  },
});
*/
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const idToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const decodedToken = yield firebase_config_1.default.auth().verifyIdToken(idToken);
        //if (!decodedToken.email_verified) {
        // return res.status(403).send('Email not verified');
        //}
        req.user = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).send('Unauthorized');
    }
});
exports.default = verifyToken;
