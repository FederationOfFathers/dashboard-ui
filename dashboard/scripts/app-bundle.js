define('apiTest',['exports', 'aurelia-framework', 'api/user'], function (exports, _aureliaFramework, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ApiTest = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var ApiTest = exports.ApiTest = (_dec = (0, _aureliaFramework.inject)(_user.UserApi), _dec(_class = function () {
        function ApiTest(userApi) {
            _classCallCheck(this, ApiTest);

            this.UserApi = userApi;

            this.userProfile = {
                admin: false,
                channels: [],
                groups: [],
                user: {}
            };
        }

        ApiTest.prototype.activate = function activate() {
            var _this = this;

            this.UserApi.ping().then(function (data) {
                console.log(data);

                _this.userProfile.admin = data.admin;
                _this.userProfile.channels = data.channels;
                _this.userProfile.groups = data.groups;
                _this.userProfile.user = data.user;
            }).catch(function (err) {
                console.error(err);
            });
        };

        _createClass(ApiTest, [{
            key: 'isAdmin',
            get: function get() {
                return this.userProfile.admin;
            }
        }, {
            key: 'stringifiedUser',
            get: function get() {
                return JSON.stringify(this.userProfile.user);
            }
        }, {
            key: 'userChannels',
            get: function get() {
                return this.userProfile.channels;
            }
        }, {
            key: 'userGroups',
            get: function get() {
                return this.userProfile.groups;
            }
        }]);

        return ApiTest;
    }()) || _class);
});
define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'FoF Dashboard';
      config.map([{ route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome' }, { route: 'apiTest', name: 'apiTest', moduleId: 'apiTests/apiTests', nav: true, title: 'API Tests' }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', 'bootstrap'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    aurelia.use.plugin('aurelia-animator-css');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('welcome',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Welcome = exports.Welcome = function Welcome() {
        _classCallCheck(this, Welcome);
    };
});
define('api/api',['exports', 'aurelia-framework', 'aurelia-fetch-client', '../environment', 'whatwg-fetch'], function (exports, _aureliaFramework, _aureliaFetchClient, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Api = undefined;

    var _environment2 = _interopRequireDefault(_environment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var BASE_URL = '/api/v0/';
    if (_environment2.default.debug) {
        BASE_URL = 'http://fofgaming.com:8867/api/v0/';
    }

    var Api = exports.Api = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
        function Api(http) {
            _classCallCheck(this, Api);

            http.configure(function (config) {
                config.withBaseUrl(BASE_URL).withDefaults({
                    credentials: 'include'
                }).withInterceptor({
                    request: function request(_request) {
                        console.log('Intercepted request using method: ' + _request.method + ' with URL: ' + _request.url);
                        return _request;
                    },
                    response: function response(_response) {
                        console.log('Intercepted response ' + _response.status + ' using URL: ' + _response.url);
                        if (_response.status > 299 || _response.status < 200) {
                            throw Error('Logged out: response ${response.status}');
                        }
                        return _response;
                    }
                });
            });
            this.http = http;
        }

        Api.prototype.get = function get(url) {
            return this.http.fetch(url).then(function (response) {
                return response.json();
            });
        };

        Api.prototype.put = function put(url, payload) {
            var data = new FormData();
            data.append("json", JSON.stringify(payload));
            return this.http.fetch(url, {
                method: "put",
                body: data
            }).then(function (response) {
                return response.json();
            });
        };

        Api.prototype.post = function post() {
            throw Error('Not yet implemented');
        };

        Api.prototype.delete = function _delete(url) {
            return this.http.fetch(url, {
                method: "delete"
            }).then(function (response) {
                return response.json();
            });
        };

        return Api;
    }()) || _class);
});
define('api/groups',['exports', 'aurelia-framework', './api'], function (exports, _aureliaFramework, _api) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GroupsApi = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var GroupsApi = exports.GroupsApi = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function () {
        function GroupsApi(api) {
            _classCallCheck(this, GroupsApi);

            this.api = api;
        }

        GroupsApi.prototype.get = function get() {
            return this.api.get("groups");
        };

        GroupsApi.prototype.join = function join(id) {
            return this.api.get("groups/${id}/join");
        };

        GroupsApi.prototype.visibility = function visibility(id) {
            return this.api.put("groups/${id}/visibility");
        };

        return GroupsApi;
    }()) || _class);
});
define('api/streams',['exports', 'aurelia-framework', './api'], function (exports, _aureliaFramework, _api) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StreamsApi = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var StreamsApi = exports.StreamsApi = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function () {
        function StreamsApi(api) {
            _classCallCheck(this, StreamsApi);

            this.api = api;
        }

        StreamsApi.prototype.get = function get(key) {
            if (key) {
                return this.api.get("streams/${key}");
            } else {
                return this.api.get("streams");
            }
        };

        StreamsApi.prototype.delete = function _delete(key) {
            return this.api.delete("streams/${key}");
        };

        return StreamsApi;
    }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('resources/elements/nav-bar',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NavBarCustomElement = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _desc, _value, _class, _descriptor;

  var NavBarCustomElement = exports.NavBarCustomElement = (_class = function NavBarCustomElement() {
    _classCallCheck(this, NavBarCustomElement);

    _initDefineProp(this, 'router', _descriptor, this);

    this.message = 'hello world';
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'router', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
});
define('api/user',['exports', 'aurelia-framework', './api'], function (exports, _aureliaFramework, _api) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.UserApi = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var UserApi = exports.UserApi = (_dec = (0, _aureliaFramework.inject)(_api.Api), _dec(_class = function () {
        function UserApi(api) {
            _classCallCheck(this, UserApi);

            this.api = api;
        }

        UserApi.prototype.ping = function ping() {
            return this.api.get("ping");
        };

        UserApi.prototype.login = function login() {
            return this.api.get("login");
        };

        UserApi.prototype.logout = function logout() {
            return this.api.get("logout");
        };

        return UserApi;
    }()) || _class);
});
define('apiTests/apiTest',['exports', 'aurelia-framework', 'api/user'], function (exports, _aureliaFramework, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ApiTest = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var ApiTest = exports.ApiTest = (_dec = (0, _aureliaFramework.inject)(_user.UserApi), _dec(_class = function () {
        function ApiTest(userApi) {
            _classCallCheck(this, ApiTest);

            this.UserApi = userApi;

            this.userProfile = {
                admin: false,
                channels: [],
                groups: [],
                user: {}
            };
        }

        ApiTest.prototype.activate = function activate() {
            var _this = this;

            this.UserApi.ping().then(function (data) {
                console.log(data);

                _this.userProfile.admin = data.admin;
                _this.userProfile.channels = data.channels;
                _this.userProfile.groups = data.groups;
                _this.userProfile.user = data.user;
            }).catch(function (err) {
                console.error(err);
            });
        };

        _createClass(ApiTest, [{
            key: 'isAdmin',
            get: function get() {
                return this.userProfile.admin;
            }
        }, {
            key: 'stringifiedUser',
            get: function get() {
                return JSON.stringify(this.userProfile.user);
            }
        }, {
            key: 'userChannels',
            get: function get() {
                return this.userProfile.channels;
            }
        }, {
            key: 'userGroups',
            get: function get() {
                return this.userProfile.groups;
            }
        }]);

        return ApiTest;
    }()) || _class);
});
define('apiTests/apiTests',['exports', 'aurelia-framework', 'api/user'], function (exports, _aureliaFramework, _user) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ApiTests = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _dec, _class;

    var ApiTests = exports.ApiTests = (_dec = (0, _aureliaFramework.inject)(_user.UserApi), _dec(_class = function () {
        function ApiTests(userApi) {
            _classCallCheck(this, ApiTests);

            this.UserApi = userApi;

            this.userProfile = {
                admin: false,
                channels: [],
                groups: [],
                user: {}
            };
        }

        ApiTests.prototype.activate = function activate() {
            var _this = this;

            this.UserApi.ping().then(function (data) {
                console.log(data);

                _this.userProfile.admin = data.admin;
                _this.userProfile.channels = data.channels;
                _this.userProfile.groups = data.groups;
                _this.userProfile.user = data.user;
            }).catch(function (err) {
                console.error(err);
            });
        };

        _createClass(ApiTests, [{
            key: 'isAdmin',
            get: function get() {
                return this.userProfile.admin;
            }
        }, {
            key: 'stringifiedUser',
            get: function get() {
                return JSON.stringify(this.userProfile.user);
            }
        }, {
            key: 'userChannels',
            get: function get() {
                return this.userProfile.channels;
            }
        }, {
            key: 'userGroups',
            get: function get() {
                return this.userProfile.groups;
            }
        }]);

        return ApiTests;
    }()) || _class);
});
define('text!apiTest.html', ['module'], function(module) { module.exports = "<template>\n    <section class=\"au-animate\">\n        <h1>Welcome to the api tests page</h1>\n\n        <label>Admin: ${isAdmin}</label>\n        <br />\n        <label>User Data:</label><span>${stringifiedUser}</span>\n        <br />\n        <label for=\"channels\">User Channels:</label>\n        <ul id=\"channels\">\n            <li repeat.for=\"channel of userChannels\">${channel.name}</li>\n        </ul>\n        <br />\n        <label for=\"groups\">User Groups:</label>\n        <ul id=\"groups\">\n            <li repeat.for=\"group of userGroups\">${group.name}</li>\n        </ul>\n    </section>\n</template>"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from='./resources/elements/nav-bar'></require>\n  <require from='./app.css'></require>\n\n  <nav-bar router.bind=\"router\"></nav-bar>\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = "body {\n  margin: 0; }\n\n.page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto; }\n\n@media print {\n  .page-host {\n    position: absolute;\n    left: 10px;\n    right: 0;\n    top: 50px;\n    bottom: 0;\n    overflow-y: inherit;\n    overflow-x: inherit; } }\n\nsection {\n  margin: 0 20px; }\n\n.navbar-nav li.loader {\n  margin: 12px 24px 0 6px; }\n\n/* animate page transitions */\nsection.au-enter-active {\n  -webkit-animation: fadeInRight 1s;\n  animation: fadeInRight 1s; }\n\ndiv.au-stagger {\n  /* 50ms will be applied between each successive enter operation */\n  -webkit-animation-delay: 50ms;\n  animation-delay: 50ms; }\n\n/* animation definitions */\n@-webkit-keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    -ms-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none; } }\n\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes fadeIn {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n"; });
define('text!welcome.html', ['module'], function(module) { module.exports = "<template>\n    <section class=\"au-animate\">\n        <h1>Welcome home</h1>\n    </section>\n</template>"; });
define('text!resources/elements/nav-bar.html', ['module'], function(module) { module.exports = "<template>\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse\">\n        <span class=\"sr-only\">Toggle Navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-home\"></i>\n        <span>${router.title}</span>\n      </a>\n    </div>\n\n    <div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\">\n      <ul class=\"nav navbar-nav\">\n        <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a>\n        </li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"loader\" if.bind=\"router.isNavigating\">\n          <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</template>"; });
define('text!apiTests/apiTest.html', ['module'], function(module) { module.exports = "<template>\n    <section class=\"au-animate\">\n        <h1>Welcome to the api tests page</h1>\n\n        <label>Admin: ${isAdmin}</label>\n        <br />\n        <label>User Data:</label><span>${stringifiedUser}</span>\n        <br />\n        <label for=\"channels\">User Channels:</label>\n        <ul id=\"channels\">\n            <li repeat.for=\"channel of userChannels\">${channel.name}</li>\n        </ul>\n        <br />\n        <label for=\"groups\">User Groups:</label>\n        <ul id=\"groups\">\n            <li repeat.for=\"group of userGroups\">${group.name}</li>\n        </ul>\n    </section>\n</template>"; });
define('text!apiTests/apiTests.html', ['module'], function(module) { module.exports = "<template>\n    <section class=\"au-animate\">\n        <h1>Welcome to the api tests page</h1>\n\n        <label>Admin: ${isAdmin}</label>\n        <br />\n        <label>User Data:</label><span>${stringifiedUser}</span>\n        <br />\n        <label for=\"channels\">User Channels:</label>\n        <ul id=\"channels\">\n            <li repeat.for=\"channel of userChannels\">${channel.name}</li>\n        </ul>\n        <br />\n        <label for=\"groups\">User Groups:</label>\n        <ul id=\"groups\">\n            <li repeat.for=\"group of userGroups\">${group.name}</li>\n        </ul>\n    </section>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map