(function(document) {
  'use strict';
  var $ = function(selector) {
    return document.querySelector(selector);
  };
  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  HTMLImports.whenReady(function() {
    $('.unresolved').classList.remove('unresolved');
    var preloader = $('.preloading');
    preloader.parentNode.removeChild(preloader);
    console.log('all elements upgraded, all html imports finished');

  });

  // Sets app default base URL
  app.baseUrl = 'http://0.0.0.0:8000/app/';
  app.selected = 0;
  app.menuOpen = false;
  //if (window.location.port === '') { // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  //}

  // app.displayInstalledToast = function() {
  //   // Check to make sure caching is actually enabled—it won't be in the dev environment.
  //   if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
  //     Polymer.dom(document).querySelector('#caching-complete').show();
  //   }
  // };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
    var hammertime = new Hammer(app.$.pages);
    hammertime.get('swipe').set({
      direction: Hammer.DIRECTION_HORIZONTAL
    });
    hammertime.on('swipeleft', function(ev) {
      console.log('swipeleft');
      app._onNextClick();
    });
    hammertime.on('swiperight', function(ev) {
      console.log('swiperight');
      app._onPrevClick();
    });
    console.log("added guesture support");
  });

  app._onPrevClick = function() {
    this.entryAnimation = 'slide-from-left-animation';
    this.exitAnimation = 'slide-right-animation';
    var selected = this.$.pages.selected;
    this.$.pages.children[selected].scrollTop = 0;
    selected--;
    if (selected < 0) {
      selected = this.$.pages.children.length - 1;
    }
    this.$.pages.selected = selected;
    this.$.pages.children[selected].scrollTop = 0;
  };
  app._onNextClick = function() {
    this.entryAnimation = 'slide-from-right-animation';
    this.exitAnimation = 'slide-left-animation';
    var selected = this.$.pages.selected;
    this.$.pages.children[selected].scrollTop = 0;
    selected++;
    if (selected >= this.$.pages.children.length) {
      selected = 0;
    }
    this.$.pages.selected = selected;
    this.$.pages.children[selected].scrollTop = 0;
  };
  app._onChangeSelected = function(route) {
    this.entryAnimation = 'fade-in-animation';
    this.exitAnimation = 'fade-out-animation';
    var selected = this.$.pages.selected;
    this.$.pages.children[selected].scrollTop = 0;
    var query='[data-route="' + route + '"]';
    console.log('querying '+query);
    var newpage = this.$.pages.querySelector(query);
    //TODO: following will alert message for routing error. In production. This should be handled in a user friendly way
    if (newpage === null) {
      alert("Cannot find the requested page");
      return;
    }

    selected = this.$.pages.indexOf(newpage);
    this.$.pages.children[selected].scrollTop = 0;
    this.$.pages.selected = selected;

  };
  app._onMenuItemClicked = function(e){
      var target=e.currentTarget;
      this._onChangeSelected(target.getAttribute('data-route'));
      this._onMenuClose();
  };
  app._onMenuClose = function(){
      this.$.menu_button.shape = 'menu';
      this.menuOpen = false;
      _menuAnimateOut();
  };
  app._onMenuOpen = function(){
      this.$.menu_button.shape = 'cancel';
      this.menuOpen = true;
      _menuAnimateIn();
  };
  app._onMenuClick = function() {
    if (this.menuOpen) {
      // closing the menu
      this._onMenuClose();
    } else {
      //opening the menu
      this._onMenuOpen();
    }
  };

  function one(element, eventList, func) {
    console.log('adding event listeners');
    function removeAfterFire(e){
        func(e);
        eventList.forEach(function (ev){
            element.removeEventListener(ev,removeAfterFire);
        });
    }
    eventList.forEach(function (ev){
        element.addEventListener(ev, removeAfterFire);
    });

  }
  function addClass(element, classList){
      element.tempClassList=element.tempClassList||[];
      classList.forEach(function(cl){
          if (element.tempClassList.indexOf(cl)===-1){
              element.tempClassList.push(cl);
          }
          element.classList.add(cl);
      });
      return element;
  }
  function removeClass(element){
      var classList=element.tempClassList=element.tempClassList||[];
      classList.forEach(function(cl){
         element.classList.remove(cl);
      });
      return element;
  }
  function _menuAnimateIn() {
    var menu = $('.menu_overlay');
    menu.style.display = 'flex';
    one(menu, ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'],function (e) {
        removeClass(menu);
      }
    );
    addClass(removeClass(menu),['animated', 'fadeIn']);
    menu.appendChild($('#menu_button_container'));
    console.log('animating in');
  }

  function _menuAnimateOut() {
    var menu = $('.menu_overlay');
    one(menu, ['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'],
      function(e) {
        removeClass(menu);
        menu.style.display = 'none';
        console.log('animating out');
      }
    );
    addClass(removeClass(menu),['animated', 'fadeOut']);
    $('.toolbar').appendChild($('#menu_button_container'));
  }




  // See https://github.com/Polymer/polymer/issues/1381
  //window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  //});

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  // window.addEventListener('paper-header-transform', function(e) {
  //   var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
  //   var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
  //   var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
  //   var detail = e.detail;
  //   var heightDiff = detail.height - detail.condensedHeight;
  //   var yRatio = Math.min(1, detail.y / heightDiff);
  //   // appName max size when condensed. The smaller the number the smaller the condensed size.
  //   var maxMiddleScale = 0.50;
  //   var auxHeight = heightDiff - detail.y;
  //   var auxScale = heightDiff / (1 - maxMiddleScale);
  //   var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
  //   var scaleBottom = 1 - yRatio;
  //
  //   // Move/translate middleContainer
  //   Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);
  //
  //   // Scale bottomContainer and bottom sub title to nothing and back
  //   Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);
  //
  //   // Scale middleContainer appName
  //   Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  // });
})(document);
