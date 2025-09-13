import { useState } from 'react';
import { 
    useGetOrganizationsQuery,
    useGetVerifiedOrganizationsQuery,
    useGetPendingOrganizationsQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useVerifyOrganizationMutation,
    useRejectOrganizationMutation
} from '../features/organizations/organizationApiSlice';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2, Edit, Check, X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function OrganizationsManagement() {
    const [page, setPage] = useState(1);
    const { data: orgsData, isLoading, isError, error } = useGetOrganizationsQuery({ page, limit: 10 });
    const { data: pendingOrgsData } = useGetPendingOrganizationsQuery({ page: 1, limit: 10 });
    const { data: verifiedOrgsData } = useGetVerifiedOrganizationsQuery({ page: 1, limit: 10 });
    
    const [createOrganization] = useCreateOrganizationMutation();
    const [updateOrganization] = useUpdateOrganizationMutation();
    const [deleteOrganization] = useDeleteOrganizationMutation();
    const [verifyOrganization] = useVerifyOrganizationMutation();
    const [rejectOrganization] = useRejectOrganizationMutation();

    const [newOrg, setNewOrg] = useState({ name_en: '', name_ar: '', description_en: '', description_ar: '', blockchain_address: '' });
    const [rejectionReason, setRejectionReason] = useState('');

    const handleCreateOrg = async () => {
        await createOrganization(newOrg);
        setNewOrg({ name_en: '', name_ar: '', description_en: '', description_ar: '', blockchain_address: '' });
    };

    const handleVerify = async (id: string) => {
        await verifyOrganization(id);
    };

    const handleReject = async (id: string) => {
        await rejectOrganization({ id, rejection_reason: rejectionReason });
    };

    if (isLoading) return <div>Loading organizations...</div>;
    if (isError) return <div>Error: {error.toString()}</div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Name (English)" value={newOrg.name_en} onChange={(e) => setNewOrg({ ...newOrg, name_en: e.target.value })} />
                    <Input placeholder="Name (Arabic)" value={newOrg.name_ar} onChange={(e) => setNewOrg({ ...newOrg, name_ar: e.target.value })} />
                    <Textarea placeholder="Description (English)" value={newOrg.description_en} onChange={(e) => setNewOrg({ ...newOrg, description_en: e.target.value })} />
                    <Textarea placeholder="Description (Arabic)" value={newOrg.description_ar} onChange={(e) => setNewOrg({ ...newOrg, description_ar: e.target.value })} />
                    <Input placeholder="Blockchain Address" value={newOrg.blockchain_address} onChange={(e) => setNewOrg({ ...newOrg, blockchain_address: e.target.value })} />
                    <Button onClick={handleCreateOrg}><Plus className="h-4 w-4 mr-2" />Create</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {pendingOrgsData?.data.map(org => (
                                <TableRow key={org.id}>
                                    <TableCell>{org.name_en}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button onClick={() => handleVerify(org.id)} size="sm" variant="ghost"><Check className="h-4 w-4" /></Button>
                                        <Input placeholder="Rejection Reason" onChange={(e) => setRejectionReason(e.target.value)} className="w-40" />
                                        <Button onClick={() => handleReject(org.id)} size="sm" variant="destructive"><X className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Verified Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {verifiedOrgsData?.data.map(org => (
                                <TableRow key={org.id}>
                                    <TableCell>{org.name_en}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => deleteOrganization(org.id)} size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
