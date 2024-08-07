import {
  require_css
} from "./chunk-IMXC6RCN.js";
import {
  require_xml
} from "./chunk-V5ORE4GR.js";
import {
  require_javascript
} from "./chunk-NECNLM6J.js";
import {
  require_codemirror
} from "./chunk-DCCCD72R.js";
import {
  __commonJS
} from "./chunk-5WRI5ZAA.js";

// node_modules/codemirror/mode/htmlmixed/htmlmixed.js
var require_htmlmixed = __commonJS({
  "node_modules/codemirror/mode/htmlmixed/htmlmixed.js"(exports, module) {
    (function(mod) {
      if (typeof exports == "object" && typeof module == "object")
        mod(require_codemirror(), require_xml(), require_javascript(), require_css());
      else if (typeof define == "function" && define.amd)
        define(["../../lib/codemirror", "../xml/xml", "../javascript/javascript", "../css/css"], mod);
      else
        mod(CodeMirror);
    })(function(CodeMirror2) {
      "use strict";
      var defaultTags = {
        script: [
          ["lang", /(javascript|babel)/i, "javascript"],
          ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"],
          ["type", /./, "text/plain"],
          [null, null, "javascript"]
        ],
        style: [
          ["lang", /^css$/i, "css"],
          ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
          ["type", /./, "text/plain"],
          [null, null, "css"]
        ]
      };
      function maybeBackup(stream, pat, style) {
        var cur = stream.current(), close = cur.search(pat);
        if (close > -1) {
          stream.backUp(cur.length - close);
        } else if (cur.match(/<\/?$/)) {
          stream.backUp(cur.length);
          if (!stream.match(pat, false)) stream.match(cur);
        }
        return style;
      }
      var attrRegexpCache = {};
      function getAttrRegexp(attr) {
        var regexp = attrRegexpCache[attr];
        if (regexp) return regexp;
        return attrRegexpCache[attr] = new RegExp("\\s+" + attr + `\\s*=\\s*('|")?([^'"]+)('|")?\\s*`);
      }
      function getAttrValue(text, attr) {
        var match = text.match(getAttrRegexp(attr));
        return match ? /^\s*(.*?)\s*$/.exec(match[2])[1] : "";
      }
      function getTagRegexp(tagName, anchored) {
        return new RegExp((anchored ? "^" : "") + "</\\s*" + tagName + "\\s*>", "i");
      }
      function addTags(from, to) {
        for (var tag in from) {
          var dest = to[tag] || (to[tag] = []);
          var source = from[tag];
          for (var i = source.length - 1; i >= 0; i--)
            dest.unshift(source[i]);
        }
      }
      function findMatchingMode(tagInfo, tagText) {
        for (var i = 0; i < tagInfo.length; i++) {
          var spec = tagInfo[i];
          if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];
        }
      }
      CodeMirror2.defineMode("htmlmixed", function(config, parserConfig) {
        var htmlMode = CodeMirror2.getMode(config, {
          name: "xml",
          htmlMode: true,
          multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
          multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag,
          allowMissingTagName: parserConfig.allowMissingTagName
        });
        var tags = {};
        var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
        addTags(defaultTags, tags);
        if (configTags) addTags(configTags, tags);
        if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
          tags.script.unshift(["type", configScript[i].matches, configScript[i].mode]);
        function html(stream, state) {
          var style = htmlMode.token(stream, state.htmlState), tag = /\btag\b/.test(style), tagName;
          if (tag && !/[<>\s\/]/.test(stream.current()) && (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) && tags.hasOwnProperty(tagName)) {
            state.inTag = tagName + " ";
          } else if (state.inTag && tag && />$/.test(stream.current())) {
            var inTag = /^([\S]+) (.*)/.exec(state.inTag);
            state.inTag = null;
            var modeSpec = stream.current() == ">" && findMatchingMode(tags[inTag[1]], inTag[2]);
            var mode = CodeMirror2.getMode(config, modeSpec);
            var endTagA = getTagRegexp(inTag[1], true), endTag = getTagRegexp(inTag[1], false);
            state.token = function(stream2, state2) {
              if (stream2.match(endTagA, false)) {
                state2.token = html;
                state2.localState = state2.localMode = null;
                return null;
              }
              return maybeBackup(stream2, endTag, state2.localMode.token(stream2, state2.localState));
            };
            state.localMode = mode;
            state.localState = CodeMirror2.startState(mode, htmlMode.indent(state.htmlState, "", ""));
          } else if (state.inTag) {
            state.inTag += stream.current();
            if (stream.eol()) state.inTag += " ";
          }
          return style;
        }
        ;
        return {
          startState: function() {
            var state = CodeMirror2.startState(htmlMode);
            return { token: html, inTag: null, localMode: null, localState: null, htmlState: state };
          },
          copyState: function(state) {
            var local;
            if (state.localState) {
              local = CodeMirror2.copyState(state.localMode, state.localState);
            }
            return {
              token: state.token,
              inTag: state.inTag,
              localMode: state.localMode,
              localState: local,
              htmlState: CodeMirror2.copyState(htmlMode, state.htmlState)
            };
          },
          token: function(stream, state) {
            return state.token(stream, state);
          },
          indent: function(state, textAfter, line) {
            if (!state.localMode || /^\s*<\//.test(textAfter))
              return htmlMode.indent(state.htmlState, textAfter, line);
            else if (state.localMode.indent)
              return state.localMode.indent(state.localState, textAfter, line);
            else
              return CodeMirror2.Pass;
          },
          innerMode: function(state) {
            return { state: state.localState || state.htmlState, mode: state.localMode || htmlMode };
          }
        };
      }, "xml", "javascript", "css");
      CodeMirror2.defineMIME("text/html", "htmlmixed");
    });
  }
});

export {
  require_htmlmixed
};
//# sourceMappingURL=chunk-SULN2QBK.js.map
