export const initFacebookSdk = () => {
  return new Promise((resolve, reject) => {
      // Load the Facebook SDK asynchronously
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: '901869298246767',
          cookie: true,
          xfbml: true,
          version: 'v21.0'
        });
        // Resolve the promise when the SDK is loaded
        resolve();
      };
      
    });
  };


  export const getFacebookLoginStatus = () => {
    console.log("Getting Facebook login status...");
    return new Promise((resolve, reject) => {
      window.FB.getLoginStatus((response) => {
        resolve(response);
      });
    });
  };

  export const fbLogin = () => {
    return new Promise((resolve, reject) => {
      window.FB.login((response) => {
        resolve(response)        
      })
    })
  }