cDI.pages.blog = {
  siteHeaderText: `<span class="cols"><span class="header">Code for the Fences</span><span class="iSubheader">Software is eating the world, and it is delicious</span>`,
  init: async () => {
    await cDI.pages.blog.loadPost("This Blog Post is Hardcoded")
  },
  loadPost: async (title) => {
    var post = await cDI.remote.remoteCall("/crud/blog/r", {title: title})
    post = post.payload[0]
    console.log(post)
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
