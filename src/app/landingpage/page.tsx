"use client";

import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Star, ShoppingCart, User, Menu, Check, Edit, Trash2, Mail, Phone, X } from "lucide-react"
import Link from "next/link"
import { getUseCartStore } from "../../store/cart"
import { menuItems } from "../../lib/menuData";
import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from 'next/navigation';
import { addComment, getComments } from "../../action/comments";
import { getCurrentUser, logoutUser } from "../../action/auth";
import { getMenuItems } from "../../action/admin";

interface Comment {
  id: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: {
    avatar_url: string;
    username: string;
  } | null;
}

interface User {
  id: string;
  email: string;
  user_metadata: {
    avatar_url: string;
    full_name: string;
  };
}

function getImageSrc(image?: string) {
  if (!image || image.trim() === "") {
    return "/default.jpg";
  }
  if (image.startsWith("http")) {
    return image;
  }
  return `/uploads/${image}`;
}

function LandingPageContent() {
  const useCartStore = getUseCartStore();
  const { addToCart, cartItemCount, items } = useCartStore();
  const safeCart = Array.isArray(items) ? items : [];
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // New state for modal
  const formRef = useRef<HTMLFormElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [commentsOffset, setCommentsOffset] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [dbMenuItems, setDbMenuItems] = useState<any[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/login');
  };

  const fetchComments = async (loadMore: boolean = false) => {
    try {
      setCommentsLoading(true);
      const offset = loadMore ? commentsOffset : 0;
      const result = await getComments(10, offset);

      if (result.error) {
        console.error('Error fetching comments:', result.error);
        if (!loadMore) {
          setComments([]);
          setHasMoreComments(false);
        }
        return;
      }

      if (result.data) {
        if (loadMore) {
          setComments(prev => [...prev, ...result.data]);
          setCommentsOffset(prev => prev + 10);
        } else {
          setComments(result.data);
          setCommentsOffset(10);
        }

        setHasMoreComments(result.hasMore);
        setTotalComments(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      if (!loadMore) {
        setComments([]);
        setHasMoreComments(false);
        setTotalComments(0);
      }
    } finally {
      setCommentsLoading(false);
    }
  };

  const loadMoreComments = () => {
    fetchComments(true);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const handleEditComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingText(currentText);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editingText.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      if (!user || !user.id) {
        alert('You must be logged in to edit a comment');
        return;
      }
      const { updateComment } = await import('../../action/comments');
      const result = await updateComment(commentId, editingText, user.id);
      
      if (result.error) {
        alert('Failed to update comment: ' + result.error);
      } else {
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, comment_text: editingText, updated_at: new Date().toISOString() }
            : comment
        ));
        setEditingCommentId(null);
        setEditingText('');
        alert('Comment updated successfully!');
      }
    } catch (_error) {
      alert('Failed to update comment');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setDeletingCommentId(commentId);

    if (!user || !user.id) {
      alert('You must be logged in to delete a comment');
      setDeletingCommentId(null);
      return;
    }

    try {
      const { deleteComment } = await import('../../action/comments');
      const result = await deleteComment(commentId, user.id);

      if (result.error) {
        alert('Failed to delete comment: ' + result.error);
      } else {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        setTotalComments(prev => prev - 1);
        alert('Comment deleted successfully!');
      }
    } catch (_error) {
      alert('Failed to delete comment');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleAddToCartWithFeedback = (item: any) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      image: item.image || item.image_url,
      quantity: 1,
      rating: item.rating,
      description: item.description,
      category: item.category
    };
    
    addToCart(cartItem);
    setJustAdded(item.id);
    
    setTimeout(() => {
      setJustAdded(null);
    }, 2000);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      const result = await getMenuItems();
      if (result.success && result.data) {
        setDbMenuItems(result.data);
      } else {
        setDbMenuItems([]);
      }
      setLoadingMenu(false);
    };
    fetchMenu();
  }, []);

  const bestSellItems = dbMenuItems
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);

  const getAllCategories = () => {
    const categories = dbMenuItems
      .map(item => item.category)
      .filter(category => category && category.trim() !== '')
      .map(category => category.toLowerCase().trim());
    
    return [...new Set(categories)].sort();
  };

  useEffect(() => {
    if (dbMenuItems.length > 0 && !activeCategory) {
      const categories = getAllCategories();
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
      }
    }
  }, [dbMenuItems, activeCategory]);

  const getFilteredItems = () => {
    if (!activeCategory) return [];
    
    return dbMenuItems.filter(item => {
      if (!item.category) return false;
      
      const itemCategory = item.category.toLowerCase().trim();
      const selectedCategory = activeCategory.toLowerCase().trim();
      
      return itemCategory === selectedCategory;
    });
  };

  const filteredItems = getFilteredItems();

  const getCategoryCount = (category: string) => {
    return dbMenuItems.filter(item => 
      item.category && item.category.toLowerCase().trim() === category.toLowerCase().trim()
    ).length;
  };

  const getCategoryInfo = (category: string) => {
    const categoryMap: { [key: string]: { name: string; icon: string } } = {
      'burger': { name: 'Burger', icon: '/cheese_burger-removebg-preview.png' },
      'drink': { name: 'Drink', icon: '/CokeinCan-removebg-preview.png' },
      'ice-cream': { name: 'Ice Cream', icon: '/Strawberry-Ice-Cream-removebg-preview.png' },
      'dessert': { name: 'Dessert', icon: '/plae-ayy.jpg' } // Changed from 'plae ayy.jpg'
    };

    return categoryMap[category] || { 
      name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '), 
      icon: '/plae-ayy.jpg' // Changed from 'plae ayy.jpg'
    };
  };

  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-300 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Foodie Logo"
                width={500}
                height={500}
                className="rounded-full"
              />
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/landingpage" className="text-white hover:text-orange-100 transition-colors">Home</Link>
            <Link href="/Aboutus" className="text-white hover:text-orange-100 transition-colors">About Us</Link>
            <Link href="/menu" className="text-white hover:text-orange-100 transition-colors">Menu</Link>
            <Link href="#footer" className="text-white hover:text-orange-100 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/Cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
                <Link href="/Profile">
                  <User className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
                </Link>
                <Button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">Login</Button>
                </Link>
                <Link href="/Signup">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="px-6 py-12 md:py-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-orange-900 mb-6 leading-tight">
                Best Burger<br />
                For Your Test
              </h1>
              <p className="text-orange-800 text-lg mb-8 leading-relaxed">
                Sink your teeth into the juiciest, most flavorful burgers in town. Freshly grilled, packed with premium ingredients, and served with love – every bite is a celebration of taste.
              </p>
              <div className="flex gap-4">
                <Link href="/Cart">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full text-lg transition-transform duration-200 hover:scale-105">
                    Order Now
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-full text-lg transition-transform duration-200 hover:scale-105">
                    Explore Our Menu
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center transition-transform duration-200 hover:scale-105">
              <Image
                src="/burger1.jpg"
                alt="Delicious burger"
                width={400}
                height={400}
                className="w-full max-w-md"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-orange-900 mb-12">Best Sell</h2>
            {loadingMenu ? (
              <div className="text-center py-8">Loading menu...</div>
            ) : bestSellItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 w-full bg-orange-100 rounded-lg">
                <span className="text-2xl text-orange-500 font-bold">More menu will be available soon</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {bestSellItems.map(item => (
                  <Card key={item.id} className="group bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 rounded-2xl cursor-pointer">
                    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-orange-50 to-orange-100" onClick={() => setSelectedItem(item)}>
                      <Image
                        src={getImageSrc(item.image_url || item.image)}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-orange-600 transition-colors duration-200" onClick={() => setSelectedItem(item)}>{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-orange-600">${item.price}</span>
                        <Button
                          className={`rounded-full px-6 py-2 font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 ${
                            safeCart.some(cartItem => cartItem.id === item.id) || justAdded === item.id
                              ? 'bg-green-500 text-white border-0 hover:bg-green-600'
                              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 hover:from-orange-600 hover:to-orange-700'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCartWithFeedback({ 
                              id: item.id, 
                              name: item.name, 
                              price: item.price, 
                              quantity: 1, 
                              image: item.image_url || item.image 
                            });
                          }}
                        >
                          {safeCart.some(cartItem => cartItem.id === item.id) || justAdded === item.id ? "Added ✓" : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-orange-900 mb-12">Explore Our Menu</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <aside className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                  <Menu className="w-5 h-5 text-orange-500" /> Menu
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
                  
                  <Link href="/Reservation">
                    <div className="text-orange-800 px-4 py-3 hover:bg-orange-50 hover:shadow-md rounded-xl cursor-pointer transition-all duration-200 font-medium">
                      Reservation
                    </div>
                  </Link>
                </div>
              </aside>

              <div className="md:col-span-3">
                {loadingMenu ? (
                  <div className="text-center py-8">Loading menu...</div>
                ) : !activeCategory ? (
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
                      More {getCategoryInfo(activeCategory).name} items will be available soon!
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-orange-900">
                        {getCategoryInfo(activeCategory).name} ({filteredItems.length} items)
                      </h3>
                      <p className="text-orange-700 mt-1">
                        Choose from our delicious {getCategoryInfo(activeCategory).name.toLowerCase()} selection
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {filteredItems
                        .sort((a, b) => {
                          if (b.rating !== a.rating) {
                            return (b.rating || 0) - (a.rating || 0);
                          }
                          return a.name.localeCompare(b.name);
                        })
                        .map((item, index) => {
                          const isInCart = safeCart.some(cartItem => cartItem.id === item.id) || justAdded === item.id;
                          return (
                            <Card key={item.id} className="group bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 rounded-xl cursor-pointer">
                              <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100" onClick={() => setSelectedItem(item)}>
                                <Image
                                  src={getImageSrc(item.image_url || item.image)}
                                  alt={item.name}
                                  width={250}
                                  height={200}
                                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <CardContent className="p-4 space-y-3">
                                <h4 className="font-bold text-center text-gray-800 group-hover:text-orange-600 transition-colors duration-200" onClick={() => setSelectedItem(item)}>{item.name}</h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-orange-600">${item.price}</span>
                                  <Badge
                                    className={`cursor-pointer font-semibold transition-all duration-200 transform hover:scale-105 ${
                                      isInCart 
                                        ? "bg-green-500 text-white hover:bg-green-600" 
                                        : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleAddToCartWithFeedback(item);
                                    }}
                                  >
                                    {isInCart ? "Added ✓" : "Add to cart"}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Description Modal */}
        {selectedItem && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleModalClick}
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="relative">
                <Image
                  src={getImageSrc(selectedItem.image_url || selectedItem.image)}
                  alt={selectedItem.name}
                  width={600}
                  height={300}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">{selectedItem.rating}</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedItem.name}</h2>
                  <span className="text-4xl font-bold text-orange-600">${selectedItem.price}</span>
                </div>

                {/* Category Badge */}
                {selectedItem.category && (
                  <div className="flex justify-center">
                    <Badge className="bg-orange-100 text-orange-800 px-3 py-1 text-sm">
                      {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
                    </Badge>
                  </div>
                )}

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedItem.description || "This delicious item is carefully prepared with the finest ingredients to give you an amazing taste experience."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setSelectedItem(null)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleAddToCartWithFeedback(selectedItem);
                      setSelectedItem(null);
                    }}
                    className={`flex-1 font-semibold ${
                      safeCart.some(cartItem => cartItem.id === selectedItem.id) || justAdded === selectedItem.id
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                    }`}
                  >
                    {safeCart.some(cartItem => cartItem.id === selectedItem.id) || justAdded === selectedItem.id ? "Added to Cart ✓" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="px-6 py-16 bg-gradient-to-r from-orange-100 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-orange-900 mb-8">About Us</h2>
            <p className="text-xl italic text-orange-800 mb-6">
              &quot;Bite Into Happiness - Fresh, Juicy, Unforgettable.&quot;
            </p>
            <p className="text-orange-800 text-lg leading-relaxed mb-8">
              This sparks curiosity and appetite, making visitors want to click Read More. Do you want me to give you 2-3 more variations so you can choose the best one?
            </p>
            <Link href="/Aboutus">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full text-lg transition-transform duration-200 hover:scale-105">
                Read More
              </Button>
            </Link>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="w-80 h-80 bg-orange-600 rounded-full flex items-center justify-center mx-auto">
                  <Image
                    src="/photo_2025-08-14_13-43-10-removebg-preview.png?height=300&width=300"
                    alt="Our Best Chef"
                    width={200}
                    height={200}
                    className="rounded-full transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white text-orange-600 px-4 py-2 text-sm font-medium">
                    Our Best Chef 👨‍🍳
                  </Badge>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-orange-900 mb-8">
                  We have the best chef in the world
                </h2>
                <blockquote className="text-lg text-orange-800 mb-6 leading-relaxed">
                  &quot;The best chef is the one who can turn a simple burger into a masterpiece — balancing juicy flavors,
                  fresh ingredients, and perfect seasoning in every bite. A true burger chef doesn't just cook food,
                  they create happiness stacked between buns.&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 bg-gradient-to-r from-orange-100 to-orange-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-orange-900 mb-8 text-center">Leave a Comment</h2>

            {user ? (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Your avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">What&apos;s on your mind?</p>
                  </div>
                </div>

                <form ref={formRef} onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const comment = formData.get('comment') as string;

                  if (!user?.id) {
                    alert('You must be logged in to comment');
                    return;
                  }

                  if (!comment.trim()) {
                    alert('Please enter a comment');
                    return;
                  }

                  try {
                    const result = await addComment(comment, user.id);
                    if (result.error) {
                      alert(`Error: ${result.error}`);
                    } else {
                      formRef.current?.reset();
                      setCommentsOffset(0);
                      await fetchComments(false);
                      alert('Comment posted successfully!');
                    }
                  } catch (error) {
                    console.error('Submit error:', error);
                    alert('Failed to post comment. Please try again.');
                  }
                }}>
                  <textarea
                    name="comment"
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={4}
                    placeholder="Share your thoughts about our food..."
                    required
                  ></textarea>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-lg transition-transform duration-200 hover:scale-105"
                    >
                      Post Comment
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
                <p className="text-gray-600 mb-4">Please log in to leave a comment</p>
                <Link href="/login">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full">
                    Log In
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-orange-900 mb-6">
                Comments ({totalComments})
              </h3>

              {commentsLoading && comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-orange-800">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-orange-800 text-lg">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-200">
                            {comment.profiles?.avatar_url ? (
                              <Image
                                src={comment.profiles.avatar_url}
                                alt={comment.profiles.username || 'User'}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-orange-300 flex items-center justify-center text-white font-bold">
                                {(comment.profiles?.username || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {comment.profiles?.username || 'Anonymous User'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {comment.updated_at && comment.updated_at !== comment.created_at && (
                                <span className="text-gray-400 ml-2">(edited)</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        {user && user.id === comment.user_id && (
                          <div className="flex items-center space-x-2">
                            {editingCommentId === comment.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(comment.id)}
                                  className="text-green-600 hover:text-green-800 p-1"
                                  title="Save changes"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-gray-600 hover:text-gray-800 p-1"
                                  title="Cancel editing"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditComment(comment.id, comment.comment_text)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit comment"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  disabled={deletingCommentId === comment.id}
                                  className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                                  title="Delete comment"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3">
                        {editingCommentId === comment.id ? (
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                            rows={3}
                            placeholder="Edit your comment..."
                          />
                        ) : (
                          <p className="text-gray-700 leading-relaxed">{comment.comment_text}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {hasMoreComments && (
                    <div className="text-center mt-8">
                      <Button
                        onClick={loadMoreComments}
                        disabled={commentsLoading}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        {commentsLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            See More Comments ({totalComments - comments.length} remaining)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <footer id="footer" className="bg-orange-800 text-white px-6 py-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="Foodie Logo"
                  />
                </div>
                <span className="text-2xl font-bold">Foodie</span>
              </div>
              <p className="text-orange-200 mb-4">Made by food lover for food lover</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Useful links</h4>
              <div className="space-y-2 text-orange-200 underline">
                <Link href="/Aboutus">About us</Link>
              </div>
              <div className="space-y-2 text-orange-200  underline">
                <Link href="/menu">Menu</Link>
              </div>
              <div className="space-y-2 text-orange-200  underline">
                <Link href="/Cart">Cart</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Main Menu</h4>
              <div className="space-y-2 text-orange-200  underline">
                <Link href="/landingpage?category=burger ">Burger</Link>
              </div>
              <div className="space-y-2 text-orange-200  underline">
                <Link href="/landingpage?category=drink">Drink</Link>
              </div>
              <div className="space-y-2 text-orange-200  underline">
                <Link href="/landingpage?category=ice-cream">Ice Cream</Link>
              </div>
              <div className="space-y-2 text-orange-200  underline">
                <Link href="/landingpage?category=dessert">Dessert</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <div className="space-y-2 text-orange-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:foodieburgerr@gmail.com" className="underline">foodieburgerr@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+855 96 55 82 129</span>
                </div>
                <div className="mt-4">
                  <div className="font-bold mb-2">Social Media</div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Image
                        src="/face-book-removebg-preview.png"
                        alt="Facebook"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Image
                        src="/instagram-removebg-preview.png"
                        alt="Instagram"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Image
                        src="/x-removebg-preview.png"
                        alt="X"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function FoodieWebsite() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LandingPageContent />
    </Suspense>
  );
}
