import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import { useState, useLayoutEffect, useEffect, forwardRef, useRef, useImperativeHandle, useCallback } from "react";
import * as state from "@codemirror/state";
import { EditorState, Annotation, StateEffect } from "@codemirror/state";
export * from "@codemirror/state";
import * as view from "@codemirror/view";
import { EditorView, keymap, placeholder } from "@codemirror/view";
export * from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import * as codemirrorExtensionsBasicSetup from "@uiw/codemirror-extensions-basic-setup";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
export * from "@uiw/codemirror-extensions-basic-setup";
import { oneDark } from "@codemirror/theme-one-dark";
export * from "@codemirror/theme-one-dark";
import { jsx } from "react/jsx-runtime";
var defaultLightThemeOption = EditorView.theme({
  "&": {
    backgroundColor: "#fff"
  }
}, {
  dark: false
});
var getDefaultExtensions = function getDefaultExtensions2(optios) {
  if (optios === void 0) {
    optios = {};
  }
  var {
    indentWithTab: defaultIndentWithTab = true,
    editable = true,
    readOnly = false,
    theme = "light",
    placeholder: placeholderStr = "",
    basicSetup: defaultBasicSetup = true
  } = optios;
  var getExtensions = [];
  if (defaultIndentWithTab) {
    getExtensions.unshift(keymap.of([indentWithTab]));
  }
  if (defaultBasicSetup) {
    if (typeof defaultBasicSetup === "boolean") {
      getExtensions.unshift(basicSetup());
    } else {
      getExtensions.unshift(basicSetup(defaultBasicSetup));
    }
  }
  if (placeholderStr) {
    getExtensions.unshift(placeholder(placeholderStr));
  }
  switch (theme) {
    case "light":
      getExtensions.push(defaultLightThemeOption);
      break;
    case "dark":
      getExtensions.push(oneDark);
      break;
    case "none":
      break;
    default:
      getExtensions.push(theme);
      break;
  }
  if (editable === false) {
    getExtensions.push(EditorView.editable.of(false));
  }
  if (readOnly) {
    getExtensions.push(EditorState.readOnly.of(true));
  }
  return [...getExtensions];
};
var getStatistics = (view2) => {
  return {
    line: view2.state.doc.lineAt(view2.state.selection.main.from),
    lineCount: view2.state.doc.lines,
    lineBreak: view2.state.lineBreak,
    length: view2.state.doc.length,
    readOnly: view2.state.readOnly,
    tabSize: view2.state.tabSize,
    selection: view2.state.selection,
    selectionAsSingle: view2.state.selection.asSingle().main,
    ranges: view2.state.selection.ranges,
    selectionCode: view2.state.sliceDoc(view2.state.selection.main.from, view2.state.selection.main.to),
    selections: view2.state.selection.ranges.map((r) => view2.state.sliceDoc(r.from, r.to)),
    selectedText: view2.state.selection.ranges.some((r) => !r.empty)
  };
};
class TimeoutLatch {
  constructor(callback, timeoutMS) {
    this.timeLeftMS = void 0;
    this.timeoutMS = void 0;
    this.isCancelled = false;
    this.isTimeExhausted = false;
    this.callbacks = [];
    this.timeLeftMS = timeoutMS;
    this.timeoutMS = timeoutMS;
    this.callbacks.push(callback);
  }
  tick() {
    if (!this.isCancelled && !this.isTimeExhausted) {
      this.timeLeftMS--;
      if (this.timeLeftMS <= 0) {
        this.isTimeExhausted = true;
        var callbacks = this.callbacks.slice();
        this.callbacks.length = 0;
        callbacks.forEach((callback) => {
          try {
            callback();
          } catch (error) {
            console.error("TimeoutLatch callback error:", error);
          }
        });
      }
    }
  }
  cancel() {
    this.isCancelled = true;
    this.callbacks.length = 0;
  }
  reset() {
    this.timeLeftMS = this.timeoutMS;
    this.isCancelled = false;
    this.isTimeExhausted = false;
  }
  get isDone() {
    return this.isCancelled || this.isTimeExhausted;
  }
}
class Scheduler {
  constructor() {
    this.interval = null;
    this.latches = /* @__PURE__ */ new Set();
  }
  add(latch) {
    this.latches.add(latch);
    this.start();
  }
  remove(latch) {
    this.latches.delete(latch);
    if (this.latches.size === 0) {
      this.stop();
    }
  }
  start() {
    if (this.interval === null) {
      this.interval = setInterval(() => {
        this.latches.forEach((latch) => {
          latch.tick();
          if (latch.isDone) {
            this.remove(latch);
          }
        });
      }, 1);
    }
  }
  stop() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
var globalScheduler = null;
var getScheduler = () => {
  if (typeof window === "undefined") {
    return new Scheduler();
  }
  if (!globalScheduler) {
    globalScheduler = new Scheduler();
  }
  return globalScheduler;
};
var ExternalChange = Annotation.define();
var TYPING_TIMOUT = 200;
var emptyExtensions = [];
function useCodeMirror(props) {
  var {
    value,
    selection,
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    extensions = emptyExtensions,
    autoFocus,
    theme = "light",
    height = null,
    minHeight = null,
    maxHeight = null,
    width = null,
    minWidth = null,
    maxWidth = null,
    placeholder: placeholderStr = "",
    editable = true,
    readOnly = false,
    indentWithTab: defaultIndentWithTab = true,
    basicSetup: defaultBasicSetup = true,
    root,
    initialState
  } = props;
  var [container, setContainer] = useState();
  var [view2, setView] = useState();
  var [state2, setState] = useState();
  var typingLatch = useState(() => ({
    current: null
  }))[0];
  var pendingUpdate = useState(() => ({
    current: null
  }))[0];
  var defaultThemeOption = EditorView.theme({
    "&": {
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth
    },
    "& .cm-scroller": {
      height: "100% !important"
    }
  });
  var updateListener = EditorView.updateListener.of((vu) => {
    if (vu.docChanged && typeof onChange === "function" && // Fix echoing of the remote changes:
    // If transaction is market as remote we don't have to call `onChange` handler again
    !vu.transactions.some((tr) => tr.annotation(ExternalChange))) {
      if (typingLatch.current) {
        typingLatch.current.reset();
      } else {
        typingLatch.current = new TimeoutLatch(() => {
          if (pendingUpdate.current) {
            var forceUpdate = pendingUpdate.current;
            pendingUpdate.current = null;
            forceUpdate();
          }
          typingLatch.current = null;
        }, TYPING_TIMOUT);
        getScheduler().add(typingLatch.current);
      }
      var doc = vu.state.doc;
      var _value = doc.toString();
      onChange(_value, vu);
    }
    onStatistics && onStatistics(getStatistics(vu));
  });
  var defaultExtensions = getDefaultExtensions({
    theme,
    editable,
    readOnly,
    placeholder: placeholderStr,
    indentWithTab: defaultIndentWithTab,
    basicSetup: defaultBasicSetup
  });
  var getExtensions = [updateListener, defaultThemeOption, ...defaultExtensions];
  if (onUpdate && typeof onUpdate === "function") {
    getExtensions.push(EditorView.updateListener.of(onUpdate));
  }
  getExtensions = getExtensions.concat(extensions);
  useLayoutEffect(() => {
    if (container && !state2) {
      var config = {
        doc: value,
        selection,
        extensions: getExtensions
      };
      var stateCurrent = initialState ? EditorState.fromJSON(initialState.json, config, initialState.fields) : EditorState.create(config);
      setState(stateCurrent);
      if (!view2) {
        var viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container,
          root
        });
        setView(viewCurrent);
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
      }
    }
    return () => {
      if (view2) {
        setState(void 0);
        setView(void 0);
      }
    };
  }, [container, state2]);
  useEffect(() => {
    if (props.container) {
      setContainer(props.container);
    }
  }, [props.container]);
  useEffect(() => () => {
    if (view2) {
      view2.destroy();
      setView(void 0);
    }
    if (typingLatch.current) {
      typingLatch.current.cancel();
      typingLatch.current = null;
    }
  }, [view2]);
  useEffect(() => {
    if (autoFocus && view2) {
      view2.focus();
    }
  }, [autoFocus, view2]);
  useEffect(() => {
    if (view2) {
      view2.dispatch({
        effects: StateEffect.reconfigure.of(getExtensions)
      });
    }
  }, [theme, extensions, height, minHeight, maxHeight, width, minWidth, maxWidth, placeholderStr, editable, readOnly, defaultIndentWithTab, defaultBasicSetup, onChange, onUpdate]);
  useEffect(() => {
    if (value === void 0) {
      return;
    }
    var currentValue = view2 ? view2.state.doc.toString() : "";
    if (view2 && value !== currentValue) {
      var isTyping = typingLatch.current && !typingLatch.current.isDone;
      var forceUpdate = () => {
        if (view2 && value !== view2.state.doc.toString()) {
          view2.dispatch({
            changes: {
              from: 0,
              to: view2.state.doc.toString().length,
              insert: value || ""
            },
            annotations: [ExternalChange.of(true)]
          });
        }
      };
      if (!isTyping) {
        forceUpdate();
      } else {
        pendingUpdate.current = forceUpdate;
      }
    }
  }, [value, view2]);
  return {
    state: state2,
    setState,
    view: view2,
    setView,
    container,
    setContainer
  };
}
var _excluded = ["className", "value", "selection", "extensions", "onChange", "onStatistics", "onCreateEditor", "onUpdate", "autoFocus", "theme", "height", "minHeight", "maxHeight", "width", "minWidth", "maxWidth", "basicSetup", "placeholder", "indentWithTab", "editable", "readOnly", "root", "initialState"];
var ReactCodeMirror = /* @__PURE__ */ forwardRef((props, ref) => {
  var {
    className,
    value = "",
    selection,
    extensions = [],
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    autoFocus,
    theme = "light",
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    basicSetup: basicSetup2,
    placeholder: placeholder2,
    indentWithTab: indentWithTab2,
    editable,
    readOnly,
    root,
    initialState
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
  var editor = useRef(null);
  var {
    state: state2,
    view: view2,
    container,
    setContainer
  } = useCodeMirror({
    root,
    value,
    autoFocus,
    theme,
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    basicSetup: basicSetup2,
    placeholder: placeholder2,
    indentWithTab: indentWithTab2,
    editable,
    readOnly,
    selection,
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    extensions,
    initialState
  });
  useImperativeHandle(ref, () => ({
    editor: editor.current,
    state: state2,
    view: view2
  }), [editor, container, state2, view2]);
  var setEditorRef = useCallback((el) => {
    editor.current = el;
    setContainer(el);
  }, [setContainer]);
  if (typeof value !== "string") {
    throw new Error("value must be typeof string but got " + typeof value);
  }
  var defaultClassNames = typeof theme === "string" ? "cm-theme-" + theme : "cm-theme";
  return /* @__PURE__ */ jsx("div", _extends({
    ref: setEditorRef,
    className: "" + defaultClassNames + (className ? " " + className : "")
  }, other));
});
ReactCodeMirror.displayName = "CodeMirror";
export {
  ExternalChange,
  ReactCodeMirror as default,
  defaultLightThemeOption,
  getDefaultExtensions,
  getStatistics,
  useCodeMirror
};
