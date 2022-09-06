import { Post } from '../generated/graphql'

export function getPosts(postRows: Record<string, any>[]) {
  const posts: Post[] = []

  for (const postRow of postRows) {
    posts.push(postORM(postRow))
  }

  return posts
}

export function getComments(commentRows: Record<string, any>[]) {
  const comments = []

  for (const commentRow of commentRows) {
    // 대댓글 있는 경우
    if (commentRow.child_post__id) {
      const commentIndex = comments.findIndex((comment) => comment.id === commentRow.post__id)

      // 대댓글 1개
      if (commentIndex === -1) {
        comments.push(postORM(commentRow))
      }
      // 대댓글 2개 이상
      else {
        comments[commentIndex].comments?.push(childPostORM(commentRow))
      }
    }
    // 대댓글 없는 경우
    else {
      comments.push(postORM(commentRow))
    }
  }

  return comments
}

export function postORM(postRow: Record<string, any>): Post {
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

    ...(postRow.parent_post__user__id && {
      parentAuthor: {
        id: postRow.parent_post__user__id,
        name: postRow.parent_post__user__name,
      },
    }),

    ...(postRow.child_post__id && {
      comments: [childPostORM(postRow)],
    }),
  }
}

function childPostORM(postRow: Record<string, any>): Post {
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
