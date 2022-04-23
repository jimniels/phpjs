index.$.js
/about/index.$.js
/feed/index.$.js
/feed/index.xml.js

\_redirects.$.js
import config from "config.json";
export default function Redirects(request) {
  return `
    /api/v1 /api/v1/index.json 200
  `;
}
// express server for local...?
// build time
const Component = await import(filepath).then(
  (module) => module.default
);
files[file].contents = Component(filepath.replace(".$.js", ""), runtimeConfig);
files[file.replace(".tmpl.js", "")] = files[file];
delete files[file];

export default function Redirects(request) {
return new Response({
headers: new Headers({
'Content-Type': 'text/plain'
}),
url: request.url.replace(`.$.js`, ""), // http://localhost:8888/\_redirects
body: ``
});
}

---

index.$.html

```html
<!DOCTYPE html>
<h1>${globaldata.thing}</h1>
```

index.html.$.js

```js
import thing from "./thing.js";
export default (globalData) => `<!doctype html><h1>${globalData}</h1>`;
```
