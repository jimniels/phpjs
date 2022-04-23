// import { PageCustom } from "../server/Layouts.js";
// import { html, toDateUI } from "../server/utils.js";

const page = {
  permalink: "/",
};

export default async function Index(site) {
  console.log(await Deno.readDir("./src/posts"));

  // for (const dirEntry of Deno.readDirSync("./src/posts")) {
  //   console.log(dirEntry.name);
  // }

  const posts = Array.from(Deno.readDirSync("./src/posts"))
    .map(({ name }) => name)
    .slice(0, 10);
  console.log(posts);
  // const recent = site.posts
  //   .filter((post) => !post?.tags.includes("rssClub"))
  //   .slice(0, 5);
  // const favorites = site.posts
  //   .filter((post) => post.hasOwnProperty("favorites_index"))
  //   .sort((a, b) => (a.favorites_index > b.favorites_index ? 1 : -1))
  //   .slice(0, 5);
  // const trending = site.posts
  //   .filter((post) => post.hasOwnProperty("pageviews"))
  //   .sort((a, b) => (a.pageviews > b.pageviews ? -1 : 1))
  //   .slice(0, 5);

  return `<html>
  <h1>Posts</h1>

  <h2>Latest</h2>
  
  
    <h2>Popular This Month</h2>
  
    <p style="margin-bottom: 2.5rem; font-size: .8rem">
      <a
        href="/2020/using-netlify-analytics-to-build-list-of-popular-posts/"
        >Stats homebrewed from Netlify Analytics</a
      >
    </p>`;

  return PageCustom(
    { site, page },
    html`
      <h1>Posts</h1>

      <h2>Latest</h2>
      ${PostList(recent)}
      ${trending.length > 0 &&
      html`
        <h2>Popular This Month</h2>
        ${PostList(trending, true)}
        <p style="margin-bottom: 2.5rem; font-size: .8rem">
          <a
            href="/2020/using-netlify-analytics-to-build-list-of-popular-posts/"
            >Stats homebrewed from Netlify Analytics</a
          >
        </p>
      `}
    `
  );
}

function PostList(posts, showPageviews = false) {
  return html`
    <ul class="posts-list">
      ${posts.map(
        ({ permalink, title, pageviews, date }) => html`
          <li>
            <a href="${permalink}">${title}</a>
            <time datetime="${date.toISOString()}">${toDateUI(date)}</time>
            ${showPageviews &&
            html`<small
              >${pageviews > 1000
                ? Math.round((pageviews / 1000) * 10) / 10 + "k"
                : pageviews}</small
            >`}
          </li>
        `
      )}
    </ul>
  `;
}
