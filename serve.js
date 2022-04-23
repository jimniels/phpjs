// deno run --allow-net --watch --allow-read serve.js
// https://deno.land/manual@v1.19.1/runtime/http_server_apis
import { serve } from "https://deno.land/std@0.127.0/http/server.ts";
import {
  serveFile,
  serveDir,
} from "https://deno.land/std@0.127.0/http/file_server.ts";
// import runtimeConfig from "./runtime-config.js"; runtimeData

async function dynamicImport(filePath) {
  const { default: Component } = await import(filePath);

  // If path has extension, use that; otherwise default to .html
  return new Response(await Component({ linksByDomain: {} }), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

const patterns = [
  {
    pattern: "/posts/",
    code: (file) => {
      fs.readFile(file);
      marked(file.contents);
      return file.contents;
    },
  },
];

async function handler(req) {
  const pathname = new URL(req.url).pathname;

  const url = new URL(req.url);
  const filepath = decodeURIComponent(url.pathname);
  console.log("--> Requesting:", url.pathname, filepath);

  let path2 = `./src${url.pathname}/index.$.js`;
  if (await exists(path2)) {
    console.log("Matching dynamic path...");
    return dynamicImport(path2);
  }
  let path1 = `./src${url.pathname}.$.js`;
  if (await exists(path1)) {
    console.log("Matching dynamic file...");
    console.log("--> Dynamic");
    return dynamicImport(path1);
  }

  try {
    console.log("Matching static server...", filepath);
    return serveDir(req, { fsRoot: "./src", showDirListing: true });
  } catch (e) {
    console.log("Error 404...");
    console.log(e);
    return new Response(`<!doctype html><h1>404: (inline)</h1>`, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  // If file exists on disk, access it and process it and return it
  // try {
  //   // const text = await Deno.readTextFile("./people.json");
  //   const t = await serveFile(req, `./src${url.pathname}`);
  //   return t;
  //   return new Response("<!doctype html><h1>Hello world</h1>", {
  //     status: 200,
  //     headers: {
  //       "content-type": "text/html; charset=utf-8",
  //     },
  //   });
  // } catch (e) {
  //   console.log("--> Error", e);
  //   return new Response(`<!doctype html><h1>404: Page Not Found</h1>`, {
  //     status: 404,
  //     headers: {
  //       "content-type": "text/html; charset=utf-8",
  //     },
  //   });
  // }

  // Otherwise 404 it
}

serve(handler, { port: 8000 });
console.log("Listening on: http://localhost:8000");

// traver the entire dir, process every file with a runtime config

/**
 *
 * @param {string} filename
 * @returns {Promise.<boolean>}
 */
async function exists(filename) {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    // if (error instanceof Deno.errors.NotFound) {
    // file or directory does not exist
    return false;
    // } else {
    // unexpected error, maybe permissions, pass it along
    // throw error;
    // }
  }
}
