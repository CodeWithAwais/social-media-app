import { useContext } from "react";
import { FeedContext } from '../types/index'

function useFeed() {
    const feed = useContext(FeedContext);
    if(!feed){
        throw new Error("useFeed must be used within a FeedProvider");
    }
    return feed;
}

export default useFeed;