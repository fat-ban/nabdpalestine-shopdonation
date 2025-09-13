import { useState } from 'react';
import { useFindAllRatingsQuery, useRemoveRatingMutation } from '../features/ratings/ratingsApiSlice';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function RatingsManagement() {
    const [page, setPage] = useState(1);
    const { data: ratingsData, isLoading, isFetching, isError, error } = useFindAllRatingsQuery({ page, limit: 10 });
    const [removeRating] = useRemoveRatingMutation();

    const handleRemoveRating = async (id) => {
        await removeRating(id);
    };

    const handleLoadMore = () => {
        if (ratingsData?.hasNextPage) {
            setPage(prevPage => prevPage + 1);
        }
    }

    if (isLoading) {
        return <div>Loading ratings...</div>;
    }

    if (isError) {
        return <div>Error loading ratings: {error.toString()}</div>;
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle>Ratings Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ratingsData?.data.map((rating) => (
                            <TableRow key={rating.id}>
                                <TableCell>{rating.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{rating.user.name}</TableCell>
                                <TableCell>{rating.product.name_en}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleRemoveRating(rating.id)} variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {ratingsData?.hasNextPage && (
                    <div className="text-center mt-4">
                        <Button onClick={handleLoadMore} disabled={isFetching}>
                            {isFetching ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}