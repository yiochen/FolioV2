var _animationEvent=['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'];
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
    var preloader = $('.preload');
    var navInstr=$('.show_nav');
    navInstr.style.display='block';
    addClass(preloader,['animated','fadeOut']);
    one(navInstr,['animationend'],function(){
        console.log('finished showing instruction, fading out ');
        init();
        addClass(navInstr,['animated','fadeOut']);
        one(navInstr,['animationend'],function(){
            console.log('show_nav fadeOut ended');
            removeClass(preloader);
            removeClass(navInstr);
            preloader.parentNode.removeChild(preloader);
            navInstr.parentNode.removeChild(navInstr);
        });
    });
    // preloader.parentNode.removeChild(preloader);
    console.log('all elements upgraded, all html imports finished');

  });
  function init(){
      $('body').addEventListener("keydown",function(ev){
          var char=ev.which||event.keyCode;
          switch(char){
              case 39:
                app._onNextClick();
                break;
              case 37:
                app._onPrevClick();
                break;
          }
      },false);

  }
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
  function initPage(page){
      page.scrollTop=0;
      if (page.opened){
          page.opened=false;
          var detail= page.querySelector('.project_detail');
          if (detail){
              detail.style.display='none';
              detail.style.animationName='';

          }
      }
      var intro=page.querySelector('.project_intro');
      if (intro){
          intro.style.animationName='showintro';
      }
      page.focus();
  }

  function cleanPage(page){
  }

  app.getCurrentPage = function(){
      return this.$.pages.children[this.$.pages.selected];
  };

  app._onPrevClick = function() {
    this.entryAnimation = 'slide-from-left-animation';
    this.exitAnimation = 'slide-right-animation';
    var selected = this.$.pages.selected;
    cleanPage(this.$.pages.children[selected]);
    selected--;
    if (selected < 0) {
      selected = this.$.pages.children.length - 1;
    }
    this.$.pages.selected = selected;
    initPage(this.$.pages.children[selected]);
  };
  app._onNextClick = function() {
    this.entryAnimation = 'slide-from-right-animation';
    this.exitAnimation = 'slide-left-animation';
    var selected = this.$.pages.selected;
    cleanPage(this.$.pages.children[selected]);
    selected++;
    if (selected >= this.$.pages.children.length) {
      selected = 0;
    }
    this.$.pages.selected = selected;
    initPage(this.$.pages.children[selected]);
  };
  app._onChangeSelected = function(route) {
    this.entryAnimation = 'fade-in-animation';
    this.exitAnimation = 'fade-out-animation';
    var selected = this.$.pages.selected;
    cleanPage(this.$.pages.children[selected]);
    var query='[data-route="' + route + '"]';
    console.log('querying '+query);
    var newpage = this.$.pages.querySelector(query);
    //TODO: following will alert message for routing error. In production. This should be handled in a user friendly way
    if (newpage === null) {
      alert('Cannot find the requested page');
      return;
    }

    selected = this.$.pages.indexOf(newpage);
    initPage(this.$.pages.children[selected]);
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
  app._onProjectClick = function(){
      var page=this.getCurrentPage();
      var detail = page.querySelector('.project_detail');
      if (typeof page.opened === 'undefined' || !page.opened){
          page.opened=true;
          //opening detail
          _projectDetailAnimateIn(page);
      }else{
          //closing detail
          page.opened=false;
          _projectDetailAnimateOut(page);
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
    one(menu, _animationEvent,
        function () {
            removeClass(menu);
        }
    );
    addClass(removeClass(menu),['animated', 'fadeIn']);
    menu.appendChild($('#menu_button_container'));
    console.log('animating in');
  }

  function _menuAnimateOut() {
    var menu = $('.menu_overlay');
    one(menu, _animationEvent,
      function() {
        removeClass(menu);
        menu.style.display = 'none';
        console.log('animating out');
      }
    );
    addClass(removeClass(menu),['animated', 'fadeOut']);
    $('.toolbar').appendChild($('#menu_button_container'));
  }

  function _projectDetailAnimateIn(page){
    var intro = page.querySelector('.project_intro');
    if (intro){
        intro.style.animationName='hideintro';
    }
    var detail= page.querySelector('.project_detail');
    if (detail){
        detail.style.display='block';
        detail.style.animationName='showdetail';
    }
  }

  function _projectDetailAnimateOut(page){
      var intro = page.querySelector('.project_intro');
      if (intro){
           intro.style.animationName='showintro';
      }
      var detail= page.querySelector('.project_detail');
      if (detail){
          one(detail,_animationEvent,
            function(){
                detail.style.display='none';
            });
          detail.style.animationName='hidedetail';
      }

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
