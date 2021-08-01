cDI.services.blog = {
  getPostList: async () => {
    var res = await cDI.remote.remoteCall("/crud/blog/r/")
    return res.payload
  },
  getPost: async (id) => {
    var post = await cDI.remote.remoteCall("/crud/blog/r", {blogId: id})
    return post.payload
  }
}
