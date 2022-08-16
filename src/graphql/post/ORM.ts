import { Post } from '../generated/graphql'

export function postsORM(postRows: Record<string, any>[]) {
  const posts: Post[] = []

  for (const postRow of postRows) {
    posts.push({
      id: postRow.post__id,
      creationTime: postRow.post__creation_time,
      updateTime: postRow.post__update_time,
      deletionTime: postRow.post__deletion_time,
      content: postRow.post__content,
      imageUrls: postRow.post__image_urls,
      isLiked: postRow.post__is_liked,
      doIComment: postRow.post__do_i_comment,
      doIShare: postRow.post__do_i_share,
      likeCount: postRow.post__like_count ?? 0,
      commentCount: postRow.post__comment_count ?? 0,
      sharedCount: postRow.post__shared_count ?? 0,

      ...(postRow.post__user__id && {
        author: {
          id: postRow.post__user__id,
          name: postRow.post__user__name,
          nickname: postRow.post__user__nickname,
          imageUrl: postRow.post__user__image_url,
        },
      }),

      ...(postRow.sharing_post__id && {
        sharingPost: {
          id: postRow.sharing_post__id,
          creationTime: postRow.sharing_post__creation_time,
          updateTime: postRow.sharing_post__update_time,
          deletionTime: postRow.sharing_post__delete_time,
          content: postRow.sharing_post__content,
          imageUrls: postRow.sharing_post__image_urls,
          ...(postRow.sharing_post__user__id && {
            author: {
              id: postRow.sharing_post__user__id,
              name: postRow.sharing_post__user__name,
              nickname: postRow.sharing_post__user__nickname,
              imageUrl: postRow.sharing_post__user__image_url,
            },
          }),
        },
      }),
    })
  }

  return posts
}

export function postORM(postRows: Record<string, any>[]) {
  const parentPost = getParentPost(postRows[0])

  for (const postRow of postRows) {
    if (postRow.post__id) {
      if (!parentPost.comments) parentPost.comments = []
      const posts = parentPost.comments
      const postIndex = posts.findIndex((comment) => comment.id === postRow.post__id)

      if (postIndex === -1) {
        parentPost.comments.push(getPost(postRow))
      } else if (postRow.child_post__id) {
        const post = posts[postIndex]

        if (!post.comments) post.comments = []
        const childPostIndex = post.comments.findIndex(
          (comment) => comment.id === postRow.child_post__id
        )

        if (childPostIndex === -1) {
          post.comments.push(getChildPost(postRow))
        }
      }
    }
  }

  return parentPost
}

function getParentPost(postRow: Record<string, any>): Post {
  return {
    id: postRow.parent_post__id,
    creationTime: postRow.parent_post__creation_time,
    updateTime: postRow.parent_post__update_time,
    deletionTime: postRow.parent_post__deletion_time,
    content: postRow.parent_post__content,
    imageUrls: postRow.parent_post__image_urls,
    isLiked: postRow.parent_post__is_liked,
    doIComment: postRow.parent_post__do_i_comment,
    doIShare: postRow.parent_post__do_i_share,
    likeCount: postRow.parent_post__like_count ?? 0,
    commentCount: postRow.parent_post__comment_count ?? 0,
    sharedCount: postRow.parent_post__shared_count ?? 0,
    ...(postRow.parent_post__user__id && {
      author: {
        id: postRow.parent_post__user__id,
        name: postRow.parent_post__user__name,
        nickname: postRow.parent_post__user__nickname,
        imageUrl: postRow.parent_post__user__image_url,
      },
    }),
    ...(postRow.parent_post__grandparent_user__id && {
      parentAuthor: {
        id: postRow.parent_post__grandparent_user__id,
        name: postRow.parent_post__grandparent_user__name,
      },
    }),

    ...(postRow.sharing_post__id && {
      sharingPost: {
        id: postRow.sharing_post__id,
        creationTime: postRow.sharing_post__creation_time,
        updateTime: postRow.sharing_post__update_time,
        deletionTime: postRow.sharing_post__delete_time,
        content: postRow.sharing_post__content,
        imageUrls: postRow.sharing_post__image_urls,
        ...(postRow.sharing_post__user__id && {
          author: {
            id: postRow.sharing_post__user__id,
            name: postRow.sharing_post__user__name,
            nickname: postRow.sharing_post__user__nickname,
            imageUrl: postRow.sharing_post__user__image_url,
          },
        }),
      },
    }),

    ...(postRow.post__id && {
      comments: [getPost(postRow)],
    }),
  }
}

function getPost(postRow: Record<string, any>): Post {
  return {
    id: postRow.post__id,
    creationTime: postRow.post__creation_time,
    updateTime: postRow.post__update_time,
    deletionTime: postRow.post__deletion_time,
    content: postRow.post__content,
    imageUrls: postRow.post__image_urls,
    isLiked: postRow.post__is_liked,
    doIComment: postRow.post__do_i_comment,
    doIShare: postRow.post__do_i_share,
    likeCount: postRow.post__like_count ?? 0,
    commentCount: postRow.post__comment_count ?? 0,
    sharedCount: postRow.post__shared_count ?? 0,
    ...(postRow.post__user__id && {
      author: {
        id: postRow.post__user__id,
        name: postRow.post__user__name,
        nickname: postRow.post__user__nickname,
        imageUrl: postRow.post__user__image_url,
      },
    }),
    ...(postRow.parent_post__user__id && {
      parentAuthor: {
        id: postRow.parent_post__user__id,
        name: postRow.parent_post__user__name,
      },
    }),

    ...(postRow.child_post__id && {
      comments: [getChildPost(postRow)],
    }),
  }
}

function getChildPost(postRow: Record<string, any>): Post {
  return {
    id: postRow.child_post__id,
    creationTime: postRow.child_post__creation_time,
    updateTime: postRow.child_post__update_time,
    deletionTime: postRow.child_post__deletion_time,
    content: postRow.child_post__content,
    imageUrls: postRow.child_post__image_urls,
    isLiked: postRow.child_post__is_liked,
    doIComment: postRow.child_post__do_i_comment,
    doIShare: postRow.child_post__do_i_share,
    likeCount: postRow.child_post__like_count ?? 0,
    commentCount: postRow.child_post__comment_count ?? 0,
    sharedCount: postRow.child_post__shared_count ?? 0,
    ...(postRow.child_post__user__id && {
      author: {
        id: postRow.child_post__user__id,
        name: postRow.child_post__user__name,
        nickname: postRow.child_post__user__nickname,
        imageUrl: postRow.child_post__user__image_url,
      },
    }),
    ...(postRow.post__user__id && {
      parentAuthor: {
        id: postRow.post__user__id,
        name: postRow.post__user__name,
      },
    }),
  }
}
