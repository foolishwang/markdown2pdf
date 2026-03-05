import { jsx } from "react/jsx-runtime";
import ReactCodeMirror from "./index-Bw0K8qWC.mjs";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import "@babel/runtime/helpers/extends";
import "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import "react";
import "@codemirror/state";
import "@codemirror/commands";
import "@uiw/codemirror-extensions-basic-setup";
import "@codemirror/theme-one-dark";
const darkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-primary)"
    },
    ".cm-content": {
      caretColor: "var(--accent-primary)",
      fontFamily: "var(--font-mono)"
    },
    ".cm-cursor": {
      borderLeftColor: "var(--accent-primary)"
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "rgba(124, 92, 252, 0.2)"
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(124, 92, 252, 0.04)"
    },
    ".cm-gutters": {
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-muted)",
      borderRight: "1px solid var(--border-color)"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--surface-1)"
    }
  },
  { dark: true }
);
const lightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-primary)"
    },
    ".cm-content": {
      caretColor: "var(--accent-primary)",
      fontFamily: "var(--font-mono)"
    },
    ".cm-cursor": {
      borderLeftColor: "var(--accent-primary)"
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "rgba(106, 76, 230, 0.15)"
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(106, 76, 230, 0.05)"
    },
    ".cm-gutters": {
      backgroundColor: "var(--bg-secondary)",
      color: "var(--text-muted)",
      borderRight: "1px solid var(--border-color)"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--surface-1)"
    }
  },
  { dark: false }
);
function EditorClient({ value, onChange, theme }) {
  return /* @__PURE__ */ jsx(
    ReactCodeMirror,
    {
      value,
      height: "100%",
      theme: theme === "dark" ? darkTheme : lightTheme,
      extensions: [
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          window.currentEditorView = update.view;
        })
      ],
      onChange: (val) => onChange(val),
      basicSetup: {
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        foldGutter: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: false,
        indentOnInput: true
      }
    }
  );
}
export {
  EditorClient as default
};
