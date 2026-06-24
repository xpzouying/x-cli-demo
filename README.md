# x-cli homepage

Landing page for [x-cli](https://github.com/better-world-ai/x-cli), implemented from the
Claude Design prototype `x-cli 主页.dc.html`.

The design tool's runtime (`<x-dc>`, `<sc-for>`, `{{ }}`, `style-hover`, `DCLogic`) has been
ported to a plain static site:

| Prototype construct | Implemented as |
| --- | --- |
| `<helmet>` + base `<style>` | `<head>` + `styles.css` |
| `style-hover="…"` | real `:hover` rules (`.nav-star`, `.scene-card`, … in `styles.css`) |
| `<sc-for>` loops | `renderScenes()` / `renderClis()` in `app.js` |
| `{{ }}` bindings | template literals fed from the data arrays in `app.js` |
| `DCLogic` typing animation | `runHeroCycle()` in `app.js` |

## Files

- `index.html` — markup (inline styles kept verbatim from the prototype for pixel fidelity)
- `styles.css` — global rules, keyframes, hover states
- `app.js` — data, list rendering, hero terminal animation

## Run

It's fully static — open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## License

MIT
