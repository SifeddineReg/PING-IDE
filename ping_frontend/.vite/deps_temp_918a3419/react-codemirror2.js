import {
  require_react
} from "./chunk-WNPTCGAH.js";
import {
  require_codemirror
} from "./chunk-DCCCD72R.js";
import {
  __commonJS
} from "./chunk-5WRI5ZAA.js";

// node_modules/react-codemirror2/index.js
var require_react_codemirror2 = __commonJS({
  "node_modules/react-codemirror2/index.js"(exports) {
    function _extends() {
      _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _typeof(o) {
      "@babel/helpers - typeof";
      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, _typeof(o);
    }
    var __extends = /* @__PURE__ */ function() {
      var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return _extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UnControlled = exports.Controlled = void 0;
    var React = require_react();
    var SERVER_RENDERED = typeof navigator === "undefined" || typeof global !== "undefined" && global["PREVENT_CODEMIRROR_RENDER"] === true;
    var cm;
    if (!SERVER_RENDERED) {
      cm = require_codemirror();
    }
    var Helper = function() {
      function Helper2() {
      }
      Helper2.equals = function(x, y) {
        var _this = this;
        var ok = Object.keys, tx = _typeof(x), ty = _typeof(y);
        return x && y && tx === "object" && tx === ty ? ok(x).length === ok(y).length && ok(x).every(function(key) {
          return _this.equals(x[key], y[key]);
        }) : x === y;
      };
      return Helper2;
    }();
    var Shared = function() {
      function Shared2(editor, props) {
        this.editor = editor;
        this.props = props;
      }
      Shared2.prototype.delegateCursor = function(position, scroll, focus) {
        var doc = this.editor.getDoc();
        if (focus) {
          this.editor.focus();
        }
        scroll ? doc.setCursor(position) : doc.setCursor(position, null, {
          scroll: false
        });
      };
      Shared2.prototype.delegateScroll = function(coordinates) {
        this.editor.scrollTo(coordinates.x, coordinates.y);
      };
      Shared2.prototype.delegateSelection = function(ranges, focus) {
        var doc = this.editor.getDoc();
        doc.setSelections(ranges);
        if (focus) {
          this.editor.focus();
        }
      };
      Shared2.prototype.apply = function(props) {
        if (props && props.selection && props.selection.ranges) {
          this.delegateSelection(props.selection.ranges, props.selection.focus || false);
        }
        if (props && props.cursor) {
          this.delegateCursor(props.cursor, props.autoScroll || false, this.editor.getOption("autofocus") || false);
        }
        if (props && props.scroll) {
          this.delegateScroll(props.scroll);
        }
      };
      Shared2.prototype.applyNext = function(props, next, preserved) {
        if (props && props.selection && props.selection.ranges) {
          if (next && next.selection && next.selection.ranges && !Helper.equals(props.selection.ranges, next.selection.ranges)) {
            this.delegateSelection(next.selection.ranges, next.selection.focus || false);
          }
        }
        if (props && props.cursor) {
          if (next && next.cursor && !Helper.equals(props.cursor, next.cursor)) {
            this.delegateCursor(preserved.cursor || next.cursor, next.autoScroll || false, next.autoCursor || false);
          }
        }
        if (props && props.scroll) {
          if (next && next.scroll && !Helper.equals(props.scroll, next.scroll)) {
            this.delegateScroll(next.scroll);
          }
        }
      };
      Shared2.prototype.applyUserDefined = function(props, preserved) {
        if (preserved && preserved.cursor) {
          this.delegateCursor(preserved.cursor, props.autoScroll || false, this.editor.getOption("autofocus") || false);
        }
      };
      Shared2.prototype.wire = function(props) {
        var _this = this;
        Object.keys(props || {}).filter(function(p) {
          return /^on/.test(p);
        }).forEach(function(prop) {
          switch (prop) {
            case "onBlur":
              {
                _this.editor.on("blur", function(cm2, event) {
                  _this.props.onBlur(_this.editor, event);
                });
              }
              break;
            case "onContextMenu": {
              _this.editor.on("contextmenu", function(cm2, event) {
                _this.props.onContextMenu(_this.editor, event);
              });
              break;
            }
            case "onCopy": {
              _this.editor.on("copy", function(cm2, event) {
                _this.props.onCopy(_this.editor, event);
              });
              break;
            }
            case "onCursor":
              {
                _this.editor.on("cursorActivity", function(cm2) {
                  _this.props.onCursor(_this.editor, _this.editor.getDoc().getCursor());
                });
              }
              break;
            case "onCursorActivity":
              {
                _this.editor.on("cursorActivity", function(cm2) {
                  _this.props.onCursorActivity(_this.editor);
                });
              }
              break;
            case "onCut": {
              _this.editor.on("cut", function(cm2, event) {
                _this.props.onCut(_this.editor, event);
              });
              break;
            }
            case "onDblClick": {
              _this.editor.on("dblclick", function(cm2, event) {
                _this.props.onDblClick(_this.editor, event);
              });
              break;
            }
            case "onDragEnter":
              {
                _this.editor.on("dragenter", function(cm2, event) {
                  _this.props.onDragEnter(_this.editor, event);
                });
              }
              break;
            case "onDragLeave": {
              _this.editor.on("dragleave", function(cm2, event) {
                _this.props.onDragLeave(_this.editor, event);
              });
              break;
            }
            case "onDragOver":
              {
                _this.editor.on("dragover", function(cm2, event) {
                  _this.props.onDragOver(_this.editor, event);
                });
              }
              break;
            case "onDragStart": {
              _this.editor.on("dragstart", function(cm2, event) {
                _this.props.onDragStart(_this.editor, event);
              });
              break;
            }
            case "onDrop":
              {
                _this.editor.on("drop", function(cm2, event) {
                  _this.props.onDrop(_this.editor, event);
                });
              }
              break;
            case "onFocus":
              {
                _this.editor.on("focus", function(cm2, event) {
                  _this.props.onFocus(_this.editor, event);
                });
              }
              break;
            case "onGutterClick":
              {
                _this.editor.on("gutterClick", function(cm2, lineNumber, gutter, event) {
                  _this.props.onGutterClick(_this.editor, lineNumber, gutter, event);
                });
              }
              break;
            case "onInputRead":
              {
                _this.editor.on("inputRead", function(cm2, EditorChangeEvent) {
                  _this.props.onInputRead(_this.editor, EditorChangeEvent);
                });
              }
              break;
            case "onKeyDown":
              {
                _this.editor.on("keydown", function(cm2, event) {
                  _this.props.onKeyDown(_this.editor, event);
                });
              }
              break;
            case "onKeyHandled":
              {
                _this.editor.on("keyHandled", function(cm2, key, event) {
                  _this.props.onKeyHandled(_this.editor, key, event);
                });
              }
              break;
            case "onKeyPress":
              {
                _this.editor.on("keypress", function(cm2, event) {
                  _this.props.onKeyPress(_this.editor, event);
                });
              }
              break;
            case "onKeyUp":
              {
                _this.editor.on("keyup", function(cm2, event) {
                  _this.props.onKeyUp(_this.editor, event);
                });
              }
              break;
            case "onMouseDown": {
              _this.editor.on("mousedown", function(cm2, event) {
                _this.props.onMouseDown(_this.editor, event);
              });
              break;
            }
            case "onPaste": {
              _this.editor.on("paste", function(cm2, event) {
                _this.props.onPaste(_this.editor, event);
              });
              break;
            }
            case "onRenderLine": {
              _this.editor.on("renderLine", function(cm2, line, element) {
                _this.props.onRenderLine(_this.editor, line, element);
              });
              break;
            }
            case "onScroll":
              {
                _this.editor.on("scroll", function(cm2) {
                  _this.props.onScroll(_this.editor, _this.editor.getScrollInfo());
                });
              }
              break;
            case "onSelection":
              {
                _this.editor.on("beforeSelectionChange", function(cm2, data) {
                  _this.props.onSelection(_this.editor, data);
                });
              }
              break;
            case "onTouchStart": {
              _this.editor.on("touchstart", function(cm2, event) {
                _this.props.onTouchStart(_this.editor, event);
              });
              break;
            }
            case "onUpdate":
              {
                _this.editor.on("update", function(cm2) {
                  _this.props.onUpdate(_this.editor);
                });
              }
              break;
            case "onViewportChange":
              {
                _this.editor.on("viewportChange", function(cm2, from, to) {
                  _this.props.onViewportChange(_this.editor, from, to);
                });
              }
              break;
          }
        });
      };
      return Shared2;
    }();
    var Controlled = function(_super) {
      __extends(Controlled2, _super);
      function Controlled2(props) {
        var _this = _super.call(this, props) || this;
        if (SERVER_RENDERED) return _this;
        _this.applied = false;
        _this.appliedNext = false;
        _this.appliedUserDefined = false;
        _this.deferred = null;
        _this.emulating = false;
        _this.hydrated = false;
        _this.initCb = function() {
          if (_this.props.editorDidConfigure) {
            _this.props.editorDidConfigure(_this.editor);
          }
        };
        _this.mounted = false;
        return _this;
      }
      Controlled2.prototype.hydrate = function(props) {
        var _this = this;
        var _options = props && props.options ? props.options : {};
        var userDefinedOptions = _extends({}, cm.defaults, this.editor.options, _options);
        var optionDelta = Object.keys(userDefinedOptions).some(function(key) {
          return _this.editor.getOption(key) !== userDefinedOptions[key];
        });
        if (optionDelta) {
          Object.keys(userDefinedOptions).forEach(function(key) {
            if (_options.hasOwnProperty(key)) {
              if (_this.editor.getOption(key) !== userDefinedOptions[key]) {
                _this.editor.setOption(key, userDefinedOptions[key]);
                _this.mirror.setOption(key, userDefinedOptions[key]);
              }
            }
          });
        }
        if (!this.hydrated) {
          this.deferred ? this.resolveChange(props.value) : this.initChange(props.value || "");
        }
        this.hydrated = true;
      };
      Controlled2.prototype.initChange = function(value) {
        this.emulating = true;
        var doc = this.editor.getDoc();
        var lastLine = doc.lastLine();
        var lastChar = doc.getLine(doc.lastLine()).length;
        doc.replaceRange(value || "", {
          line: 0,
          ch: 0
        }, {
          line: lastLine,
          ch: lastChar
        });
        this.mirror.setValue(value);
        doc.clearHistory();
        this.mirror.clearHistory();
        this.emulating = false;
      };
      Controlled2.prototype.resolveChange = function(value) {
        this.emulating = true;
        var doc = this.editor.getDoc();
        if (this.deferred.origin === "undo") {
          doc.undo();
        } else if (this.deferred.origin === "redo") {
          doc.redo();
        } else {
          doc.replaceRange(this.deferred.text, this.deferred.from, this.deferred.to, this.deferred.origin);
        }
        if (value && value !== doc.getValue()) {
          var cursor = doc.getCursor();
          doc.setValue(value);
          doc.setCursor(cursor);
        }
        this.emulating = false;
        this.deferred = null;
      };
      Controlled2.prototype.mirrorChange = function(deferred) {
        var doc = this.editor.getDoc();
        if (deferred.origin === "undo") {
          doc.setHistory(this.mirror.getHistory());
          this.mirror.undo();
        } else if (deferred.origin === "redo") {
          doc.setHistory(this.mirror.getHistory());
          this.mirror.redo();
        } else {
          this.mirror.replaceRange(deferred.text, deferred.from, deferred.to, deferred.origin);
        }
        return this.mirror.getValue();
      };
      Controlled2.prototype.componentDidMount = function() {
        var _this = this;
        if (SERVER_RENDERED) return;
        if (this.props.defineMode) {
          if (this.props.defineMode.name && this.props.defineMode.fn) {
            cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
          }
        }
        this.editor = cm(this.ref, this.props.options);
        this.shared = new Shared(this.editor, this.props);
        this.mirror = cm(function() {
        }, this.props.options);
        this.editor.on("electricInput", function() {
          _this.mirror.setHistory(_this.editor.getDoc().getHistory());
        });
        this.editor.on("cursorActivity", function() {
          _this.mirror.setCursor(_this.editor.getDoc().getCursor());
        });
        this.editor.on("beforeChange", function(cm2, data) {
          if (_this.emulating) {
            return;
          }
          data.cancel();
          _this.deferred = data;
          var phantomChange = _this.mirrorChange(_this.deferred);
          if (_this.props.onBeforeChange) _this.props.onBeforeChange(_this.editor, _this.deferred, phantomChange);
        });
        this.editor.on("change", function(cm2, data) {
          if (!_this.mounted) {
            return;
          }
          if (_this.props.onChange) {
            _this.props.onChange(_this.editor, data, _this.editor.getValue());
          }
        });
        this.hydrate(this.props);
        this.shared.apply(this.props);
        this.applied = true;
        this.mounted = true;
        this.shared.wire(this.props);
        if (this.editor.getOption("autofocus")) {
          this.editor.focus();
        }
        if (this.props.editorDidMount) {
          this.props.editorDidMount(this.editor, this.editor.getValue(), this.initCb);
        }
      };
      Controlled2.prototype.componentDidUpdate = function(prevProps) {
        if (SERVER_RENDERED) return;
        var preserved = {
          cursor: null
        };
        if (this.props.value !== prevProps.value) {
          this.hydrated = false;
        }
        if (!this.props.autoCursor && this.props.autoCursor !== void 0) {
          preserved.cursor = this.editor.getDoc().getCursor();
        }
        this.hydrate(this.props);
        if (!this.appliedNext) {
          this.shared.applyNext(prevProps, this.props, preserved);
          this.appliedNext = true;
        }
        this.shared.applyUserDefined(prevProps, preserved);
        this.appliedUserDefined = true;
      };
      Controlled2.prototype.componentWillUnmount = function() {
        if (SERVER_RENDERED) return;
        if (this.props.editorWillUnmount) {
          this.props.editorWillUnmount(cm);
        }
      };
      Controlled2.prototype.shouldComponentUpdate = function(nextProps, nextState) {
        return !SERVER_RENDERED;
      };
      Controlled2.prototype.render = function() {
        var _this = this;
        if (SERVER_RENDERED) return null;
        var className = this.props.className ? "react-codemirror2 ".concat(this.props.className) : "react-codemirror2";
        return React.createElement("div", {
          className,
          ref: function ref(self) {
            return _this.ref = self;
          }
        });
      };
      return Controlled2;
    }(React.Component);
    exports.Controlled = Controlled;
    var UnControlled = function(_super) {
      __extends(UnControlled2, _super);
      function UnControlled2(props) {
        var _this = _super.call(this, props) || this;
        if (SERVER_RENDERED) return _this;
        _this.applied = false;
        _this.appliedUserDefined = false;
        _this.continueChange = false;
        _this.detached = false;
        _this.hydrated = false;
        _this.initCb = function() {
          if (_this.props.editorDidConfigure) {
            _this.props.editorDidConfigure(_this.editor);
          }
        };
        _this.mounted = false;
        _this.onBeforeChangeCb = function() {
          _this.continueChange = true;
        };
        return _this;
      }
      UnControlled2.prototype.hydrate = function(props) {
        var _this = this;
        var _options = props && props.options ? props.options : {};
        var userDefinedOptions = _extends({}, cm.defaults, this.editor.options, _options);
        var optionDelta = Object.keys(userDefinedOptions).some(function(key) {
          return _this.editor.getOption(key) !== userDefinedOptions[key];
        });
        if (optionDelta) {
          Object.keys(userDefinedOptions).forEach(function(key) {
            if (_options.hasOwnProperty(key)) {
              if (_this.editor.getOption(key) !== userDefinedOptions[key]) {
                _this.editor.setOption(key, userDefinedOptions[key]);
              }
            }
          });
        }
        if (!this.hydrated) {
          var doc = this.editor.getDoc();
          var lastLine = doc.lastLine();
          var lastChar = doc.getLine(doc.lastLine()).length;
          doc.replaceRange(props.value || "", {
            line: 0,
            ch: 0
          }, {
            line: lastLine,
            ch: lastChar
          });
        }
        this.hydrated = true;
      };
      UnControlled2.prototype.componentDidMount = function() {
        var _this = this;
        if (SERVER_RENDERED) return;
        this.detached = this.props.detach === true;
        if (this.props.defineMode) {
          if (this.props.defineMode.name && this.props.defineMode.fn) {
            cm.defineMode(this.props.defineMode.name, this.props.defineMode.fn);
          }
        }
        this.editor = cm(this.ref, this.props.options);
        this.shared = new Shared(this.editor, this.props);
        this.editor.on("beforeChange", function(cm2, data) {
          if (_this.props.onBeforeChange) {
            _this.props.onBeforeChange(_this.editor, data, _this.editor.getValue(), _this.onBeforeChangeCb);
          }
        });
        this.editor.on("change", function(cm2, data) {
          if (!_this.mounted || !_this.props.onChange) {
            return;
          }
          if (_this.props.onBeforeChange) {
            if (_this.continueChange) {
              _this.props.onChange(_this.editor, data, _this.editor.getValue());
            }
          } else {
            _this.props.onChange(_this.editor, data, _this.editor.getValue());
          }
        });
        this.hydrate(this.props);
        this.shared.apply(this.props);
        this.applied = true;
        this.mounted = true;
        this.shared.wire(this.props);
        this.editor.getDoc().clearHistory();
        if (this.props.editorDidMount) {
          this.props.editorDidMount(this.editor, this.editor.getValue(), this.initCb);
        }
      };
      UnControlled2.prototype.componentDidUpdate = function(prevProps) {
        if (this.detached && this.props.detach === false) {
          this.detached = false;
          if (prevProps.editorDidAttach) {
            prevProps.editorDidAttach(this.editor);
          }
        }
        if (!this.detached && this.props.detach === true) {
          this.detached = true;
          if (prevProps.editorDidDetach) {
            prevProps.editorDidDetach(this.editor);
          }
        }
        if (SERVER_RENDERED || this.detached) return;
        var preserved = {
          cursor: null
        };
        if (this.props.value !== prevProps.value) {
          this.hydrated = false;
          this.applied = false;
          this.appliedUserDefined = false;
        }
        if (!prevProps.autoCursor && prevProps.autoCursor !== void 0) {
          preserved.cursor = this.editor.getDoc().getCursor();
        }
        this.hydrate(this.props);
        if (!this.applied) {
          this.shared.apply(prevProps);
          this.applied = true;
        }
        if (!this.appliedUserDefined) {
          this.shared.applyUserDefined(prevProps, preserved);
          this.appliedUserDefined = true;
        }
      };
      UnControlled2.prototype.componentWillUnmount = function() {
        if (SERVER_RENDERED) return;
        if (this.props.editorWillUnmount) {
          this.props.editorWillUnmount(cm);
        }
      };
      UnControlled2.prototype.shouldComponentUpdate = function(nextProps, nextState) {
        var update = true;
        if (SERVER_RENDERED) update = false;
        if (this.detached && nextProps.detach) update = false;
        return update;
      };
      UnControlled2.prototype.render = function() {
        var _this = this;
        if (SERVER_RENDERED) return null;
        var className = this.props.className ? "react-codemirror2 ".concat(this.props.className) : "react-codemirror2";
        return React.createElement("div", {
          className,
          ref: function ref(self) {
            return _this.ref = self;
          }
        });
      };
      return UnControlled2;
    }(React.Component);
    exports.UnControlled = UnControlled;
  }
});
export default require_react_codemirror2();
//# sourceMappingURL=react-codemirror2.js.map
