# jsx-compiler-x
JSX Lexer &amp; Parser - Compiler| for Zenn

Please understand that it is just a parser for **JSX** itself and does not follow the **ES standard** or **React standard**.

### Before
```jsx
<>
  <p>
	hello
    <span class="x" a="b" />
    <Cmp c="d" />
  </p>       
</>
```

### Lexer & Parser & Compiler
```js
JSXCompiler(`<>
  <p>...
</>`, {
  jsxFragment: "_Fragment",
  jsxRender: "_jsx"
})
```

### After
```js
_jsx(_Fragment,{children:_jsx("p",{children:["hello",_jsx("span",{class:"x",a:"b"}),_jsx2(Cmp,{c:"d"})]})});
```
