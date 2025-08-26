"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { isAdmin } from '@/utils/admin';
import { getAboutContent, updateAboutContent } from '@/action/admin';

interface AboutContent {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  updated_at: string;
}

export default function AboutManagement() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<AboutContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: ''
  });

  useEffect(() => {
    setMounted(true);
    if (!isAdmin()) {
      router.push('/admin/login');
      return;
    }
    loadContent();
  }, [router]);

  const loadContent = async () => {
    setLoading(true);
    const result = await getAboutContent();
    if (result.success && result.data) {
      setContent(result.data);
      setFormData({
        title: result.data.title,
        subtitle: result.data.subtitle || '',
        content: result.data.content
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateAboutContent(
      formData.title,
      formData.subtitle,
      formData.content
    );

    if (result.success) {
      setContent(result.data);
      alert('About page updated successfully!');
    } else {
      alert('Error: ' + result.error);
    }

    setSaving(false);
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
              <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
            </div>
            <Link href="/Aboutus" target="_blank">
              <Button variant="outline">
                View Live Page
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-8">Loading content...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Edit Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Edit About Content</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="About Us"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="Bite Into Happiness – Fresh, Juicy, Unforgettable."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Content
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your about us content here..."
                    rows={12}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {saving ? 'Saving...' : 'Update About Page'}
                </Button>
              </form>

              {content && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                  Last updated: {new Date(content.updated_at).toLocaleString()}
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="prose max-w-none">
                <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "serif" }}>
                  {formData.title || 'About Us'}
                </h1>
                
                {formData.subtitle && (
                  <p className="text-lg italic text-gray-700 mb-6">
                    {formData.subtitle}
                  </p>
                )}

                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {formData.content || 'Content will appear here...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}