fetch("//api.github.com/users/VictorWinberg").then(async (res) => {
  if (!res.ok) return;
  const json = await res.json();
  const head = document.head || document.getElementsByTagName("head")[0];
  const div = document.getElementById("github");
  const wrapper = document.createElement("div");
  const style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  div.appendChild(wrapper);
  wrapper.setAttribute("class", "github");

  const repos = document.createElement("a");
  const gists = document.createElement("a");
  wrapper.appendChild(repos);
  wrapper.appendChild(gists);

  repos.appendChild(document.createTextNode(json.public_repos + " Repos"));
  gists.appendChild(document.createTextNode(json.public_gists + " Gists"));

  repos.setAttribute("href", "//github.com/VictorWinberg?tab=repositories");
  gists.setAttribute("href", "//gist.github.com/VictorWinberg");

  const css = `
    #github {
      position: relative;
    }

    .github {
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      margin: 1em;
      animation: fade .5s ease-in-out;
    }

    .github a {
      margin: 0.5em;
      padding: 0.75em;
      text-decoration: none;
      color: rgba(0,0,0,0.87);
      border: 1px solid;
      background: white;
    }

    .github a:hover {
      background: khaki;
    }

    @keyframes fade {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `;

  style.appendChild(document.createTextNode(css));
});
