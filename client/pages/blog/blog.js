cDI.pages.blog = {
  siteHeaderText: `<span class="cols"><span class="header">Code for the Fences</span><span class="iSubheader">Software is eating the world, and it is delicious</span>`,
  init: async () => {
    await cDI.remote.asyncGetScript(`js/services/blogService.js`)
    cDI.pages.blog.buildPostList()
  },
  buildPostList: async () => {
    var posts = await cDI.services.blog.getPostList()
    var postlist = ``
    posts.forEach(x => postlist += `<span onclick="cDI.pages.blog.buildPost('${x.title}')">${x.title}</span>`)

    $("#blogPostList").html(postlist)
  },
  buildPost: async (title) => {
    var post = await cDI.services.blog.getPost(title)
    var post = `
      <span id="blogPostHeader" class="cols unwrap fitH">
        <span class="blogTitle subheader">${post.title}</span>
        <span class="blogDate">${post.date}</span>
        <span class="blogByline byline">Devin Downer</span>
      </span>
      <span class="blogContent shyScroll">
        ${post.content}
      </span>
    `
    $("#displayBlogPost").html(post)
  }
}
