// js/cognito-config.js - Cognito configuration
// DO NOT SHARE THIS FILE

const cognitoConfig = {
    region: "us-east-1",
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_QBvnBnoeu",
    client_id: "uiaftai0t6g5jiorv6qpslrtb",
    redirect_uri: "http://127.0.0.1:8000/",
    response_type: "code",
    scope: "email openid phone"
};

// Make available globally
window.cognitoConfig = cognitoConfig;