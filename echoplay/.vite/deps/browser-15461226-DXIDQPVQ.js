import {
  require_browser,
  require_events,
  require_inherits_browser,
  require_string_decoder,
  require_util
} from "./chunk-OVJSNLA6.js";
import {
  require_buffer
} from "./chunk-GXA2EX5I.js";
import {
  __commonJS,
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/readable-stream/lib/internal/streams/stream-browser.js
var require_stream_browser = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/stream-browser.js"(exports, module) {
    module.exports = require_events().EventEmitter;
  }
});

// node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module) {
    "use strict";
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var _require = require_buffer();
    var Buffer2 = _require.Buffer;
    var _require2 = require_util();
    var inspect = _require2.inspect;
    var custom = inspect && inspect.custom || "inspect";
    function copyBuffer(src, target, offset) {
      Buffer2.prototype.copy.call(src, target, offset);
    }
    module.exports = (function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      _createClass(BufferList, [{
        key: "push",
        value: function push(v) {
          var entry = {
            data: v,
            next: null
          };
          if (this.length > 0) this.tail.next = entry;
          else this.head = entry;
          this.tail = entry;
          ++this.length;
        }
      }, {
        key: "unshift",
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0) this.tail = entry;
          this.head = entry;
          ++this.length;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (this.length === 0) return;
          var ret = this.head.data;
          if (this.length === 1) this.head = this.tail = null;
          else this.head = this.head.next;
          --this.length;
          return ret;
        }
      }, {
        key: "clear",
        value: function clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
      }, {
        key: "join",
        value: function join(s) {
          if (this.length === 0) return "";
          var p = this.head;
          var ret = "" + p.data;
          while (p = p.next) ret += s + p.data;
          return ret;
        }
      }, {
        key: "concat",
        value: function concat(n) {
          if (this.length === 0) return Buffer2.alloc(0);
          var ret = Buffer2.allocUnsafe(n >>> 0);
          var p = this.head;
          var i = 0;
          while (p) {
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
        // Consumes a specified amount of bytes or characters from the buffered data.
      }, {
        key: "consume",
        value: function consume(n, hasStrings) {
          var ret;
          if (n < this.head.data.length) {
            ret = this.head.data.slice(0, n);
            this.head.data = this.head.data.slice(n);
          } else if (n === this.head.data.length) {
            ret = this.shift();
          } else {
            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
          }
          return ret;
        }
      }, {
        key: "first",
        value: function first() {
          return this.head.data;
        }
        // Consumes a specified amount of characters from the buffered data.
      }, {
        key: "_getString",
        value: function _getString(n) {
          var p = this.head;
          var c = 1;
          var ret = p.data;
          n -= ret.length;
          while (p = p.next) {
            var str = p.data;
            var nb = n > str.length ? str.length : n;
            if (nb === str.length) ret += str;
            else ret += str.slice(0, n);
            n -= nb;
            if (n === 0) {
              if (nb === str.length) {
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = str.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Consumes a specified amount of bytes from the buffered data.
      }, {
        key: "_getBuffer",
        value: function _getBuffer(n) {
          var ret = Buffer2.allocUnsafe(n);
          var p = this.head;
          var c = 1;
          p.data.copy(ret);
          n -= p.data.length;
          while (p = p.next) {
            var buf = p.data;
            var nb = n > buf.length ? buf.length : n;
            buf.copy(ret, ret.length - n, 0, nb);
            n -= nb;
            if (n === 0) {
              if (nb === buf.length) {
                ++c;
                if (p.next) this.head = p.next;
                else this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = buf.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
        // Make sure the linked list only shows the minimal necessary information.
      }, {
        key: custom,
        value: function value(_, options) {
          return inspect(this, _objectSpread(_objectSpread({}, options), {}, {
            // Only inspect one level.
            depth: 0,
            // It should not recurse.
            customInspect: false
          }));
        }
      }]);
      return BufferList;
    })();
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            process.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            process.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else {
            process.nextTick(emitCloseNT, _this);
          }
        } else if (cb) {
          process.nextTick(emitCloseNT, _this);
          cb(err2);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      });
      return this;
    }
    function emitErrorAndCloseNT(self2, err) {
      emitErrorNT(self2, err);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      if (self2._writableState && !self2._writableState.emitClose) return;
      if (self2._readableState && !self2._readableState.emitClose) return;
      self2.emit("close");
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    function errorOrDestroy(stream3, err) {
      var rState = stream3._readableState;
      var wState = stream3._writableState;
      if (rState && rState.autoDestroy || wState && wState.autoDestroy) stream3.destroy(err);
      else stream3.emit("error", err);
    }
    module.exports = {
      destroy,
      undestroy,
      errorOrDestroy
    };
  }
});

// node_modules/readable-stream/errors-browser.js
var require_errors_browser = __commonJS({
  "node_modules/readable-stream/errors-browser.js"(exports, module) {
    "use strict";
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }
    var codes = {};
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      var NodeError = (function(_Base) {
        _inheritsLoose(NodeError2, _Base);
        function NodeError2(arg1, arg2, arg3) {
          return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
        }
        return NodeError2;
      })(Base);
      NodeError.prototype.name = Base.name;
      NodeError.prototype.code = code;
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        var len = expected.length;
        expected = expected.map(function(i) {
          return String(i);
        });
        if (len > 2) {
          return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
        } else if (len === 2) {
          return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
        } else {
          return "of ".concat(thing, " ").concat(expected[0]);
        }
      } else {
        return "of ".concat(thing, " ").concat(String(expected));
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
      return 'The value "' + value + '" is invalid for option "' + name + '"';
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      var determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      var msg;
      if (endsWith(name, " argument")) {
        msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      } else {
        var type = includes(name, ".") ? "property" : "argument";
        msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      }
      msg += ". Received type ".concat(typeof actual);
      return msg;
    }, TypeError);
    createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
      return "The " + name + " method is not implemented";
    });
    createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    createErrorType("ERR_STREAM_DESTROYED", function(name) {
      return "Cannot call " + name + " after a stream was destroyed";
    });
    createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
      return "Unknown encoding: " + arg;
    }, TypeError);
    createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    module.exports.codes = codes;
  }
});

// node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/state.js"(exports, module) {
    "use strict";
    var ERR_INVALID_OPT_VALUE = require_errors_browser().codes.ERR_INVALID_OPT_VALUE;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
          var name = isDuplex ? duplexKey : "highWaterMark";
          throw new ERR_INVALID_OPT_VALUE(name, hwm);
        }
        return Math.floor(hwm);
      }
      return state.objectMode ? 16 : 16 * 1024;
    }
    module.exports = {
      getHighWaterMark
    };
  }
});

// node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    "use strict";
    module.exports = Writable;
    function CorkedRequest(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var Duplex;
    Writable.WritableState = WritableState;
    var internalUtil = {
      deprecate: require_browser()
    };
    var Stream = require_stream_browser();
    var Buffer2 = require_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors_browser().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
    var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
    var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    require_inherits_browser()(Writable, Stream);
    function nop() {
    }
    function WritableState(options, stream3, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean") isDuplex = stream3 instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite(stream3, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest(this);
    }
    WritableState.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState.prototype, "buffer", {
          get: internalUtil.deprecate(function writableStateBufferGetter() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable, Symbol.hasInstance, {
        value: function value(object) {
          if (realHasInstance.call(this, object)) return true;
          if (this !== Writable) return false;
          return object && object._writableState instanceof WritableState;
        }
      });
    } else {
      realHasInstance = function realHasInstance2(object) {
        return object instanceof this;
      };
    }
    function Writable(options) {
      Duplex = Duplex || require_stream_duplex();
      var isDuplex = this instanceof Duplex;
      if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options);
      this._writableState = new WritableState(options, this, isDuplex);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function") this._write = options.write;
        if (typeof options.writev === "function") this._writev = options.writev;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
        if (typeof options.final === "function") this._final = options.final;
      }
      Stream.call(this);
    }
    Writable.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function writeAfterEnd(stream3, cb) {
      var er = new ERR_STREAM_WRITE_AFTER_END();
      errorOrDestroy(stream3, er);
      process.nextTick(cb, er);
    }
    function validChunk(stream3, state, chunk, cb) {
      var er;
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      } else if (typeof chunk !== "string" && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
      }
      if (er) {
        errorOrDestroy(stream3, er);
        process.nextTick(cb, er);
        return false;
      }
      return true;
    }
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer2.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf) encoding = "buffer";
      else if (!encoding) encoding = state.defaultEncoding;
      if (typeof cb !== "function") cb = nop;
      if (state.ending) writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string") encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    function decodeChunk(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer2.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer(stream3, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret) state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite(stream3, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite(stream3, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev) stream3._writev(chunk, state.onwrite);
      else stream3._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError(stream3, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        process.nextTick(cb, er);
        process.nextTick(finishMaybe, stream3, state);
        stream3._writableState.errorEmitted = true;
        errorOrDestroy(stream3, er);
      } else {
        cb(er);
        stream3._writableState.errorEmitted = true;
        errorOrDestroy(stream3, er);
        finishMaybe(stream3, state);
      }
    }
    function onwriteStateUpdate(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite(stream3, er) {
      var state = stream3._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      if (typeof cb !== "function") throw new ERR_MULTIPLE_CALLBACK();
      onwriteStateUpdate(state);
      if (er) onwriteError(stream3, state, sync, er, cb);
      else {
        var finished = needFinish(state) || stream3.destroyed;
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer(stream3, state);
        }
        if (sync) {
          process.nextTick(afterWrite, stream3, state, finished, cb);
        } else {
          afterWrite(stream3, state, finished, cb);
        }
      }
    }
    function afterWrite(stream3, state, finished, cb) {
      if (!finished) onwriteDrain(stream3, state);
      state.pendingcb--;
      cb();
      finishMaybe(stream3, state);
    }
    function onwriteDrain(stream3, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream3.emit("drain");
      }
    }
    function clearBuffer(stream3, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream3._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf) allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite(stream3, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite(stream3, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null) state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0) this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending) endWritable(this, state, cb);
      return this;
    };
    Object.defineProperty(Writable.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function needFinish(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream3, state) {
      stream3._final(function(err) {
        state.pendingcb--;
        if (err) {
          errorOrDestroy(stream3, err);
        }
        state.prefinished = true;
        stream3.emit("prefinish");
        finishMaybe(stream3, state);
      });
    }
    function prefinish(stream3, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream3._final === "function" && !state.destroyed) {
          state.pendingcb++;
          state.finalCalled = true;
          process.nextTick(callFinal, stream3, state);
        } else {
          state.prefinished = true;
          stream3.emit("prefinish");
        }
      }
    }
    function finishMaybe(stream3, state) {
      var need = needFinish(state);
      if (need) {
        prefinish(stream3, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream3.emit("finish");
          if (state.autoDestroy) {
            var rState = stream3._readableState;
            if (!rState || rState.autoDestroy && rState.endEmitted) {
              stream3.destroy();
            }
          }
        }
      }
      return need;
    }
    function endWritable(stream3, state, cb) {
      state.ending = true;
      finishMaybe(stream3, state);
      if (cb) {
        if (state.finished) process.nextTick(cb);
        else stream3.once("finish", cb);
      }
      state.ended = true;
      stream3.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function set(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable.prototype.destroy = destroyImpl.destroy;
    Writable.prototype._undestroy = destroyImpl.undestroy;
    Writable.prototype._destroy = function(err, cb) {
      cb(err);
    };
  }
});

// node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    "use strict";
    var objectKeys = Object.keys || function(obj) {
      var keys2 = [];
      for (var key in obj) keys2.push(key);
      return keys2;
    };
    module.exports = Duplex;
    var Readable = require_stream_readable();
    var Writable = require_stream_writable();
    require_inherits_browser()(Duplex, Readable);
    {
      keys = objectKeys(Writable.prototype);
      for (v = 0; v < keys.length; v++) {
        method = keys[v];
        if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
      }
    }
    var keys;
    var method;
    var v;
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      this.allowHalfOpen = true;
      if (options) {
        if (options.readable === false) this.readable = false;
        if (options.writable === false) this.writable = false;
        if (options.allowHalfOpen === false) {
          this.allowHalfOpen = false;
          this.once("end", onend);
        }
      }
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    Object.defineProperty(Duplex.prototype, "writableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    Object.defineProperty(Duplex.prototype, "writableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function onend() {
      if (this._writableState.ended) return;
      process.nextTick(onEndNT, this);
    }
    function onEndNT(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
  }
});

// node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module) {
    "use strict";
    var ERR_STREAM_PREMATURE_CLOSE = require_errors_browser().codes.ERR_STREAM_PREMATURE_CLOSE;
    function once(callback) {
      var called = false;
      return function() {
        if (called) return;
        called = true;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(this, args);
      };
    }
    function noop() {
    }
    function isRequest(stream3) {
      return stream3.setHeader && typeof stream3.abort === "function";
    }
    function eos(stream3, opts, callback) {
      if (typeof opts === "function") return eos(stream3, null, opts);
      if (!opts) opts = {};
      callback = once(callback || noop);
      var readable = opts.readable || opts.readable !== false && stream3.readable;
      var writable = opts.writable || opts.writable !== false && stream3.writable;
      var onlegacyfinish = function onlegacyfinish2() {
        if (!stream3.writable) onfinish();
      };
      var writableEnded = stream3._writableState && stream3._writableState.finished;
      var onfinish = function onfinish2() {
        writable = false;
        writableEnded = true;
        if (!readable) callback.call(stream3);
      };
      var readableEnded = stream3._readableState && stream3._readableState.endEmitted;
      var onend = function onend2() {
        readable = false;
        readableEnded = true;
        if (!writable) callback.call(stream3);
      };
      var onerror = function onerror2(err) {
        callback.call(stream3, err);
      };
      var onclose = function onclose2() {
        var err;
        if (readable && !readableEnded) {
          if (!stream3._readableState || !stream3._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream3, err);
        }
        if (writable && !writableEnded) {
          if (!stream3._writableState || !stream3._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream3, err);
        }
      };
      var onrequest = function onrequest2() {
        stream3.req.on("finish", onfinish);
      };
      if (isRequest(stream3)) {
        stream3.on("complete", onfinish);
        stream3.on("abort", onclose);
        if (stream3.req) onrequest();
        else stream3.on("request", onrequest);
      } else if (writable && !stream3._writableState) {
        stream3.on("end", onlegacyfinish);
        stream3.on("close", onlegacyfinish);
      }
      stream3.on("end", onend);
      stream3.on("finish", onfinish);
      if (opts.error !== false) stream3.on("error", onerror);
      stream3.on("close", onclose);
      return function() {
        stream3.removeListener("complete", onfinish);
        stream3.removeListener("abort", onclose);
        stream3.removeListener("request", onrequest);
        if (stream3.req) stream3.req.removeListener("finish", onfinish);
        stream3.removeListener("end", onlegacyfinish);
        stream3.removeListener("close", onlegacyfinish);
        stream3.removeListener("finish", onfinish);
        stream3.removeListener("end", onend);
        stream3.removeListener("error", onerror);
        stream3.removeListener("close", onclose);
      };
    }
    module.exports = eos;
  }
});

// node_modules/readable-stream/lib/internal/streams/async_iterator.js
var require_async_iterator = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/async_iterator.js"(exports, module) {
    "use strict";
    var _Object$setPrototypeO;
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== void 0) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    var finished = require_end_of_stream();
    var kLastResolve = Symbol("lastResolve");
    var kLastReject = Symbol("lastReject");
    var kError = Symbol("error");
    var kEnded = Symbol("ended");
    var kLastPromise = Symbol("lastPromise");
    var kHandlePromise = Symbol("handlePromise");
    var kStream = Symbol("stream");
    function createIterResult(value, done) {
      return {
        value,
        done
      };
    }
    function readAndResolve(iter) {
      var resolve2 = iter[kLastResolve];
      if (resolve2 !== null) {
        var data = iter[kStream].read();
        if (data !== null) {
          iter[kLastPromise] = null;
          iter[kLastResolve] = null;
          iter[kLastReject] = null;
          resolve2(createIterResult(data, false));
        }
      }
    }
    function onReadable(iter) {
      process.nextTick(readAndResolve, iter);
    }
    function wrapForNext(lastPromise, iter) {
      return function(resolve2, reject2) {
        lastPromise.then(function() {
          if (iter[kEnded]) {
            resolve2(createIterResult(void 0, true));
            return;
          }
          iter[kHandlePromise](resolve2, reject2);
        }, reject2);
      };
    }
    var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
    });
    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
      get stream() {
        return this[kStream];
      },
      next: function next() {
        var _this = this;
        var error = this[kError];
        if (error !== null) {
          return Promise.reject(error);
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(void 0, true));
        }
        if (this[kStream].destroyed) {
          return new Promise(function(resolve2, reject2) {
            process.nextTick(function() {
              if (_this[kError]) {
                reject2(_this[kError]);
              } else {
                resolve2(createIterResult(void 0, true));
              }
            });
          });
        }
        var lastPromise = this[kLastPromise];
        var promise;
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this));
        } else {
          var data = this[kStream].read();
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false));
          }
          promise = new Promise(this[kHandlePromise]);
        }
        this[kLastPromise] = promise;
        return promise;
      }
    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
      return this;
    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
      var _this2 = this;
      return new Promise(function(resolve2, reject2) {
        _this2[kStream].destroy(null, function(err) {
          if (err) {
            reject2(err);
            return;
          }
          resolve2(createIterResult(void 0, true));
        });
      });
    }), _Object$setPrototypeO), AsyncIteratorPrototype);
    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream3) {
      var _Object$create;
      var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
        value: stream3,
        writable: true
      }), _defineProperty(_Object$create, kLastResolve, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kLastReject, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kError, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kEnded, {
        value: stream3._readableState.endEmitted,
        writable: true
      }), _defineProperty(_Object$create, kHandlePromise, {
        value: function value(resolve2, reject2) {
          var data = iterator[kStream].read();
          if (data) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve2(createIterResult(data, false));
          } else {
            iterator[kLastResolve] = resolve2;
            iterator[kLastReject] = reject2;
          }
        },
        writable: true
      }), _Object$create));
      iterator[kLastPromise] = null;
      finished(stream3, function(err) {
        if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
          var reject2 = iterator[kLastReject];
          if (reject2 !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            reject2(err);
          }
          iterator[kError] = err;
          return;
        }
        var resolve2 = iterator[kLastResolve];
        if (resolve2 !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve2(createIterResult(void 0, true));
        }
        iterator[kEnded] = true;
      });
      stream3.on("readable", onReadable.bind(null, iterator));
      return iterator;
    };
    module.exports = createReadableStreamAsyncIterator;
  }
});

// node_modules/readable-stream/lib/internal/streams/from-browser.js
var require_from_browser = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/from-browser.js"(exports, module) {
    module.exports = function() {
      throw new Error("Readable.from is not available in the browser");
    };
  }
});

// node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    "use strict";
    module.exports = Readable;
    var Duplex;
    Readable.ReadableState = ReadableState;
    var EE = require_events().EventEmitter;
    var EElistenerCount = function EElistenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream = require_stream_browser();
    var Buffer2 = require_buffer().Buffer;
    var OurUint8Array = (typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : {}).Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer2.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer2.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var debugUtil = require_util();
    var debug;
    if (debugUtil && debugUtil.debuglog) {
      debug = debugUtil.debuglog("stream");
    } else {
      debug = function debug2() {
      };
    }
    var BufferList = require_buffer_list();
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors_browser().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
    var StringDecoder;
    var createReadableStreamAsyncIterator;
    var from;
    require_inherits_browser()(Readable, Stream);
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener(emitter, event, fn) {
      if (typeof emitter.prependListener === "function") return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);
      else emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState(options, stream3, isDuplex) {
      Duplex = Duplex || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean") isDuplex = stream3 instanceof Duplex;
      this.objectMode = !!options.objectMode;
      if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
      this.buffer = new BufferList();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.paused = true;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable(options) {
      Duplex = Duplex || require_stream_duplex();
      if (!(this instanceof Readable)) return new Readable(options);
      var isDuplex = this instanceof Duplex;
      this._readableState = new ReadableState(options, this, isDuplex);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function") this._read = options.read;
        if (typeof options.destroy === "function") this._destroy = options.destroy;
      }
      Stream.call(this);
    }
    Object.defineProperty(Readable.prototype, "destroyed", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable.prototype.destroy = destroyImpl.destroy;
    Readable.prototype._undestroy = destroyImpl.undestroy;
    Readable.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer2.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable.prototype.unshift = function(chunk) {
      return readableAddChunk(this, chunk, null, true, false);
    };
    function readableAddChunk(stream3, chunk, encoding, addToFront, skipChunkCheck) {
      debug("readableAddChunk", chunk);
      var state = stream3._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk(stream3, state);
      } else {
        var er;
        if (!skipChunkCheck) er = chunkInvalid(state, chunk);
        if (er) {
          errorOrDestroy(stream3, er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer2.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted) errorOrDestroy(stream3, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else addChunk(stream3, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream3, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed) {
            return false;
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0) addChunk(stream3, state, chunk, false);
              else maybeReadMore(stream3, state);
            } else {
              addChunk(stream3, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
          maybeReadMore(stream3, state);
        }
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream3, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        state.awaitDrain = 0;
        stream3.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) state.buffer.unshift(chunk);
        else state.buffer.push(chunk);
        if (state.needReadable) emitReadable(stream3);
      }
      maybeReadMore(stream3, state);
    }
    function chunkInvalid(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
      return er;
    }
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      if (!StringDecoder) StringDecoder = require_string_decoder().StringDecoder;
      var decoder = new StringDecoder(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      var p = this._readableState.buffer.head;
      var content = "";
      while (p !== null) {
        content += decoder.write(p.data);
        p = p.next;
      }
      this._readableState.buffer.clear();
      if (content !== "") this._readableState.buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM = 1073741824;
    function computeNewHighWaterMark(n) {
      if (n >= MAX_HWM) {
        n = MAX_HWM;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead(n, state) {
      if (n <= 0 || state.length === 0 && state.ended) return 0;
      if (state.objectMode) return 1;
      if (n !== n) {
        if (state.flowing && state.length) return state.buffer.head.data.length;
        else return state.length;
      }
      if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
      if (n <= state.length) return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0) state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) endReadable(this);
        else emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0) endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0) ret = fromList(n, state);
      else ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        state.awaitDrain = 0;
      }
      if (state.length === 0) {
        if (!state.ended) state.needReadable = true;
        if (nOrig !== n && state.ended) endReadable(this);
      }
      if (ret !== null) this.emit("data", ret);
      return ret;
    };
    function onEofChunk(stream3, state) {
      debug("onEofChunk");
      if (state.ended) return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable(stream3);
      } else {
        state.needReadable = false;
        if (!state.emittedReadable) {
          state.emittedReadable = true;
          emitReadable_(stream3);
        }
      }
    }
    function emitReadable(stream3) {
      var state = stream3._readableState;
      debug("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        process.nextTick(emitReadable_, stream3);
      }
    }
    function emitReadable_(stream3) {
      var state = stream3._readableState;
      debug("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && (state.length || state.ended)) {
        stream3.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow(stream3);
    }
    function maybeReadMore(stream3, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(maybeReadMore_, stream3, state);
      }
    }
    function maybeReadMore_(stream3, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        var len = state.length;
        debug("maybeReadMore read 0");
        stream3.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable.prototype._read = function(n) {
      errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend : unpipe;
      if (state.endEmitted) process.nextTick(endFn);
      else src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        var ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0) errorOrDestroy(dest, er);
      }
      prependListener(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain(src) {
      return function pipeOnDrainFunctionResult() {
        var state = src._readableState;
        debug("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain) state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow(src);
        }
      };
    }
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipesCount === 0) return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes) return this;
        if (!dest) dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest) dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, {
          hasUnpiped: false
        });
        return this;
      }
      var index = indexOf(state.pipes, dest);
      if (index === -1) return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1) state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = Stream.prototype.on.call(this, ev, fn);
      var state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false) this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable(this);
          } else if (!state.reading) {
            process.nextTick(nReadingNextTick, this);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.removeListener = function(ev, fn) {
      var res = Stream.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable.prototype.removeAllListeners = function(ev) {
      var res = Stream.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self2) {
      var state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && !state.paused) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      }
    }
    function nReadingNextTick(self2) {
      debug("readable nexttick read 0");
      self2.read(0);
    }
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
      }
      state.paused = false;
      return this;
    };
    function resume(stream3, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process.nextTick(resume_, stream3, state);
      }
    }
    function resume_(stream3, state) {
      debug("resume", state.reading);
      if (!state.reading) {
        stream3.read(0);
      }
      state.resumeScheduled = false;
      stream3.emit("resume");
      flow(stream3);
      if (state.flowing && !state.reading) stream3.read(0);
    }
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState.paused = true;
      return this;
    };
    function flow(stream3) {
      var state = stream3._readableState;
      debug("flow", state.flowing);
      while (state.flowing && stream3.read() !== null) ;
    }
    Readable.prototype.wrap = function(stream3) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream3.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) _this.push(chunk);
        }
        _this.push(null);
      });
      stream3.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder) chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0)) return;
        else if (!state.objectMode && (!chunk || !chunk.length)) return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream3.pause();
        }
      });
      for (var i in stream3) {
        if (this[i] === void 0 && typeof stream3[i] === "function") {
          this[i] = /* @__PURE__ */ (function methodWrap(method) {
            return function methodWrapReturnFunction() {
              return stream3[method].apply(stream3, arguments);
            };
          })(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream3.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream3.resume();
        }
      };
      return this;
    };
    if (typeof Symbol === "function") {
      Readable.prototype[Symbol.asyncIterator] = function() {
        if (createReadableStreamAsyncIterator === void 0) {
          createReadableStreamAsyncIterator = require_async_iterator();
        }
        return createReadableStreamAsyncIterator(this);
      };
    }
    Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    });
    Object.defineProperty(Readable.prototype, "readableBuffer", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState && this._readableState.buffer;
      }
    });
    Object.defineProperty(Readable.prototype, "readableFlowing", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.flowing;
      },
      set: function set(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    });
    Readable._fromList = fromList;
    Object.defineProperty(Readable.prototype, "readableLength", {
      // making it explicit this property is not enumerable
      // because otherwise some prototype manipulation in
      // userland will fail
      enumerable: false,
      get: function get() {
        return this._readableState.length;
      }
    });
    function fromList(n, state) {
      if (state.length === 0) return null;
      var ret;
      if (state.objectMode) ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder) ret = state.buffer.join("");
        else if (state.buffer.length === 1) ret = state.buffer.first();
        else ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable(stream3) {
      var state = stream3._readableState;
      debug("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process.nextTick(endReadableNT, state, stream3);
      }
    }
    function endReadableNT(state, stream3) {
      debug("endReadableNT", state.endEmitted, state.length);
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream3.readable = false;
        stream3.emit("end");
        if (state.autoDestroy) {
          var wState = stream3._writableState;
          if (!wState || wState.autoDestroy && wState.finished) {
            stream3.destroy();
          }
        }
      }
    }
    if (typeof Symbol === "function") {
      Readable.from = function(iterable, opts) {
        if (from === void 0) {
          from = require_from_browser();
        }
        return from(Readable, iterable, opts);
      };
    }
    function indexOf(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
      }
      return -1;
    }
  }
});

// node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    "use strict";
    module.exports = Transform;
    var _require$codes = require_errors_browser().codes;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
    var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
    var Duplex = require_stream_duplex();
    require_inherits_browser()(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (cb === null) {
        return this.emit("error", new ERR_MULTIPLE_CALLBACK());
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function") this._transform = options.transform;
        if (typeof options.flush === "function") this._flush = options.flush;
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      if (typeof this._flush === "function" && !this._readableState.destroyed) {
        this._flush(function(er, data) {
          done(_this, er, data);
        });
      } else {
        done(this, null, null);
      }
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform.prototype._destroy = function(err, cb) {
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
      });
    };
    function done(stream3, er, data) {
      if (er) return stream3.emit("error", er);
      if (data != null)
        stream3.push(data);
      if (stream3._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
      if (stream3._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
      return stream3.push(null);
    }
  }
});

// node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    "use strict";
    module.exports = PassThrough;
    var Transform = require_stream_transform();
    require_inherits_browser()(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module) {
    "use strict";
    var eos;
    function once(callback) {
      var called = false;
      return function() {
        if (called) return;
        called = true;
        callback.apply(void 0, arguments);
      };
    }
    var _require$codes = require_errors_browser().codes;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    function noop(err) {
      if (err) throw err;
    }
    function isRequest(stream3) {
      return stream3.setHeader && typeof stream3.abort === "function";
    }
    function destroyer(stream3, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream3.on("close", function() {
        closed = true;
      });
      if (eos === void 0) eos = require_end_of_stream();
      eos(stream3, {
        readable: reading,
        writable: writing
      }, function(err) {
        if (err) return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed) return;
        if (destroyed) return;
        destroyed = true;
        if (isRequest(stream3)) return stream3.abort();
        if (typeof stream3.destroy === "function") return stream3.destroy();
        callback(err || new ERR_STREAM_DESTROYED("pipe"));
      };
    }
    function call(fn) {
      fn();
    }
    function pipe(from, to) {
      return from.pipe(to);
    }
    function popCallback(streams) {
      if (!streams.length) return noop;
      if (typeof streams[streams.length - 1] !== "function") return noop;
      return streams.pop();
    }
    function pipeline() {
      for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
        streams[_key] = arguments[_key];
      }
      var callback = popCallback(streams);
      if (Array.isArray(streams[0])) streams = streams[0];
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      var error;
      var destroys = streams.map(function(stream3, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream3, reading, writing, function(err) {
          if (!error) error = err;
          if (err) destroys.forEach(call);
          if (reading) return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    }
    module.exports = pipeline;
  }
});

// node_modules/readable-stream/readable-browser.js
var require_readable_browser = __commonJS({
  "node_modules/readable-stream/readable-browser.js"(exports, module) {
    exports = module.exports = require_stream_readable();
    exports.Stream = exports;
    exports.Readable = exports;
    exports.Writable = require_stream_writable();
    exports.Duplex = require_stream_duplex();
    exports.Transform = require_stream_transform();
    exports.PassThrough = require_stream_passthrough();
    exports.finished = require_end_of_stream();
    exports.pipeline = require_pipeline();
  }
});

// node_modules/@audius/sdk/dist/browser-15461226.js
var import_readable_stream = __toESM(require_readable_browser());
function _mergeNamespaces(n, m) {
  m.forEach(function(e) {
    e && typeof e !== "string" && !Array.isArray(e) && Object.keys(e).forEach(function(k) {
      if (k !== "default" && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  });
  return Object.freeze(n);
}
var browser$2 = { exports: {} };
var lib$2 = {};
Object.defineProperty(lib$2, "__esModule", {
  value: true
});
lib$2.ReadableWebToNodeStream = void 0;
var readable_stream_1 = import_readable_stream.default;
var ReadableWebToNodeStream = class extends readable_stream_1.Readable {
  /**
   *
   * @param stream Readable​Stream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
   */
  constructor(stream3) {
    super();
    this.bytesRead = 0;
    this.released = false;
    this.reader = stream3.getReader();
  }
  /**
   * Implementation of readable._read(size).
   * When readable._read() is called, if data is available from the resource,
   * the implementation should begin pushing that data into the read queue
   * https://nodejs.org/api/stream.html#stream_readable_read_size_1
   */
  async _read() {
    if (this.released) {
      this.push(null);
      return;
    }
    this.pendingRead = this.reader.read();
    const data = await this.pendingRead;
    delete this.pendingRead;
    if (data.done || this.released) {
      this.push(null);
    } else {
      this.bytesRead += data.value.length;
      this.push(data.value);
    }
  }
  /**
   * If there is no unresolved read call to Web-API Readable​Stream immediately returns;
   * otherwise will wait until the read is resolved.
   */
  async waitForReadToComplete() {
    if (this.pendingRead) {
      await this.pendingRead;
    }
  }
  /**
   * Close wrapper
   */
  async close() {
    await this.syncAndRelease();
  }
  async syncAndRelease() {
    this.released = true;
    await this.waitForReadToComplete();
    await this.reader.releaseLock();
  }
};
lib$2.ReadableWebToNodeStream = ReadableWebToNodeStream;
var lib$1 = {};
var ieee754 = {};
ieee754.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
ieee754.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer[offset + i - d] |= s * 128;
};
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AnsiStringType = exports.StringType = exports.BufferType = exports.Uint8ArrayType = exports.IgnoreType = exports.Float80_LE = exports.Float80_BE = exports.Float64_LE = exports.Float64_BE = exports.Float32_LE = exports.Float32_BE = exports.Float16_LE = exports.Float16_BE = exports.INT64_BE = exports.UINT64_BE = exports.INT64_LE = exports.UINT64_LE = exports.INT32_LE = exports.INT32_BE = exports.INT24_BE = exports.INT24_LE = exports.INT16_LE = exports.INT16_BE = exports.INT8 = exports.UINT32_BE = exports.UINT32_LE = exports.UINT24_BE = exports.UINT24_LE = exports.UINT16_BE = exports.UINT16_LE = exports.UINT8 = void 0;
  const ieee754$1 = ieee754;
  function dv(array) {
    return new DataView(array.buffer, array.byteOffset);
  }
  exports.UINT8 = {
    len: 1,
    get(array, offset) {
      return dv(array).getUint8(offset);
    },
    put(array, offset, value) {
      dv(array).setUint8(offset, value);
      return offset + 1;
    }
  };
  exports.UINT16_LE = {
    len: 2,
    get(array, offset) {
      return dv(array).getUint16(offset, true);
    },
    put(array, offset, value) {
      dv(array).setUint16(offset, value, true);
      return offset + 2;
    }
  };
  exports.UINT16_BE = {
    len: 2,
    get(array, offset) {
      return dv(array).getUint16(offset);
    },
    put(array, offset, value) {
      dv(array).setUint16(offset, value);
      return offset + 2;
    }
  };
  exports.UINT24_LE = {
    len: 3,
    get(array, offset) {
      const dataView = dv(array);
      return dataView.getUint8(offset) + (dataView.getUint16(offset + 1, true) << 8);
    },
    put(array, offset, value) {
      const dataView = dv(array);
      dataView.setUint8(offset, value & 255);
      dataView.setUint16(offset + 1, value >> 8, true);
      return offset + 3;
    }
  };
  exports.UINT24_BE = {
    len: 3,
    get(array, offset) {
      const dataView = dv(array);
      return (dataView.getUint16(offset) << 8) + dataView.getUint8(offset + 2);
    },
    put(array, offset, value) {
      const dataView = dv(array);
      dataView.setUint16(offset, value >> 8);
      dataView.setUint8(offset + 2, value & 255);
      return offset + 3;
    }
  };
  exports.UINT32_LE = {
    len: 4,
    get(array, offset) {
      return dv(array).getUint32(offset, true);
    },
    put(array, offset, value) {
      dv(array).setUint32(offset, value, true);
      return offset + 4;
    }
  };
  exports.UINT32_BE = {
    len: 4,
    get(array, offset) {
      return dv(array).getUint32(offset);
    },
    put(array, offset, value) {
      dv(array).setUint32(offset, value);
      return offset + 4;
    }
  };
  exports.INT8 = {
    len: 1,
    get(array, offset) {
      return dv(array).getInt8(offset);
    },
    put(array, offset, value) {
      dv(array).setInt8(offset, value);
      return offset + 1;
    }
  };
  exports.INT16_BE = {
    len: 2,
    get(array, offset) {
      return dv(array).getInt16(offset);
    },
    put(array, offset, value) {
      dv(array).setInt16(offset, value);
      return offset + 2;
    }
  };
  exports.INT16_LE = {
    len: 2,
    get(array, offset) {
      return dv(array).getInt16(offset, true);
    },
    put(array, offset, value) {
      dv(array).setInt16(offset, value, true);
      return offset + 2;
    }
  };
  exports.INT24_LE = {
    len: 3,
    get(array, offset) {
      const unsigned = exports.UINT24_LE.get(array, offset);
      return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
    },
    put(array, offset, value) {
      const dataView = dv(array);
      dataView.setUint8(offset, value & 255);
      dataView.setUint16(offset + 1, value >> 8, true);
      return offset + 3;
    }
  };
  exports.INT24_BE = {
    len: 3,
    get(array, offset) {
      const unsigned = exports.UINT24_BE.get(array, offset);
      return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
    },
    put(array, offset, value) {
      const dataView = dv(array);
      dataView.setUint16(offset, value >> 8);
      dataView.setUint8(offset + 2, value & 255);
      return offset + 3;
    }
  };
  exports.INT32_BE = {
    len: 4,
    get(array, offset) {
      return dv(array).getInt32(offset);
    },
    put(array, offset, value) {
      dv(array).setInt32(offset, value);
      return offset + 4;
    }
  };
  exports.INT32_LE = {
    len: 4,
    get(array, offset) {
      return dv(array).getInt32(offset, true);
    },
    put(array, offset, value) {
      dv(array).setInt32(offset, value, true);
      return offset + 4;
    }
  };
  exports.UINT64_LE = {
    len: 8,
    get(array, offset) {
      return dv(array).getBigUint64(offset, true);
    },
    put(array, offset, value) {
      dv(array).setBigUint64(offset, value, true);
      return offset + 8;
    }
  };
  exports.INT64_LE = {
    len: 8,
    get(array, offset) {
      return dv(array).getBigInt64(offset, true);
    },
    put(array, offset, value) {
      dv(array).setBigInt64(offset, value, true);
      return offset + 8;
    }
  };
  exports.UINT64_BE = {
    len: 8,
    get(array, offset) {
      return dv(array).getBigUint64(offset);
    },
    put(array, offset, value) {
      dv(array).setBigUint64(offset, value);
      return offset + 8;
    }
  };
  exports.INT64_BE = {
    len: 8,
    get(array, offset) {
      return dv(array).getBigInt64(offset);
    },
    put(array, offset, value) {
      dv(array).setBigInt64(offset, value);
      return offset + 8;
    }
  };
  exports.Float16_BE = {
    len: 2,
    get(dataView, offset) {
      return ieee754$1.read(dataView, offset, false, 10, this.len);
    },
    put(dataView, offset, value) {
      ieee754$1.write(dataView, value, offset, false, 10, this.len);
      return offset + this.len;
    }
  };
  exports.Float16_LE = {
    len: 2,
    get(array, offset) {
      return ieee754$1.read(array, offset, true, 10, this.len);
    },
    put(array, offset, value) {
      ieee754$1.write(array, value, offset, true, 10, this.len);
      return offset + this.len;
    }
  };
  exports.Float32_BE = {
    len: 4,
    get(array, offset) {
      return dv(array).getFloat32(offset);
    },
    put(array, offset, value) {
      dv(array).setFloat32(offset, value);
      return offset + 4;
    }
  };
  exports.Float32_LE = {
    len: 4,
    get(array, offset) {
      return dv(array).getFloat32(offset, true);
    },
    put(array, offset, value) {
      dv(array).setFloat32(offset, value, true);
      return offset + 4;
    }
  };
  exports.Float64_BE = {
    len: 8,
    get(array, offset) {
      return dv(array).getFloat64(offset);
    },
    put(array, offset, value) {
      dv(array).setFloat64(offset, value);
      return offset + 8;
    }
  };
  exports.Float64_LE = {
    len: 8,
    get(array, offset) {
      return dv(array).getFloat64(offset, true);
    },
    put(array, offset, value) {
      dv(array).setFloat64(offset, value, true);
      return offset + 8;
    }
  };
  exports.Float80_BE = {
    len: 10,
    get(array, offset) {
      return ieee754$1.read(array, offset, false, 63, this.len);
    },
    put(array, offset, value) {
      ieee754$1.write(array, value, offset, false, 63, this.len);
      return offset + this.len;
    }
  };
  exports.Float80_LE = {
    len: 10,
    get(array, offset) {
      return ieee754$1.read(array, offset, true, 63, this.len);
    },
    put(array, offset, value) {
      ieee754$1.write(array, value, offset, true, 63, this.len);
      return offset + this.len;
    }
  };
  class IgnoreType {
    /**
     * @param len number of bytes to ignore
     */
    constructor(len) {
      this.len = len;
    }
    // ToDo: don't read, but skip data
    get(array, off) {
    }
  }
  exports.IgnoreType = IgnoreType;
  class Uint8ArrayType {
    constructor(len) {
      this.len = len;
    }
    get(array, offset) {
      return array.subarray(offset, offset + this.len);
    }
  }
  exports.Uint8ArrayType = Uint8ArrayType;
  class BufferType {
    constructor(len) {
      this.len = len;
    }
    get(uint8Array, off) {
      return Buffer.from(uint8Array.subarray(off, off + this.len));
    }
  }
  exports.BufferType = BufferType;
  class StringType {
    constructor(len, encoding) {
      this.len = len;
      this.encoding = encoding;
    }
    get(uint8Array, offset) {
      return Buffer.from(uint8Array).toString(this.encoding, offset, offset + this.len);
    }
  }
  exports.StringType = StringType;
  class AnsiStringType {
    constructor(len) {
      this.len = len;
    }
    static decode(buffer, offset, until) {
      let str = "";
      for (let i = offset; i < until; ++i) {
        str += AnsiStringType.codePointToString(AnsiStringType.singleByteDecoder(buffer[i]));
      }
      return str;
    }
    static inRange(a, min, max) {
      return min <= a && a <= max;
    }
    static codePointToString(cp) {
      if (cp <= 65535) {
        return String.fromCharCode(cp);
      } else {
        cp -= 65536;
        return String.fromCharCode((cp >> 10) + 55296, (cp & 1023) + 56320);
      }
    }
    static singleByteDecoder(bite) {
      if (AnsiStringType.inRange(bite, 0, 127)) {
        return bite;
      }
      const codePoint = AnsiStringType.windows1252[bite - 128];
      if (codePoint === null) {
        throw Error("invaliding encoding");
      }
      return codePoint;
    }
    get(buffer) {
      let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
      return AnsiStringType.decode(buffer, offset, offset + this.len);
    }
  }
  exports.AnsiStringType = AnsiStringType;
  AnsiStringType.windows1252 = [8364, 129, 8218, 402, 8222, 8230, 8224, 8225, 710, 8240, 352, 8249, 338, 141, 381, 143, 144, 8216, 8217, 8220, 8221, 8226, 8211, 8212, 732, 8482, 353, 8250, 339, 157, 382, 376, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255];
})(lib$1);
var core$1 = {};
var ReadStreamTokenizer$1 = {};
var AbstractTokenizer$1 = {};
var lib = {};
var EndOfFileStream = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.EndOfStreamError = exports.defaultMessages = void 0;
  exports.defaultMessages = "End-Of-Stream";
  class EndOfStreamError extends Error {
    constructor() {
      super(exports.defaultMessages);
    }
  }
  exports.EndOfStreamError = EndOfStreamError;
})(EndOfFileStream);
var StreamReader = {};
var Deferred$1 = {};
Object.defineProperty(Deferred$1, "__esModule", {
  value: true
});
Deferred$1.Deferred = void 0;
var Deferred = class {
  constructor() {
    this.resolve = () => null;
    this.reject = () => null;
    this.promise = new Promise((resolve2, reject2) => {
      this.reject = reject2;
      this.resolve = resolve2;
    });
  }
};
Deferred$1.Deferred = Deferred;
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.StreamReader = exports.EndOfStreamError = void 0;
  const EndOfFileStream_1 = EndOfFileStream;
  const Deferred_1 = Deferred$1;
  var EndOfFileStream_2 = EndOfFileStream;
  Object.defineProperty(exports, "EndOfStreamError", {
    enumerable: true,
    get: function() {
      return EndOfFileStream_2.EndOfStreamError;
    }
  });
  const maxStreamReadSize = 1 * 1024 * 1024;
  class StreamReader2 {
    constructor(s) {
      this.s = s;
      this.deferred = null;
      this.endOfStream = false;
      this.peekQueue = [];
      if (!s.read || !s.once) {
        throw new Error("Expected an instance of stream.Readable");
      }
      this.s.once("end", () => this.reject(new EndOfFileStream_1.EndOfStreamError()));
      this.s.once("error", (err) => this.reject(err));
      this.s.once("close", () => this.reject(new Error("Stream closed")));
    }
    /**
     * Read ahead (peek) from stream. Subsequent read or peeks will return the same data
     * @param uint8Array - Uint8Array (or Buffer) to store data read from stream in
     * @param offset - Offset target
     * @param length - Number of bytes to read
     * @returns Number of bytes peeked
     */
    async peek(uint8Array, offset, length) {
      const bytesRead = await this.read(uint8Array, offset, length);
      this.peekQueue.push(uint8Array.subarray(offset, offset + bytesRead));
      return bytesRead;
    }
    /**
     * Read chunk from stream
     * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
     * @param offset - Offset target
     * @param length - Number of bytes to read
     * @returns Number of bytes read
     */
    async read(buffer, offset, length) {
      if (length === 0) {
        return 0;
      }
      if (this.peekQueue.length === 0 && this.endOfStream) {
        throw new EndOfFileStream_1.EndOfStreamError();
      }
      let remaining = length;
      let bytesRead = 0;
      while (this.peekQueue.length > 0 && remaining > 0) {
        const peekData = this.peekQueue.pop();
        if (!peekData) throw new Error("peekData should be defined");
        const lenCopy = Math.min(peekData.length, remaining);
        buffer.set(peekData.subarray(0, lenCopy), offset + bytesRead);
        bytesRead += lenCopy;
        remaining -= lenCopy;
        if (lenCopy < peekData.length) {
          this.peekQueue.push(peekData.subarray(lenCopy));
        }
      }
      while (remaining > 0 && !this.endOfStream) {
        const reqLen = Math.min(remaining, maxStreamReadSize);
        const chunkLen = await this.readFromStream(buffer, offset + bytesRead, reqLen);
        bytesRead += chunkLen;
        if (chunkLen < reqLen) break;
        remaining -= chunkLen;
      }
      return bytesRead;
    }
    /**
     * Read chunk from stream
     * @param buffer Target Uint8Array (or Buffer) to store data read from stream in
     * @param offset Offset target
     * @param length Number of bytes to read
     * @returns Number of bytes read
     */
    async readFromStream(buffer, offset, length) {
      const readBuffer = this.s.read(length);
      if (readBuffer) {
        buffer.set(readBuffer, offset);
        return readBuffer.length;
      } else {
        const request = {
          buffer,
          offset,
          length,
          deferred: new Deferred_1.Deferred()
        };
        this.deferred = request.deferred;
        this.s.once("readable", () => {
          this.readDeferred(request);
        });
        return request.deferred.promise;
      }
    }
    /**
     * Process deferred read request
     * @param request Deferred read request
     */
    readDeferred(request) {
      const readBuffer = this.s.read(request.length);
      if (readBuffer) {
        request.buffer.set(readBuffer, request.offset);
        request.deferred.resolve(readBuffer.length);
        this.deferred = null;
      } else {
        this.s.once("readable", () => {
          this.readDeferred(request);
        });
      }
    }
    reject(err) {
      this.endOfStream = true;
      if (this.deferred) {
        this.deferred.reject(err);
        this.deferred = null;
      }
    }
  }
  exports.StreamReader = StreamReader2;
})(StreamReader);
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.StreamReader = exports.EndOfStreamError = void 0;
  var EndOfFileStream_1 = EndOfFileStream;
  Object.defineProperty(exports, "EndOfStreamError", {
    enumerable: true,
    get: function() {
      return EndOfFileStream_1.EndOfStreamError;
    }
  });
  var StreamReader_1 = StreamReader;
  Object.defineProperty(exports, "StreamReader", {
    enumerable: true,
    get: function() {
      return StreamReader_1.StreamReader;
    }
  });
})(lib);
Object.defineProperty(AbstractTokenizer$1, "__esModule", {
  value: true
});
AbstractTokenizer$1.AbstractTokenizer = void 0;
var peek_readable_1$2 = lib;
var AbstractTokenizer = class {
  constructor(fileInfo) {
    this.position = 0;
    this.numBuffer = new Uint8Array(8);
    this.fileInfo = fileInfo ? fileInfo : {};
  }
  /**
   * Read a token from the tokenizer-stream
   * @param token - The token to read
   * @param position - If provided, the desired position in the tokenizer-stream
   * @returns Promise with token data
   */
  async readToken(token) {
    let position = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.position;
    const uint8Array = Buffer.alloc(token.len);
    const len = await this.readBuffer(uint8Array, {
      position
    });
    if (len < token.len) throw new peek_readable_1$2.EndOfStreamError();
    return token.get(uint8Array, 0);
  }
  /**
   * Peek a token from the tokenizer-stream.
   * @param token - Token to peek from the tokenizer-stream.
   * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
   * @returns Promise with token data
   */
  async peekToken(token) {
    let position = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.position;
    const uint8Array = Buffer.alloc(token.len);
    const len = await this.peekBuffer(uint8Array, {
      position
    });
    if (len < token.len) throw new peek_readable_1$2.EndOfStreamError();
    return token.get(uint8Array, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async readNumber(token) {
    const len = await this.readBuffer(this.numBuffer, {
      length: token.len
    });
    if (len < token.len) throw new peek_readable_1$2.EndOfStreamError();
    return token.get(this.numBuffer, 0);
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  async peekNumber(token) {
    const len = await this.peekBuffer(this.numBuffer, {
      length: token.len
    });
    if (len < token.len) throw new peek_readable_1$2.EndOfStreamError();
    return token.get(this.numBuffer, 0);
  }
  /**
   * Ignore number of bytes, advances the pointer in under tokenizer-stream.
   * @param length - Number of bytes to ignore
   * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
   */
  async ignore(length) {
    if (this.fileInfo.size !== void 0) {
      const bytesLeft = this.fileInfo.size - this.position;
      if (length > bytesLeft) {
        this.position += bytesLeft;
        return bytesLeft;
      }
    }
    this.position += length;
    return length;
  }
  async close() {
  }
  normalizeOptions(uint8Array, options) {
    if (options && options.position !== void 0 && options.position < this.position) {
      throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
    }
    if (options) {
      return {
        mayBeLess: options.mayBeLess === true,
        offset: options.offset ? options.offset : 0,
        length: options.length ? options.length : uint8Array.length - (options.offset ? options.offset : 0),
        position: options.position ? options.position : this.position
      };
    }
    return {
      mayBeLess: false,
      offset: 0,
      length: uint8Array.length,
      position: this.position
    };
  }
};
AbstractTokenizer$1.AbstractTokenizer = AbstractTokenizer;
Object.defineProperty(ReadStreamTokenizer$1, "__esModule", {
  value: true
});
ReadStreamTokenizer$1.ReadStreamTokenizer = void 0;
var AbstractTokenizer_1$1 = AbstractTokenizer$1;
var peek_readable_1$1 = lib;
var maxBufferSize = 256e3;
var ReadStreamTokenizer = class extends AbstractTokenizer_1$1.AbstractTokenizer {
  constructor(stream3, fileInfo) {
    super(fileInfo);
    this.streamReader = new peek_readable_1$1.StreamReader(stream3);
  }
  /**
   * Get file information, an HTTP-client may implement this doing a HEAD request
   * @return Promise with file information
   */
  async getFileInfo() {
    return this.fileInfo;
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
   * @param options - Read behaviour options
   * @returns Promise with number of bytes read
   */
  async readBuffer(uint8Array, options) {
    const normOptions = this.normalizeOptions(uint8Array, options);
    const skipBytes = normOptions.position - this.position;
    if (skipBytes > 0) {
      await this.ignore(skipBytes);
      return this.readBuffer(uint8Array, options);
    } else if (skipBytes < 0) {
      throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
    }
    if (normOptions.length === 0) {
      return 0;
    }
    const bytesRead = await this.streamReader.read(uint8Array, normOptions.offset, normOptions.length);
    this.position += bytesRead;
    if ((!options || !options.mayBeLess) && bytesRead < normOptions.length) {
      throw new peek_readable_1$1.EndOfStreamError();
    }
    return bytesRead;
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array - Uint8Array (or Buffer) to write data to
   * @param options - Read behaviour options
   * @returns Promise with number of bytes peeked
   */
  async peekBuffer(uint8Array, options) {
    const normOptions = this.normalizeOptions(uint8Array, options);
    let bytesRead = 0;
    if (normOptions.position) {
      const skipBytes = normOptions.position - this.position;
      if (skipBytes > 0) {
        const skipBuffer = new Uint8Array(normOptions.length + skipBytes);
        bytesRead = await this.peekBuffer(skipBuffer, {
          mayBeLess: normOptions.mayBeLess
        });
        uint8Array.set(skipBuffer.subarray(skipBytes), normOptions.offset);
        return bytesRead - skipBytes;
      } else if (skipBytes < 0) {
        throw new Error("Cannot peek from a negative offset in a stream");
      }
    }
    if (normOptions.length > 0) {
      try {
        bytesRead = await this.streamReader.peek(uint8Array, normOptions.offset, normOptions.length);
      } catch (err) {
        if (options && options.mayBeLess && err instanceof peek_readable_1$1.EndOfStreamError) {
          return 0;
        }
        throw err;
      }
      if (!normOptions.mayBeLess && bytesRead < normOptions.length) {
        throw new peek_readable_1$1.EndOfStreamError();
      }
    }
    return bytesRead;
  }
  async ignore(length) {
    const bufSize = Math.min(maxBufferSize, length);
    const buf = new Uint8Array(bufSize);
    let totBytesRead = 0;
    while (totBytesRead < length) {
      const remaining = length - totBytesRead;
      const bytesRead = await this.readBuffer(buf, {
        length: Math.min(bufSize, remaining)
      });
      if (bytesRead < 0) {
        return bytesRead;
      }
      totBytesRead += bytesRead;
    }
    return totBytesRead;
  }
};
ReadStreamTokenizer$1.ReadStreamTokenizer = ReadStreamTokenizer;
var BufferTokenizer$1 = {};
Object.defineProperty(BufferTokenizer$1, "__esModule", {
  value: true
});
BufferTokenizer$1.BufferTokenizer = void 0;
var peek_readable_1 = lib;
var AbstractTokenizer_1 = AbstractTokenizer$1;
var BufferTokenizer = class extends AbstractTokenizer_1.AbstractTokenizer {
  /**
   * Construct BufferTokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param fileInfo - Pass additional file information to the tokenizer
   */
  constructor(uint8Array, fileInfo) {
    super(fileInfo);
    this.uint8Array = uint8Array;
    this.fileInfo.size = this.fileInfo.size ? this.fileInfo.size : uint8Array.length;
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  async readBuffer(uint8Array, options) {
    if (options && options.position) {
      if (options.position < this.position) {
        throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
      }
      this.position = options.position;
    }
    const bytesRead = await this.peekBuffer(uint8Array, options);
    this.position += bytesRead;
    return bytesRead;
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  async peekBuffer(uint8Array, options) {
    const normOptions = this.normalizeOptions(uint8Array, options);
    const bytes2read = Math.min(this.uint8Array.length - normOptions.position, normOptions.length);
    if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
      throw new peek_readable_1.EndOfStreamError();
    } else {
      uint8Array.set(this.uint8Array.subarray(normOptions.position, normOptions.position + bytes2read), normOptions.offset);
      return bytes2read;
    }
  }
  async close() {
  }
};
BufferTokenizer$1.BufferTokenizer = BufferTokenizer;
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fromBuffer = exports.fromStream = exports.EndOfStreamError = void 0;
  const ReadStreamTokenizer_1 = ReadStreamTokenizer$1;
  const BufferTokenizer_1 = BufferTokenizer$1;
  var peek_readable_12 = lib;
  Object.defineProperty(exports, "EndOfStreamError", {
    enumerable: true,
    get: function() {
      return peek_readable_12.EndOfStreamError;
    }
  });
  function fromStream2(stream3, fileInfo) {
    fileInfo = fileInfo ? fileInfo : {};
    return new ReadStreamTokenizer_1.ReadStreamTokenizer(stream3, fileInfo);
  }
  exports.fromStream = fromStream2;
  function fromBuffer2(uint8Array, fileInfo) {
    return new BufferTokenizer_1.BufferTokenizer(uint8Array, fileInfo);
  }
  exports.fromBuffer = fromBuffer2;
})(core$1);
var util = {};
util.stringToBytes = (string) => [...string].map((character) => character.charCodeAt(0));
util.tarHeaderChecksumMatches = function(buffer) {
  let offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  const readSum = parseInt(buffer.toString("utf8", 148, 154).replace(/\0.*$/, "").trim(), 8);
  if (isNaN(readSum)) {
    return false;
  }
  let sum = 8 * 32;
  for (let i = offset; i < offset + 148; i++) {
    sum += buffer[i];
  }
  for (let i = offset + 156; i < offset + 512; i++) {
    sum += buffer[i];
  }
  return readSum === sum;
};
util.uint32SyncSafeToken = {
  get: (buffer, offset) => {
    return buffer[offset + 3] & 127 | buffer[offset + 2] << 7 | buffer[offset + 1] << 14 | buffer[offset] << 21;
  },
  len: 4
};
var supported$1 = {
  extensions: ["jpg", "png", "apng", "gif", "webp", "flif", "xcf", "cr2", "cr3", "orf", "arw", "dng", "nef", "rw2", "raf", "tif", "bmp", "icns", "jxr", "psd", "indd", "zip", "tar", "rar", "gz", "bz2", "7z", "dmg", "mp4", "mid", "mkv", "webm", "mov", "avi", "mpg", "mp2", "mp3", "m4a", "oga", "ogg", "ogv", "opus", "flac", "wav", "spx", "amr", "pdf", "epub", "exe", "swf", "rtf", "wasm", "woff", "woff2", "eot", "ttf", "otf", "ico", "flv", "ps", "xz", "sqlite", "nes", "crx", "xpi", "cab", "deb", "ar", "rpm", "Z", "lz", "cfb", "mxf", "mts", "blend", "bpg", "docx", "pptx", "xlsx", "3gp", "3g2", "jp2", "jpm", "jpx", "mj2", "aif", "qcp", "odt", "ods", "odp", "xml", "mobi", "heic", "cur", "ktx", "ape", "wv", "dcm", "ics", "glb", "pcap", "dsf", "lnk", "alias", "voc", "ac3", "m4v", "m4p", "m4b", "f4v", "f4p", "f4b", "f4a", "mie", "asf", "ogm", "ogx", "mpc", "arrow", "shp", "aac", "mp1", "it", "s3m", "xm", "ai", "skp", "avif", "eps", "lzh", "pgp", "asar", "stl", "chm", "3mf", "zst", "jxl", "vcf"],
  mimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/flif",
    "image/x-xcf",
    "image/x-canon-cr2",
    "image/x-canon-cr3",
    "image/tiff",
    "image/bmp",
    "image/vnd.ms-photo",
    "image/vnd.adobe.photoshop",
    "application/x-indesign",
    "application/epub+zip",
    "application/x-xpinstall",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "application/x-tar",
    "application/x-rar-compressed",
    "application/gzip",
    "application/x-bzip2",
    "application/x-7z-compressed",
    "application/x-apple-diskimage",
    "application/x-apache-arrow",
    "video/mp4",
    "audio/midi",
    "video/x-matroska",
    "video/webm",
    "video/quicktime",
    "video/vnd.avi",
    "audio/vnd.wave",
    "audio/qcelp",
    "audio/x-ms-asf",
    "video/x-ms-asf",
    "application/vnd.ms-asf",
    "video/mpeg",
    "video/3gpp",
    "audio/mpeg",
    "audio/mp4",
    // RFC 4337
    "audio/opus",
    "video/ogg",
    "audio/ogg",
    "application/ogg",
    "audio/x-flac",
    "audio/ape",
    "audio/wavpack",
    "audio/amr",
    "application/pdf",
    "application/x-msdownload",
    "application/x-shockwave-flash",
    "application/rtf",
    "application/wasm",
    "font/woff",
    "font/woff2",
    "application/vnd.ms-fontobject",
    "font/ttf",
    "font/otf",
    "image/x-icon",
    "video/x-flv",
    "application/postscript",
    "application/eps",
    "application/x-xz",
    "application/x-sqlite3",
    "application/x-nintendo-nes-rom",
    "application/x-google-chrome-extension",
    "application/vnd.ms-cab-compressed",
    "application/x-deb",
    "application/x-unix-archive",
    "application/x-rpm",
    "application/x-compress",
    "application/x-lzip",
    "application/x-cfb",
    "application/x-mie",
    "application/mxf",
    "video/mp2t",
    "application/x-blender",
    "image/bpg",
    "image/jp2",
    "image/jpx",
    "image/jpm",
    "image/mj2",
    "audio/aiff",
    "application/xml",
    "application/x-mobipocket-ebook",
    "image/heif",
    "image/heif-sequence",
    "image/heic",
    "image/heic-sequence",
    "image/icns",
    "image/ktx",
    "application/dicom",
    "audio/x-musepack",
    "text/calendar",
    "text/vcard",
    "model/gltf-binary",
    "application/vnd.tcpdump.pcap",
    "audio/x-dsf",
    // Non-standard
    "application/x.ms.shortcut",
    // Invented by us
    "application/x.apple.alias",
    // Invented by us
    "audio/x-voc",
    "audio/vnd.dolby.dd-raw",
    "audio/x-m4a",
    "image/apng",
    "image/x-olympus-orf",
    "image/x-sony-arw",
    "image/x-adobe-dng",
    "image/x-nikon-nef",
    "image/x-panasonic-rw2",
    "image/x-fujifilm-raf",
    "video/x-m4v",
    "video/3gpp2",
    "application/x-esri-shape",
    "audio/aac",
    "audio/x-it",
    "audio/x-s3m",
    "audio/x-xm",
    "video/MP1S",
    "video/MP2P",
    "application/vnd.sketchup.skp",
    "image/avif",
    "application/x-lzh-compressed",
    "application/pgp-encrypted",
    "application/x-asar",
    "model/stl",
    "application/vnd.ms-htmlhelp",
    "model/3mf",
    "image/jxl",
    "application/zstd"
  ]
};
var Token = lib$1;
var strtok3 = core$1;
var {
  stringToBytes,
  tarHeaderChecksumMatches,
  uint32SyncSafeToken
} = util;
var supported = supported$1;
var minimumBytes = 4100;
async function fromStream(stream3) {
  const tokenizer = await strtok3.fromStream(stream3);
  try {
    return await fromTokenizer(tokenizer);
  } finally {
    await tokenizer.close();
  }
}
async function fromBuffer(input) {
  if (!(input instanceof Uint8Array || input instanceof ArrayBuffer || Buffer.isBuffer(input))) {
    throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof input}\``);
  }
  const buffer = input instanceof Buffer ? input : Buffer.from(input);
  if (!(buffer && buffer.length > 1)) {
    return;
  }
  const tokenizer = strtok3.fromBuffer(buffer);
  return fromTokenizer(tokenizer);
}
function _check(buffer, headers, options) {
  options = {
    offset: 0,
    ...options
  };
  for (const [index, header] of headers.entries()) {
    if (options.mask) {
      if (header !== (options.mask[index] & buffer[index + options.offset])) {
        return false;
      }
    } else if (header !== buffer[index + options.offset]) {
      return false;
    }
  }
  return true;
}
async function fromTokenizer(tokenizer) {
  try {
    return _fromTokenizer(tokenizer);
  } catch (error) {
    if (!(error instanceof strtok3.EndOfStreamError)) {
      throw error;
    }
  }
}
async function _fromTokenizer(tokenizer) {
  let buffer = Buffer.alloc(minimumBytes);
  const bytesRead = 12;
  const check = (header, options) => _check(buffer, header, options);
  const checkString = (header, options) => check(stringToBytes(header), options);
  if (!tokenizer.fileInfo.size) {
    tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
  }
  await tokenizer.peekBuffer(buffer, {
    length: bytesRead,
    mayBeLess: true
  });
  if (check([66, 77])) {
    return {
      ext: "bmp",
      mime: "image/bmp"
    };
  }
  if (check([11, 119])) {
    return {
      ext: "ac3",
      mime: "audio/vnd.dolby.dd-raw"
    };
  }
  if (check([120, 1])) {
    return {
      ext: "dmg",
      mime: "application/x-apple-diskimage"
    };
  }
  if (check([77, 90])) {
    return {
      ext: "exe",
      mime: "application/x-msdownload"
    };
  }
  if (check([37, 33])) {
    await tokenizer.peekBuffer(buffer, {
      length: 24,
      mayBeLess: true
    });
    if (checkString("PS-Adobe-", {
      offset: 2
    }) && checkString(" EPSF-", {
      offset: 14
    })) {
      return {
        ext: "eps",
        mime: "application/eps"
      };
    }
    return {
      ext: "ps",
      mime: "application/postscript"
    };
  }
  if (check([31, 160]) || check([31, 157])) {
    return {
      ext: "Z",
      mime: "application/x-compress"
    };
  }
  if (check([255, 216, 255])) {
    return {
      ext: "jpg",
      mime: "image/jpeg"
    };
  }
  if (check([73, 73, 188])) {
    return {
      ext: "jxr",
      mime: "image/vnd.ms-photo"
    };
  }
  if (check([31, 139, 8])) {
    return {
      ext: "gz",
      mime: "application/gzip"
    };
  }
  if (check([66, 90, 104])) {
    return {
      ext: "bz2",
      mime: "application/x-bzip2"
    };
  }
  if (checkString("ID3")) {
    await tokenizer.ignore(6);
    const id3HeaderLen = await tokenizer.readToken(uint32SyncSafeToken);
    if (tokenizer.position + id3HeaderLen > tokenizer.fileInfo.size) {
      return {
        ext: "mp3",
        mime: "audio/mpeg"
      };
    }
    await tokenizer.ignore(id3HeaderLen);
    return fromTokenizer(tokenizer);
  }
  if (checkString("MP+")) {
    return {
      ext: "mpc",
      mime: "audio/x-musepack"
    };
  }
  if ((buffer[0] === 67 || buffer[0] === 70) && check([87, 83], {
    offset: 1
  })) {
    return {
      ext: "swf",
      mime: "application/x-shockwave-flash"
    };
  }
  if (check([71, 73, 70])) {
    return {
      ext: "gif",
      mime: "image/gif"
    };
  }
  if (checkString("FLIF")) {
    return {
      ext: "flif",
      mime: "image/flif"
    };
  }
  if (checkString("8BPS")) {
    return {
      ext: "psd",
      mime: "image/vnd.adobe.photoshop"
    };
  }
  if (checkString("WEBP", {
    offset: 8
  })) {
    return {
      ext: "webp",
      mime: "image/webp"
    };
  }
  if (checkString("MPCK")) {
    return {
      ext: "mpc",
      mime: "audio/x-musepack"
    };
  }
  if (checkString("FORM")) {
    return {
      ext: "aif",
      mime: "audio/aiff"
    };
  }
  if (checkString("icns", {
    offset: 0
  })) {
    return {
      ext: "icns",
      mime: "image/icns"
    };
  }
  if (check([80, 75, 3, 4])) {
    try {
      while (tokenizer.position + 30 < tokenizer.fileInfo.size) {
        await tokenizer.readBuffer(buffer, {
          length: 30
        });
        const zipHeader = {
          compressedSize: buffer.readUInt32LE(18),
          uncompressedSize: buffer.readUInt32LE(22),
          filenameLength: buffer.readUInt16LE(26),
          extraFieldLength: buffer.readUInt16LE(28)
        };
        zipHeader.filename = await tokenizer.readToken(new Token.StringType(zipHeader.filenameLength, "utf-8"));
        await tokenizer.ignore(zipHeader.extraFieldLength);
        if (zipHeader.filename === "META-INF/mozilla.rsa") {
          return {
            ext: "xpi",
            mime: "application/x-xpinstall"
          };
        }
        if (zipHeader.filename.endsWith(".rels") || zipHeader.filename.endsWith(".xml")) {
          const type = zipHeader.filename.split("/")[0];
          switch (type) {
            case "_rels":
              break;
            case "word":
              return {
                ext: "docx",
                mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              };
            case "ppt":
              return {
                ext: "pptx",
                mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              };
            case "xl":
              return {
                ext: "xlsx",
                mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              };
            default:
              break;
          }
        }
        if (zipHeader.filename.startsWith("xl/")) {
          return {
            ext: "xlsx",
            mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          };
        }
        if (zipHeader.filename.startsWith("3D/") && zipHeader.filename.endsWith(".model")) {
          return {
            ext: "3mf",
            mime: "model/3mf"
          };
        }
        if (zipHeader.filename === "mimetype" && zipHeader.compressedSize === zipHeader.uncompressedSize) {
          const mimeType = await tokenizer.readToken(new Token.StringType(zipHeader.compressedSize, "utf-8"));
          switch (mimeType) {
            case "application/epub+zip":
              return {
                ext: "epub",
                mime: "application/epub+zip"
              };
            case "application/vnd.oasis.opendocument.text":
              return {
                ext: "odt",
                mime: "application/vnd.oasis.opendocument.text"
              };
            case "application/vnd.oasis.opendocument.spreadsheet":
              return {
                ext: "ods",
                mime: "application/vnd.oasis.opendocument.spreadsheet"
              };
            case "application/vnd.oasis.opendocument.presentation":
              return {
                ext: "odp",
                mime: "application/vnd.oasis.opendocument.presentation"
              };
            default:
          }
        }
        if (zipHeader.compressedSize === 0) {
          let nextHeaderIndex = -1;
          while (nextHeaderIndex < 0 && tokenizer.position < tokenizer.fileInfo.size) {
            await tokenizer.peekBuffer(buffer, {
              mayBeLess: true
            });
            nextHeaderIndex = buffer.indexOf("504B0304", 0, "hex");
            await tokenizer.ignore(nextHeaderIndex >= 0 ? nextHeaderIndex : buffer.length);
          }
        } else {
          await tokenizer.ignore(zipHeader.compressedSize);
        }
      }
    } catch (error) {
      if (!(error instanceof strtok3.EndOfStreamError)) {
        throw error;
      }
    }
    return {
      ext: "zip",
      mime: "application/zip"
    };
  }
  if (checkString("OggS")) {
    await tokenizer.ignore(28);
    const type = Buffer.alloc(8);
    await tokenizer.readBuffer(type);
    if (_check(type, [79, 112, 117, 115, 72, 101, 97, 100])) {
      return {
        ext: "opus",
        mime: "audio/opus"
      };
    }
    if (_check(type, [128, 116, 104, 101, 111, 114, 97])) {
      return {
        ext: "ogv",
        mime: "video/ogg"
      };
    }
    if (_check(type, [1, 118, 105, 100, 101, 111, 0])) {
      return {
        ext: "ogm",
        mime: "video/ogg"
      };
    }
    if (_check(type, [127, 70, 76, 65, 67])) {
      return {
        ext: "oga",
        mime: "audio/ogg"
      };
    }
    if (_check(type, [83, 112, 101, 101, 120, 32, 32])) {
      return {
        ext: "spx",
        mime: "audio/ogg"
      };
    }
    if (_check(type, [1, 118, 111, 114, 98, 105, 115])) {
      return {
        ext: "ogg",
        mime: "audio/ogg"
      };
    }
    return {
      ext: "ogx",
      mime: "application/ogg"
    };
  }
  if (check([80, 75]) && (buffer[2] === 3 || buffer[2] === 5 || buffer[2] === 7) && (buffer[3] === 4 || buffer[3] === 6 || buffer[3] === 8)) {
    return {
      ext: "zip",
      mime: "application/zip"
    };
  }
  if (checkString("ftyp", {
    offset: 4
  }) && (buffer[8] & 96) !== 0) {
    const brandMajor = buffer.toString("binary", 8, 12).replace("\0", " ").trim();
    switch (brandMajor) {
      case "avif":
        return {
          ext: "avif",
          mime: "image/avif"
        };
      case "mif1":
        return {
          ext: "heic",
          mime: "image/heif"
        };
      case "msf1":
        return {
          ext: "heic",
          mime: "image/heif-sequence"
        };
      case "heic":
      case "heix":
        return {
          ext: "heic",
          mime: "image/heic"
        };
      case "hevc":
      case "hevx":
        return {
          ext: "heic",
          mime: "image/heic-sequence"
        };
      case "qt":
        return {
          ext: "mov",
          mime: "video/quicktime"
        };
      case "M4V":
      case "M4VH":
      case "M4VP":
        return {
          ext: "m4v",
          mime: "video/x-m4v"
        };
      case "M4P":
        return {
          ext: "m4p",
          mime: "video/mp4"
        };
      case "M4B":
        return {
          ext: "m4b",
          mime: "audio/mp4"
        };
      case "M4A":
        return {
          ext: "m4a",
          mime: "audio/x-m4a"
        };
      case "F4V":
        return {
          ext: "f4v",
          mime: "video/mp4"
        };
      case "F4P":
        return {
          ext: "f4p",
          mime: "video/mp4"
        };
      case "F4A":
        return {
          ext: "f4a",
          mime: "audio/mp4"
        };
      case "F4B":
        return {
          ext: "f4b",
          mime: "audio/mp4"
        };
      case "crx":
        return {
          ext: "cr3",
          mime: "image/x-canon-cr3"
        };
      default:
        if (brandMajor.startsWith("3g")) {
          if (brandMajor.startsWith("3g2")) {
            return {
              ext: "3g2",
              mime: "video/3gpp2"
            };
          }
          return {
            ext: "3gp",
            mime: "video/3gpp"
          };
        }
        return {
          ext: "mp4",
          mime: "video/mp4"
        };
    }
  }
  if (checkString("MThd")) {
    return {
      ext: "mid",
      mime: "audio/midi"
    };
  }
  if (checkString("wOFF") && (check([0, 1, 0, 0], {
    offset: 4
  }) || checkString("OTTO", {
    offset: 4
  }))) {
    return {
      ext: "woff",
      mime: "font/woff"
    };
  }
  if (checkString("wOF2") && (check([0, 1, 0, 0], {
    offset: 4
  }) || checkString("OTTO", {
    offset: 4
  }))) {
    return {
      ext: "woff2",
      mime: "font/woff2"
    };
  }
  if (check([212, 195, 178, 161]) || check([161, 178, 195, 212])) {
    return {
      ext: "pcap",
      mime: "application/vnd.tcpdump.pcap"
    };
  }
  if (checkString("DSD ")) {
    return {
      ext: "dsf",
      mime: "audio/x-dsf"
      // Non-standard
    };
  }
  if (checkString("LZIP")) {
    return {
      ext: "lz",
      mime: "application/x-lzip"
    };
  }
  if (checkString("fLaC")) {
    return {
      ext: "flac",
      mime: "audio/x-flac"
    };
  }
  if (check([66, 80, 71, 251])) {
    return {
      ext: "bpg",
      mime: "image/bpg"
    };
  }
  if (checkString("wvpk")) {
    return {
      ext: "wv",
      mime: "audio/wavpack"
    };
  }
  if (checkString("%PDF")) {
    await tokenizer.ignore(1350);
    const maxBufferSize2 = 10 * 1024 * 1024;
    const buffer2 = Buffer.alloc(Math.min(maxBufferSize2, tokenizer.fileInfo.size));
    await tokenizer.readBuffer(buffer2, {
      mayBeLess: true
    });
    if (buffer2.includes(Buffer.from("AIPrivateData"))) {
      return {
        ext: "ai",
        mime: "application/postscript"
      };
    }
    return {
      ext: "pdf",
      mime: "application/pdf"
    };
  }
  if (check([0, 97, 115, 109])) {
    return {
      ext: "wasm",
      mime: "application/wasm"
    };
  }
  if (check([73, 73, 42, 0])) {
    if (checkString("CR", {
      offset: 8
    })) {
      return {
        ext: "cr2",
        mime: "image/x-canon-cr2"
      };
    }
    if (check([28, 0, 254, 0], {
      offset: 8
    }) || check([31, 0, 11, 0], {
      offset: 8
    })) {
      return {
        ext: "nef",
        mime: "image/x-nikon-nef"
      };
    }
    if (check([8, 0, 0, 0], {
      offset: 4
    }) && (check([45, 0, 254, 0], {
      offset: 8
    }) || check([39, 0, 254, 0], {
      offset: 8
    }))) {
      return {
        ext: "dng",
        mime: "image/x-adobe-dng"
      };
    }
    buffer = Buffer.alloc(24);
    await tokenizer.peekBuffer(buffer);
    if ((check([16, 251, 134, 1], {
      offset: 4
    }) || check([8, 0, 0, 0], {
      offset: 4
    })) && // This pattern differentiates ARW from other TIFF-ish file types:
    check([0, 254, 0, 4, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1], {
      offset: 9
    })) {
      return {
        ext: "arw",
        mime: "image/x-sony-arw"
      };
    }
    return {
      ext: "tif",
      mime: "image/tiff"
    };
  }
  if (check([77, 77, 0, 42])) {
    return {
      ext: "tif",
      mime: "image/tiff"
    };
  }
  if (checkString("MAC ")) {
    return {
      ext: "ape",
      mime: "audio/ape"
    };
  }
  if (check([26, 69, 223, 163])) {
    async function readField() {
      const msb = await tokenizer.peekNumber(Token.UINT8);
      let mask = 128;
      let ic = 0;
      while ((msb & mask) === 0) {
        ++ic;
        mask >>= 1;
      }
      const id = Buffer.alloc(ic + 1);
      await tokenizer.readBuffer(id);
      return id;
    }
    async function readElement() {
      const id = await readField();
      const lenField = await readField();
      lenField[0] ^= 128 >> lenField.length - 1;
      const nrLen = Math.min(6, lenField.length);
      return {
        id: id.readUIntBE(0, id.length),
        len: lenField.readUIntBE(lenField.length - nrLen, nrLen)
      };
    }
    async function readChildren(level, children) {
      while (children > 0) {
        const e = await readElement();
        if (e.id === 17026) {
          return tokenizer.readToken(new Token.StringType(e.len, "utf-8"));
        }
        await tokenizer.ignore(e.len);
        --children;
      }
    }
    const re = await readElement();
    const docType = await readChildren(1, re.len);
    switch (docType) {
      case "webm":
        return {
          ext: "webm",
          mime: "video/webm"
        };
      case "matroska":
        return {
          ext: "mkv",
          mime: "video/x-matroska"
        };
      default:
        return;
    }
  }
  if (check([82, 73, 70, 70])) {
    if (check([65, 86, 73], {
      offset: 8
    })) {
      return {
        ext: "avi",
        mime: "video/vnd.avi"
      };
    }
    if (check([87, 65, 86, 69], {
      offset: 8
    })) {
      return {
        ext: "wav",
        mime: "audio/vnd.wave"
      };
    }
    if (check([81, 76, 67, 77], {
      offset: 8
    })) {
      return {
        ext: "qcp",
        mime: "audio/qcelp"
      };
    }
  }
  if (checkString("SQLi")) {
    return {
      ext: "sqlite",
      mime: "application/x-sqlite3"
    };
  }
  if (check([78, 69, 83, 26])) {
    return {
      ext: "nes",
      mime: "application/x-nintendo-nes-rom"
    };
  }
  if (checkString("Cr24")) {
    return {
      ext: "crx",
      mime: "application/x-google-chrome-extension"
    };
  }
  if (checkString("MSCF") || checkString("ISc(")) {
    return {
      ext: "cab",
      mime: "application/vnd.ms-cab-compressed"
    };
  }
  if (check([237, 171, 238, 219])) {
    return {
      ext: "rpm",
      mime: "application/x-rpm"
    };
  }
  if (check([197, 208, 211, 198])) {
    return {
      ext: "eps",
      mime: "application/eps"
    };
  }
  if (check([40, 181, 47, 253])) {
    return {
      ext: "zst",
      mime: "application/zstd"
    };
  }
  if (check([79, 84, 84, 79, 0])) {
    return {
      ext: "otf",
      mime: "font/otf"
    };
  }
  if (checkString("#!AMR")) {
    return {
      ext: "amr",
      mime: "audio/amr"
    };
  }
  if (checkString("{\\rtf")) {
    return {
      ext: "rtf",
      mime: "application/rtf"
    };
  }
  if (check([70, 76, 86, 1])) {
    return {
      ext: "flv",
      mime: "video/x-flv"
    };
  }
  if (checkString("IMPM")) {
    return {
      ext: "it",
      mime: "audio/x-it"
    };
  }
  if (checkString("-lh0-", {
    offset: 2
  }) || checkString("-lh1-", {
    offset: 2
  }) || checkString("-lh2-", {
    offset: 2
  }) || checkString("-lh3-", {
    offset: 2
  }) || checkString("-lh4-", {
    offset: 2
  }) || checkString("-lh5-", {
    offset: 2
  }) || checkString("-lh6-", {
    offset: 2
  }) || checkString("-lh7-", {
    offset: 2
  }) || checkString("-lzs-", {
    offset: 2
  }) || checkString("-lz4-", {
    offset: 2
  }) || checkString("-lz5-", {
    offset: 2
  }) || checkString("-lhd-", {
    offset: 2
  })) {
    return {
      ext: "lzh",
      mime: "application/x-lzh-compressed"
    };
  }
  if (check([0, 0, 1, 186])) {
    if (check([33], {
      offset: 4,
      mask: [241]
    })) {
      return {
        ext: "mpg",
        // May also be .ps, .mpeg
        mime: "video/MP1S"
      };
    }
    if (check([68], {
      offset: 4,
      mask: [196]
    })) {
      return {
        ext: "mpg",
        // May also be .mpg, .m2p, .vob or .sub
        mime: "video/MP2P"
      };
    }
  }
  if (checkString("ITSF")) {
    return {
      ext: "chm",
      mime: "application/vnd.ms-htmlhelp"
    };
  }
  if (check([253, 55, 122, 88, 90, 0])) {
    return {
      ext: "xz",
      mime: "application/x-xz"
    };
  }
  if (checkString("<?xml ")) {
    return {
      ext: "xml",
      mime: "application/xml"
    };
  }
  if (check([55, 122, 188, 175, 39, 28])) {
    return {
      ext: "7z",
      mime: "application/x-7z-compressed"
    };
  }
  if (check([82, 97, 114, 33, 26, 7]) && (buffer[6] === 0 || buffer[6] === 1)) {
    return {
      ext: "rar",
      mime: "application/x-rar-compressed"
    };
  }
  if (checkString("solid ")) {
    return {
      ext: "stl",
      mime: "model/stl"
    };
  }
  if (checkString("BLENDER")) {
    return {
      ext: "blend",
      mime: "application/x-blender"
    };
  }
  if (checkString("!<arch>")) {
    await tokenizer.ignore(8);
    const str = await tokenizer.readToken(new Token.StringType(13, "ascii"));
    if (str === "debian-binary") {
      return {
        ext: "deb",
        mime: "application/x-deb"
      };
    }
    return {
      ext: "ar",
      mime: "application/x-unix-archive"
    };
  }
  if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
    await tokenizer.ignore(8);
    async function readChunkHeader() {
      return {
        length: await tokenizer.readToken(Token.INT32_BE),
        type: await tokenizer.readToken(new Token.StringType(4, "binary"))
      };
    }
    do {
      const chunk = await readChunkHeader();
      if (chunk.length < 0) {
        return;
      }
      switch (chunk.type) {
        case "IDAT":
          return {
            ext: "png",
            mime: "image/png"
          };
        case "acTL":
          return {
            ext: "apng",
            mime: "image/apng"
          };
        default:
          await tokenizer.ignore(chunk.length + 4);
      }
    } while (tokenizer.position + 8 < tokenizer.fileInfo.size);
    return {
      ext: "png",
      mime: "image/png"
    };
  }
  if (check([65, 82, 82, 79, 87, 49, 0, 0])) {
    return {
      ext: "arrow",
      mime: "application/x-apache-arrow"
    };
  }
  if (check([103, 108, 84, 70, 2, 0, 0, 0])) {
    return {
      ext: "glb",
      mime: "model/gltf-binary"
    };
  }
  if (check([102, 114, 101, 101], {
    offset: 4
  }) || // `free`
  check([109, 100, 97, 116], {
    offset: 4
  }) || // `mdat` MJPEG
  check([109, 111, 111, 118], {
    offset: 4
  }) || // `moov`
  check([119, 105, 100, 101], {
    offset: 4
  })) {
    return {
      ext: "mov",
      mime: "video/quicktime"
    };
  }
  if (check([73, 73, 82, 79, 8, 0, 0, 0, 24])) {
    return {
      ext: "orf",
      mime: "image/x-olympus-orf"
    };
  }
  if (checkString("gimp xcf ")) {
    return {
      ext: "xcf",
      mime: "image/x-xcf"
    };
  }
  if (check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) {
    return {
      ext: "rw2",
      mime: "image/x-panasonic-rw2"
    };
  }
  if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
    async function readHeader() {
      const guid = Buffer.alloc(16);
      await tokenizer.readBuffer(guid);
      return {
        id: guid,
        size: Number(await tokenizer.readToken(Token.UINT64_LE))
      };
    }
    await tokenizer.ignore(30);
    while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
      const header = await readHeader();
      let payload = header.size - 24;
      if (_check(header.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
        const typeId = Buffer.alloc(16);
        payload -= await tokenizer.readBuffer(typeId);
        if (_check(typeId, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
          return {
            ext: "asf",
            mime: "audio/x-ms-asf"
          };
        }
        if (_check(typeId, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
          return {
            ext: "asf",
            mime: "video/x-ms-asf"
          };
        }
        break;
      }
      await tokenizer.ignore(payload);
    }
    return {
      ext: "asf",
      mime: "application/vnd.ms-asf"
    };
  }
  if (check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
    return {
      ext: "ktx",
      mime: "image/ktx"
    };
  }
  if ((check([126, 16, 4]) || check([126, 24, 4])) && check([48, 77, 73, 69], {
    offset: 4
  })) {
    return {
      ext: "mie",
      mime: "application/x-mie"
    };
  }
  if (check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], {
    offset: 2
  })) {
    return {
      ext: "shp",
      mime: "application/x-esri-shape"
    };
  }
  if (check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
    await tokenizer.ignore(20);
    const type = await tokenizer.readToken(new Token.StringType(4, "ascii"));
    switch (type) {
      case "jp2 ":
        return {
          ext: "jp2",
          mime: "image/jp2"
        };
      case "jpx ":
        return {
          ext: "jpx",
          mime: "image/jpx"
        };
      case "jpm ":
        return {
          ext: "jpm",
          mime: "image/jpm"
        };
      case "mjp2":
        return {
          ext: "mj2",
          mime: "image/mj2"
        };
      default:
        return;
    }
  }
  if (check([255, 10]) || check([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10])) {
    return {
      ext: "jxl",
      mime: "image/jxl"
    };
  }
  if (check([0, 0, 1, 186]) || check([0, 0, 1, 179])) {
    return {
      ext: "mpg",
      mime: "video/mpeg"
    };
  }
  if (check([0, 1, 0, 0, 0])) {
    return {
      ext: "ttf",
      mime: "font/ttf"
    };
  }
  if (check([0, 0, 1, 0])) {
    return {
      ext: "ico",
      mime: "image/x-icon"
    };
  }
  if (check([0, 0, 2, 0])) {
    return {
      ext: "cur",
      mime: "image/x-icon"
    };
  }
  if (check([208, 207, 17, 224, 161, 177, 26, 225])) {
    return {
      ext: "cfb",
      mime: "application/x-cfb"
    };
  }
  await tokenizer.peekBuffer(buffer, {
    length: Math.min(256, tokenizer.fileInfo.size),
    mayBeLess: true
  });
  if (checkString("BEGIN:")) {
    if (checkString("VCARD", {
      offset: 6
    })) {
      return {
        ext: "vcf",
        mime: "text/vcard"
      };
    }
    if (checkString("VCALENDAR", {
      offset: 6
    })) {
      return {
        ext: "ics",
        mime: "text/calendar"
      };
    }
  }
  if (checkString("FUJIFILMCCD-RAW")) {
    return {
      ext: "raf",
      mime: "image/x-fujifilm-raf"
    };
  }
  if (checkString("Extended Module:")) {
    return {
      ext: "xm",
      mime: "audio/x-xm"
    };
  }
  if (checkString("Creative Voice File")) {
    return {
      ext: "voc",
      mime: "audio/x-voc"
    };
  }
  if (check([4, 0, 0, 0]) && buffer.length >= 16) {
    const jsonSize = buffer.readUInt32LE(12);
    if (jsonSize > 12 && buffer.length >= jsonSize + 16) {
      try {
        const header = buffer.slice(16, jsonSize + 16).toString();
        const json = JSON.parse(header);
        if (json.files) {
          return {
            ext: "asar",
            mime: "application/x-asar"
          };
        }
      } catch (_) {
      }
    }
  }
  if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
    return {
      ext: "mxf",
      mime: "application/mxf"
    };
  }
  if (checkString("SCRM", {
    offset: 44
  })) {
    return {
      ext: "s3m",
      mime: "audio/x-s3m"
    };
  }
  if (check([71], {
    offset: 4
  }) && (check([71], {
    offset: 192
  }) || check([71], {
    offset: 196
  }))) {
    return {
      ext: "mts",
      mime: "video/mp2t"
    };
  }
  if (check([66, 79, 79, 75, 77, 79, 66, 73], {
    offset: 60
  })) {
    return {
      ext: "mobi",
      mime: "application/x-mobipocket-ebook"
    };
  }
  if (check([68, 73, 67, 77], {
    offset: 128
  })) {
    return {
      ext: "dcm",
      mime: "application/dicom"
    };
  }
  if (check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) {
    return {
      ext: "lnk",
      mime: "application/x.ms.shortcut"
      // Invented by us
    };
  }
  if (check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) {
    return {
      ext: "alias",
      mime: "application/x.apple.alias"
      // Invented by us
    };
  }
  if (check([76, 80], {
    offset: 34
  }) && (check([0, 0, 1], {
    offset: 8
  }) || check([1, 0, 2], {
    offset: 8
  }) || check([2, 0, 2], {
    offset: 8
  }))) {
    return {
      ext: "eot",
      mime: "application/vnd.ms-fontobject"
    };
  }
  if (check([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29])) {
    return {
      ext: "indd",
      mime: "application/x-indesign"
    };
  }
  await tokenizer.peekBuffer(buffer, {
    length: Math.min(512, tokenizer.fileInfo.size),
    mayBeLess: true
  });
  if (tarHeaderChecksumMatches(buffer)) {
    return {
      ext: "tar",
      mime: "application/x-tar"
    };
  }
  if (check([255, 254, 255, 14, 83, 0, 107, 0, 101, 0, 116, 0, 99, 0, 104, 0, 85, 0, 112, 0, 32, 0, 77, 0, 111, 0, 100, 0, 101, 0, 108, 0])) {
    return {
      ext: "skp",
      mime: "application/vnd.sketchup.skp"
    };
  }
  if (checkString("-----BEGIN PGP MESSAGE-----")) {
    return {
      ext: "pgp",
      mime: "application/pgp-encrypted"
    };
  }
  if (buffer.length >= 2 && check([255, 224], {
    offset: 0,
    mask: [255, 224]
  })) {
    if (check([16], {
      offset: 1,
      mask: [22]
    })) {
      if (check([8], {
        offset: 1,
        mask: [8]
      })) {
        return {
          ext: "aac",
          mime: "audio/aac"
        };
      }
      return {
        ext: "aac",
        mime: "audio/aac"
      };
    }
    if (check([2], {
      offset: 1,
      mask: [6]
    })) {
      return {
        ext: "mp3",
        mime: "audio/mpeg"
      };
    }
    if (check([4], {
      offset: 1,
      mask: [6]
    })) {
      return {
        ext: "mp2",
        mime: "audio/mpeg"
      };
    }
    if (check([6], {
      offset: 1,
      mask: [6]
    })) {
      return {
        ext: "mp1",
        mime: "audio/mpeg"
      };
    }
  }
}
var stream2 = (readableStream) => new Promise((resolve, reject) => {
  const stream = eval("require")("stream");
  readableStream.on("error", reject);
  readableStream.once("readable", async () => {
    const pass = new stream.PassThrough();
    let outputStream;
    if (stream.pipeline) {
      outputStream = stream.pipeline(readableStream, pass, () => {
      });
    } else {
      outputStream = readableStream.pipe(pass);
    }
    const chunk = readableStream.read(minimumBytes) || readableStream.read() || Buffer.alloc(0);
    try {
      const fileType2 = await fromBuffer(chunk);
      pass.fileType = fileType2;
    } catch (error) {
      reject(error);
    }
    resolve(outputStream);
  });
});
var fileType = {
  fromStream,
  fromTokenizer,
  fromBuffer,
  stream: stream2
};
Object.defineProperty(fileType, "extensions", {
  get() {
    return new Set(supported.extensions);
  }
});
Object.defineProperty(fileType, "mimeTypes", {
  get() {
    return new Set(supported.mimeTypes);
  }
});
var core = fileType;
(function(module) {
  const {
    ReadableWebToNodeStream: ReadableWebToNodeStream2
  } = lib$2;
  const core$12 = core;
  async function fromStream2(stream3) {
    const readableWebToNodeStream = new ReadableWebToNodeStream2(stream3);
    const fileType2 = await core$12.fromStream(readableWebToNodeStream);
    await readableWebToNodeStream.close();
    return fileType2;
  }
  async function fromBlob(blob) {
    const buffer = await blobToArrayBuffer(blob);
    return core$12.fromBuffer(Buffer.from(buffer));
  }
  function blobToArrayBuffer(blob) {
    if (blob.arrayBuffer) {
      return blob.arrayBuffer();
    }
    return new Promise((resolve2, reject2) => {
      const fileReader = new FileReader();
      fileReader.addEventListener("loadend", (event) => {
        resolve2(event.target.result);
      });
      fileReader.addEventListener("error", (event) => {
        reject2(new Error(event.message));
      });
      fileReader.addEventListener("abort", (event) => {
        reject2(new Error(event.type));
      });
      fileReader.readAsArrayBuffer(blob);
    });
  }
  Object.assign(module.exports, core$12, {
    fromStream: fromStream2,
    fromBlob
  });
})(browser$2);
var browser = browser$2.exports;
var browser$1 = _mergeNamespaces({
  __proto__: null,
  "default": browser
}, [browser$2.exports]);
export {
  browser$1 as b
};
/*! Bundled license information:

@audius/sdk/dist/browser-15461226.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
//# sourceMappingURL=browser-15461226-DXIDQPVQ.js.map
