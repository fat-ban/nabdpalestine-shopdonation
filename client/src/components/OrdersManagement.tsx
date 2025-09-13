import { useState } from 'react';
import { useFindAllOrdersQuery, useUpdateOrderMutation, useUpdatePaymentStatusMutation, useCancelOrderMutation, useRemoveOrderMutation } from '../features/orders/orderApiSlice';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2, Edit, Eye, X, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function OrdersManagement() {
    const [page, setPage] = useState(1);
    const { data: ordersData, isLoading, isFetching, isError, error } = useFindAllOrdersQuery({ page, limit: 10 });
    const [updateOrder] = useUpdateOrderMutation();
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
    const [cancelOrder] = useCancelOrderMutation();
    const [removeOrder] = useRemoveOrderMutation();

    const handleUpdateStatus = async (id: string, status: string) => {
        await updateOrder({ id, data: { status } });
    };

    const handleUpdatePaymentStatus = async (id: string, paymentStatus: string) => {
        await updatePaymentStatus({ id, paymentStatus });
    };
    
    const handleCancelOrder = async (id: string) => {
        await cancelOrder(id);
    }

    const handleRemoveOrder = async (id: string) => {
        await removeOrder(id);
    };

    const handleLoadMore = () => {
        if (ordersData?.hasNextPage) {
            setPage(prevPage => prevPage + 1);
        }
    }

    if (isLoading) {
        return <div>Loading orders...</div>;
    }

    if (isError) {
        return <div>Error loading orders: {error.toString()}</div>;
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle>Orders Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ordersData?.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user.name}</TableCell>
                                <TableCell>${order.total_price}</TableCell>
                                <TableCell>
                                    <Select onValueChange={(value) => handleUpdateStatus(order.id, value)} defaultValue={order.status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                     <Select onValueChange={(value) => handleUpdatePaymentStatus(order.id, value)} defaultValue={order.payment_status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleCancelOrder(order.id)} variant="ghost" size="sm" className="text-yellow-500"><X className="h-4 w-4" /></Button>
                                    <Button onClick={() => handleRemoveOrder(order.id)} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {ordersData?.hasNextPage && (
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