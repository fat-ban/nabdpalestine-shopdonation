import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectCurrentUser } from '../auth/authSlice';
import { useFindAllCommentsQuery } from '../comments/commentsApiSlice';
import { useFindAllRatingsQuery } from '../ratings/ratingsApiSlice';
import { useGetProductsQuery } from '../products/productApiSlice';

const UserProfile = () => {
    const user = useAppSelector(selectCurrentUser);
    const [commentsPage, setCommentsPage] = useState(1);
    const [ratingsPage, setRatingsPage] = useState(1);
    const [productsPage, setProductsPage] = useState(1);

    const { data: commentsData, isLoading: isLoadingComments, isFetching: isFetchingComments } = useFindAllCommentsQuery({ page: commentsPage, limit: 5, user: user.id });
    const { data: ratingsData, isLoading: isLoadingRatings, isFetching: isFetchingRatings } = useFindAllRatingsQuery({ page: ratingsPage, limit: 5, userId: user.id });
    const { data: productsData, isLoading: isLoadingProducts, isFetching: isFetchingProducts } = useGetProductsQuery({ page: productsPage, limit: 5, seller: user.id });

    const handleLoadMoreComments = () => {
        setCommentsPage(prevPage => prevPage + 1);
    }

    const handleLoadMoreRatings = () => {
        setRatingsPage(prevPage => prevPage + 1);
    }

    const handleLoadMoreProducts = () => {
        setProductsPage(prevPage => prevPage + 1);
    }

    return (
        <div>
            <h1>User Profile</h1>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            <h2>My Comments</h2>
            {isLoadingComments && <p>Loading comments...</p>}
            <ul>
                {commentsData?.data.map(comment => (
                    <li key={comment.id}>{comment.content}</li>
                ))}
            </ul>
            {commentsData?.hasNextPage && (
                <button onClick={handleLoadMoreComments} disabled={isFetchingComments}>
                    {isFetchingComments ? 'Loading...' : 'Load More Comments'}
                </button>
            )}

            <h2>My Ratings</h2>
            {isLoadingRatings && <p>Loading ratings...</p>}
            <ul>
                {ratingsData?.data.map(rating => (
                    <li key={rating.id}>Rating: {rating.value}</li>
                ))}
            </ul>
            {ratingsData?.hasNextPage && (
                <button onClick={handleLoadMoreRatings} disabled={isFetchingRatings}>
                    {isFetchingRatings ? 'Loading...' : 'Load More Ratings'}
                </button>
            )}

            <h2>My Products</h2>
            {isLoadingProducts && <p>Loading products...</p>}
            <ul>
                {productsData?.data.map(product => (
                    <li key={product.id}>{product.name_en}</li>
                ))}
            </ul>
            {productsData?.hasNextPage && (
                <button onClick={handleLoadMoreProducts} disabled={isFetchingProducts}>
                    {isFetchingProducts ? 'Loading...' : 'Load More Products'}
                </button>
            )}
        </div>
    );
}

export default UserProfile;
