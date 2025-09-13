import { useState } from 'react';
import { useFindAllCommentsQuery, useRemoveCommentMutation } from '../features/comments/commentsApiSlice';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function CommentsManagement() {
    const [page, setPage] = useState(1);
    const { data: commentsData, isLoading, isFetching, isError, error } = useFindAllCommentsQuery({ page, limit: 10 });
    const [removeComment] = useRemoveCommentMutation();

    const handleRemoveComment = async (id) => {
        await removeComment(id);
    };

    const handleLoadMore = () => {
        if (commentsData?.hasNextPage) {
            setPage(prevPage => prevPage + 1);
        }
    }

    if (isLoading) {
        return <div>Loading comments...</div>;
    }

    if (isError) {
        return <div>Error loading comments: {error.toString()}</div>;
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle>Comments Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {commentsData?.data.map((comment) => (
                            <TableRow key={comment.id}>
                                <TableCell>{comment.id}</TableCell>
                                <TableCell>{comment.content}</TableCell>
                                <TableCell>{comment.user.name}</TableCell>
                                <TableCell>{comment.product.name_en}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleRemoveComment(comment.id)} variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {commentsData?.hasNextPage && (
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