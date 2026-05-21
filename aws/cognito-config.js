const poolData = {

  UserPoolId: "POOL_ID",

  ClientId: "CLIENT_ID"

};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);