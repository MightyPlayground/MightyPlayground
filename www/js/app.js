angular.module('thoughtdrop', ['ionic', 'thoughtdrop.controllers', 'thoughtdrop.services', 'thoughtdrop.messageController', 'ngCordova.plugins.geolocation', 'ngCordovaOauth', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
// Ionic uses AngularUI Router which uses the concept of states. Learn more here: https://github.com/angular-ui/ui-router
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl'
  })

  .state('phone', {
    url: '/phone',
    templateUrl: 'templates/phonenumber.html',
    controller: 'AuthCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  //  Each tab has its own nav history stack:
  .state('tab.messages', {
    url: '/messages',
    views: {
      'tab-messages': {
        templateUrl: 'templates/tab-messages.html',
        controller: 'messageController'
      }
    }
  })

  .state('tab.post', {
    url: '/post',
    views: {
      'tab-post': {
        templateUrl: 'templates/post.html',
        controller: 'messageController'
      }
    }
  })

  .state('tab.privateMessages', {
    url: '/privateMessages',
    views: {
      'tab-privateMessages': {
        templateUrl: 'templates/tab-privateMessages.html',
        controller: 'messageController'
      }
    }
  })
  
  .state('tab.friend-detail', {
    url: '/friend/:friendId',
    views: {
      'tab-friends': {
        templateUrl: 'templates/friend-detail.html',
        controller: 'FriendDetailCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
