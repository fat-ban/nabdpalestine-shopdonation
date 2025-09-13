import { useState } from 'react';
import { useFindAllOrderItemsAdminQuery, useUpdateOrderItemStatusMutation, useRemoveOrderItemMutation } from '../features/order-items/orderItemApiSlice';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function OrderItemsManagement() {
    const [page, setPage] = useState(1);
    const { data: orderItemsData, isLoading, isFetching, isError, error } = useFindAllOrderItemsAdminQuery({ page, limit: 10 });
    const [updateOrderItemStatus] = useUpdateOrderItemStatusMutation();
    const [removeOrderItem] = useRemoveOrderItemMutation();

    const handleUpdateStatus = async (id: string, status: string) => {
        await updateOrderItemStatus({ id, status });
    };

    const handleRemoveItem = async (id: string) => {
        await removeOrderItem(id);
    };

    const handleLoadMore = () => {
        if (orderItemsData?.hasNextPage) {
            setPage(prevPage => prevPage + 1);
        }
    }

    if (isLoading) {
        return <div>Loading order items...</div>;
    }

    if (isError) {
        return <div>Error loading order items: {error.toString()}</div>;
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle>Order Items Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderItemsData?.data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.product.name_en}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.price}</TableCell>
                                <TableCell>{item.order_id}</TableCell>
                                <TableCell>
                                    <Select onValueChange={(value) => handleUpdateStatus(item.id, value)} defaultValue={item.status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="preparing">Preparing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleRemoveItem(item.id)} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {orderItemsData?.hasNextPage && (
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