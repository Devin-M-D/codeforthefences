cDI.pages.blog = {
  siteHeaderText: `<span class="cols"><span class="header">Code for the Fences</span><span class="iSubheader">Software is eating the world, and it is delicious</span>`,
  init: async () => {
    await cDI.remote.asyncGetScript(`js/services/blogService.js`)
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
        <span class="blogListTitle autoH" onclick="cDI.pages.blog.buildPost('${x.id}')">${x.title}</span>
        ${x.id != oldestId ? `<span class="rule horiz slim"></span>` : ``}
      `
    })
    $("#blogPostList").html(postlist)
    await cDI.pages.blog.buildPost(latestId)
  },
  buildPost: async (id) => {
    var post = await cDI.services.blog.getPost(id)
    var post = `
      <span id="blogPostHeader" class="cols autoH pad10 algnSS">
        <span class="blogTitle autoH algnSS subheader">${post.title}</span>
        <span class="blogDate autoH algnSS">${post.createdDate}</span>
        <span class="blogByline autoH algnSS byline">Devin Downer</span>
      </span>
      <span class="rule horiz"></span>
      <span class="blogContent autoH pad10 algnSS shyScroll noShadow">
        ${post.content}
      </span>
    `
    $("#displayBlogPost").html(post)
  }
}
