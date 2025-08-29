"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { isAdmin } from '@/utils/admin';
import { addMenuItem, getMenuItems, deleteMenuItem } from '@/action/admin';
import { Menu } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  image_url: string | null;
  category: string;
  created_at: string;
}

// Category options based on landing page categories
const CATEGORIES = [
  { value: 'burger', label: 'Burger' },
  { value: 'drink', label: 'Drink' },
  { value: 'ice-cream', label: 'Ice Cream' },
  { value: 'dessert', label: 'Dessert' },
];

const getCategoryInfo = (category: string) => {
  const categoryMap: { [key: string]: { name: string; icon: string } } = {
    'burger': { name: 'Burger', icon: '/cheese_burger-removebg-preview.png' },
    'drink': { name: 'Drink', icon: '/CokeinCan-removebg-preview.png' },
    'ice-cream': { name: 'Ice Cream', icon: '/Strawberry-Ice-Cream-removebg-preview.png' },
    'dessert': { name: 'Dessert', icon: '/plae-ayy.jpg' } // Update here too
  };

  return categoryMap[category] || { 
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '), 
    icon: '/plae-ayy.jpg' // Update here too
  };
};

export default function MenuManagement() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rating: '',
    description: '',
    category: '',
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
      // Set first predefined category as active if none selected
      if (!activeCategory) {
        setActiveCategory(CATEGORIES[0].value); // Set to 'burger' by default
      }
    }
    setLoading(false);
  };

  // Get all predefined categories (show all categories even if empty)
  const getAllCategories = () => {
    return CATEGORIES.map(cat => cat.value);
  };

  const getCategoryCount = (category: string) => {
    return menuItems.filter(item => 
      item.category && item.category.toLowerCase().trim() === category.toLowerCase().trim()
    ).length;
  };

  const getFilteredItems = () => {
    if (!activeCategory) return [];
    
    return menuItems.filter(item => {
      if (!item.category) return false;
      
      const itemCategory = item.category.toLowerCase().trim();
      const selectedCategory = activeCategory.toLowerCase().trim();
      
      return itemCategory === selectedCategory;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!formData.category) {
      alert('Please select a category');
      setSubmitting(false);
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('rating', formData.rating);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    
    console.log('Submitting category:', formData.category);
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    const result = await addMenuItem(submitData);

    if (result.success) {
      alert(`Item added successfully with category: ${formData.category}`);
      setFormData({
        name: '',
        price: '',
        rating: '',
        description: '',
        category: '',
        image: null
      });
      setShowAddForm(false);
      loadMenuItems();
    } else {
      alert('Error: ' + result.error);
    }

    setSubmitting(false);
  };

  const handleCategoryChange = (value: string) => {
    console.log('Category selected:', value);
    setFormData({...formData, category: value});
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

  const filteredItems = getFilteredItems();

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
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.category && (
                    <p className="text-xs text-gray-500 mt-1">Selected: {formData.category}</p>
                  )}
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
                <div className="md:col-span-2">
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
                  placeholder="Describe this delicious item..."
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

        {/* Category Grid Menu - From Landing Page */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Browse Menu by Category</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Loading menu items...</div>
          ) : (
            <div className="p-6">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Categories Sidebar - Show ALL categories */}
                <aside className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                    <Menu className="w-5 h-5 text-orange-500" /> Categories
                  </h4>
                  <div className="space-y-3">
                    {getAllCategories().map(category => {
                      const categoryInfo = getCategoryInfo(category);
                      
                      return (
                        <div
                          key={category}
                          className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                            activeCategory === category 
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                              : "text-orange-800 hover:bg-orange-50 hover:shadow-md"
                          }`}
                          onClick={() => setActiveCategory(category)}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
                            <Image 
                              src={categoryInfo.icon} 
                              alt={categoryInfo.name} 
                              width={32} 
                              height={32} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span>{categoryInfo.name} ({getCategoryCount(category)})</span>
                        </div>
                      );
                    })}
                  </div>
                </aside>

                {/* Items Grid */}
                <div className="md:col-span-3">
                  {!activeCategory ? (
                    <div className="flex flex-col items-center justify-center h-64 w-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
                      <span className="text-2xl text-orange-600 font-bold mb-2">
                        Select a category to view items
                      </span>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 w-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
                      <span className="text-2xl text-orange-600 font-bold mb-2">
                        No {getCategoryInfo(activeCategory).name} items available
                      </span>
                      <span className="text-lg text-orange-500">
                        Add some {getCategoryInfo(activeCategory).name.toLowerCase()} items to get started!
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {getCategoryInfo(activeCategory).name} ({filteredItems.length} items)
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Manage your {getCategoryInfo(activeCategory).name.toLowerCase()} menu items
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                          <div key={item.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="relative h-48 bg-gray-100">
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <span>No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-lg font-bold text-orange-600">${item.price}</span>
                                <span className="text-sm text-gray-500">Rating: {item.rating}/5</span>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(item.id, item.name)}
                                className="w-full"
                              >
                                Delete Item
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All Menu Items List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Menu Items</h2>
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
                        <span>Category: {item.category || 'N/A'}</span>
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