cDI.services.blog = {
  getPostList: async () => {
    var res = await cDI.remote.remoteCall("/crud/blog/r/")
    return res.payload
  },
  getPost: async (title) => {
    var post = await cDI.remote.remoteCall("/crud/blog/r", {title: title})
    post = post.payload[0]
    return post
  }
}
