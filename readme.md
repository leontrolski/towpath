```bash
npm install towpath
```

or

```html
<script type="module">
    import * as towpath from 'https://unpkg.com/towpath@0.0.4/index.js'
    // ...
</script>
```

# How to use:

```js
import * as towpath from 'towpath'

const l = [1, 2, {foo: [{bar: 3}]}]
const p = towpath.addPaths(l)
```

`p` is now a nested proxy, where each nested proxy object has its value, but also a path

```js
towpath.value(p[2].foo[0]) // ===
{bar: 3}

towpath.path(p[2].foo[0]) // ===
[2, "foo", 0]
```

proxy objects will pass through all methods (in this case `.toString`)

```js
`${p[0]}, ${p[1]}, ${p[2].foo[0].bar}` // ===
"1, 2, 3"
```

helper to mutate the original object

```js
towpath.set(l, p[2].foo[0], 'qux')
l // ===
[1, 2, {foo: ['qux']}]
```
