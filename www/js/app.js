// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.messageController', 'ngCordova.plugins.geolocation', 'ngCordovaOauth', 'ngStorage'])

.run(function($ionicPlatform, $window, $localStorage, $state, $location) {
  console.log('running');
  console.log('window: ' + JSON.stringify(window.localStorage.token));
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

  if(window.localStorage.token === undefined) {
    console.log('not found!');
    $location.path('/login');
  } else {
    console.log('found!');
    console.log(window.localStorage.token);
    $state.go('tab.messages');
  }

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
        templateUrl: 'templates/tab-post.html',
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
  $urlRouterProvider.otherwise('/messages');

});
