const button = document.getElementById('start-playlist-btn');

chrome.bookmarks.getTree(function (tree) {
  const folders = [];
  let bookmarks = tree[0].children[0].children;

  bookmarks.forEach((element) => {
    if (element.children) {
      folders.push({
        id: element.id,
        title: element.title,
      });
    }
  });

  bookmarks = tree[0].children[1];
  if (bookmarks.children && bookmarks.children.length) {
    folders.push({
      id: bookmarks.id,
      title: bookmarks.title,
    });
  }

  setUpBookmarkSelect(folders);
});

function setUpBookmarkSelect(folders) {
  const selectTag = document.getElementById('bookmarks-select-tag');

  folders.forEach((item) => {
    selectTag.innerHTML += `<option value="${item.id}">${item.title}</option>`;
  });
}

button.onclick = function () {
  const selectTag = document.getElementById('bookmarks-select-tag');

  if (selectTag.value) {
    chrome.bookmarks.getChildren(selectTag.value, function (bookmarks) {
      const videoIDs = [];
      bookmarks.forEach((item) => {
        const url = new URL(item.url);
        if (url.host === 'www.youtube.com' && url.pathname === '/watch') {
          const search = parseSearchQuery(url.search);
          videoIDs.push(search);
        }
      });

      if (videoIDs.length) {
        const playListURL =
          'https://www.youtube.com/watch_videos?video_ids=' + videoIDs.join();
        chrome.tabs.create({ url: playListURL });
      } else {
        alert('No youtube video found');
      }
    });
  } else {
    alert('Please Select Bookmark');
  }
};

function parseSearchQuery(query) {
  return query.split('?v=')[1].split('&')[0];
}
