export const config = Object.freeze({
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
}
});

// const awsmobile = {
//   "aws_project_region": "YOUR_REGION",
//   "aws_cognito_identity_pool_id": "YOUR_IDENTITY_POOL_ID",
//   "aws_cognito_region": "YOUR_REGION",
//   "aws_user_pools_id": "YOUR_USER_POOL_ID",
//   "aws_user_pools_web_client_id": "YOUR_USER_POOL_WEB_CLIENT_ID",
//   "oauth": {}
// };

// console.log(config)

// export default awsmobile;