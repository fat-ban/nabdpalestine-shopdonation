import { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../features/categories/categoryApiSlice';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function CategoriesManagement() {
    const { data: categories, isLoading, isError, error } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryNameAr, setNewCategoryNameAr] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    const handleCreateCategory = async () => {
        if (newCategoryName.trim() !== '' && newCategoryNameAr.trim() !== '') {
            await createCategory({ name_en: newCategoryName, name_ar: newCategoryNameAr });
            setNewCategoryName('');
            setNewCategoryNameAr('');
        }
    };

    const handleUpdateCategory = async (category) => {
        if (editingCategory && editingCategory.id === category.id) {
            await updateCategory({ id: category.id, data: { name_en: category.name_en, name_ar: category.name_ar } });
            setEditingCategory(null);
        }
    };

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id);
    };

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    if (isError) {
        return <div>Error loading categories: {error.toString()}</div>;
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle>Categories Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="New Category Name (English)"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Input
                        placeholder="New Category Name (Arabic)"
                        value={newCategoryNameAr}
                        onChange={(e) => setNewCategoryNameAr(e.target.value)}
                    />
                    <Button onClick={handleCreateCategory}><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name (English)</TableHead>
                            <TableHead>Name (Arabic)</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>
                                    {editingCategory && editingCategory.id === category.id ? (
                                        <Input 
                                            value={editingCategory.name_en}
                                            onChange={(e) => setEditingCategory({...editingCategory, name_en: e.target.value})}
                                        />
                                    ) : (
                                        category.name_en
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCategory && editingCategory.id === category.id ? (
                                        <Input 
                                            value={editingCategory.name_ar}
                                            onChange={(e) => setEditingCategory({...editingCategory, name_ar: e.target.value})}
                                        />
                                    ) : (
                                        category.name_ar
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingCategory && editingCategory.id === category.id ? (
                                        <Button onClick={() => handleUpdateCategory(editingCategory)}>Save</Button>
                                    ) : (
                                        <Button onClick={() => setEditingCategory(category)}><Edit className="h-4 w-4" /></Button>
                                    )}
                                    <Button onClick={() => handleDeleteCategory(category.id)} variant="destructive" className="ml-2"><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}