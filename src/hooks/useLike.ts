// useLike — already in FeedContext, expose it cleanly

import useFeed from './useFeed';

interface UseLikeReturn{
    toggleLike: (postId: string) => void,
    isPostLiked: (postId: string) => boolean
}

function useLike(): UseLikeReturn{
    const {posts, toggleLike} = useFeed();
    const isPostLiked = (postId: string) => {
        return posts.find(p => p.id === postId)?.isLiked ?? false
    }
    return {toggleLike, isPostLiked};
}

export default useLike;
