// useFilter — returns filtered posts based on filterCategory
//   → if filterCategory is "all" → return all posts
//   → otherwise → return posts where post.category === filterCategory


import useFeed from '../hooks/useFeed'
import {type Post} from '../types/index';
import { type Category } from '../types/index';
import { useSearchParams } from 'react-router-dom'

function useFilter(){
    const {posts} = useFeed();

    const [searchParams] = useSearchParams();

    const filteredCategory = (searchParams.get('filter') ?? 'all') as Category;

    const filteredPosts : Post[] = filteredCategory === 'all' ? posts : posts.filter(p => p.category === filteredCategory);

    // const filteredPosts : Post[] = filterCategory === 'all' ? posts : posts.filter(p => p.category === filterCategory)

    return {filteredPosts}
}

export default useFilter;