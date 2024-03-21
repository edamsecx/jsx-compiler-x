# jsx-compiler-x
JSX Lexer &amp; Parser - Compiler| for Zenn

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
