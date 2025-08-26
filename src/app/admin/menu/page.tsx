"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { isAdmin } from '@/utils/admin';
import { addMenuItem, getMenuItems, deleteMenuItem } from '@/action/admin';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  image_url: string | null;
  created_at: string;
}

export default function MenuManagement() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rating: '',
    description: '',
    image: null as File | null
  });

  useEffect(() => {
    setMounted(true);
    if (!isAdmin()) {
      router.push('/admin/login');
      return;
    }
    loadMenuItems();
  }, [router]);

  const loadMenuItems = async () => {
    setLoading(true);
    const result = await getMenuItems();
    if (result.success) {
      setMenuItems(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('rating', formData.rating);
    submitData.append('description', formData.description);
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    const result = await addMenuItem(submitData);

    if (result.success) {
      setFormData({
        name: '',
        price: '',
        rating: '',
        description: '',
        image: null
      });
      setShowAddForm(false);
      loadMenuItems();
    } else {
      alert('Error: ' + result.error);
    }

    setSubmitting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const result = await deleteMenuItem(id);
      if (result.success) {
        loadMenuItems();
      } else {
        alert('Error: ' + result.error);
      }
    }
  };

  if (!mounted) return <div>Loading...</div>;
  if (!isAdmin()) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/dashboard')}
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {showAddForm ? 'Cancel' : 'Add New Item'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Menu Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Classic Cheeseburger"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="12.99"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (1-5)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                    placeholder="4.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this delicious burger..."
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {submitting ? 'Adding...' : 'Add Menu Item'}
              </Button>
            </form>
          </div>
        )}

        {/* Menu Items List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Current Menu Items</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Loading menu items...</div>
          ) : (
            <div className="divide-y">
              {menuItems.map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>Price: ${item.price}</span>
                        <span>Rating: {item.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              {menuItems.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No menu items yet. Add your first item!
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}