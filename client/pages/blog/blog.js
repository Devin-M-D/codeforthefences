cDI.pages.blog = {
  siteHeaderText: `Blog`,
  init: async () => {
    await cDI.remote.asyncGetScript(`/js/services/blogService.js`)
  },
  drawPage: async (container) => {
    container.append(`<span id="blogMain" class="cols">
      <span id="blogPostList" class="shyScroll outset rows algnSS"></span>
      <span id="displayBlogPost" class=""></span>
    </span>`)
    await cDI.pages.blog.buildPostList()
  },
  buildPostList: async () => {
    var posts = await cDI.services.blog.getPostList()
    posts = posts.sort((a, b) => { return new Date(b.createdDate) - new Date(a.createdDate) })
    var latestId = posts[0].id
    var oldestId = posts[posts.length - 1].id
    var postlist = ``
    posts.forEach(x => {
      postlist += `
        <span class="blogListTitle" onclick="cDI.pages.blog.buildPost('${x.id}')">${x.title}</span>
        ${x.id != oldestId ? `<span class="rule horiz slim"></span>` : ``}
      `
    })
    $("#blogPostList").html(postlist)
    await cDI.pages.blog.buildPost(latestId)
  },
  buildPost: async (id) => {
    var post = await cDI.services.blog.getPost(id)
    var post = `
      <span id="blogPostHeader" class="rows">
        <span class="blogTitle subheader">${post.title}</span>
        <span class="blogDate">${post.createdDate}</span>
        <span class="blogByline byline">Devin Downer</span>
      </span>
      <span class="rule horiz"></span>
      <span id="blogContent" class="shyScroll">
        ${post.content}
      </span>
    `
    $("#displayBlogPost").html(post)
  }
}
