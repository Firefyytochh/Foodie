"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getComments, deleteComment } from '@/action/comments';
import { Trash2 } from 'lucide-react';

// Comment type from landing page
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

export default function AdminHandleCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    // Fetch all comments on mount
    useEffect(() => {
        const fetchAllComments = async () => {
            setLoading(true);
            // Fetch a large number to get all comments (adjust as needed)
            const result = await getComments(1000, 0);
            if (result.data) {
                setComments(result.data);
            } else {
                setComments([]);
            }
            setLoading(false);
        };
        fetchAllComments();
    }, []);

    // Delete comment handler
    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        setDeletingId(commentId);
        try {
            // Debug log to check values
            console.log("handleDelete called with:", { commentId, userId: null });
            const result = await deleteComment(commentId, comments.find(c => c.id === commentId)?.user_id ?? ""); // pass user_id as second arg

            if (result.error) {
                alert("Failed to delete comment: " + result.error);
            } else {
                setComments(prev => prev.filter(c => c.id !== commentId));
            }
        } catch {
            alert("Failed to delete comment.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen  bg-gradient-to-br from-orange-50 to-red-50">
            <div className="max-w-4xl mx-auto py-12 px-4">
                {/* Header bar with back button and centered title */}
                <div className="flex flex-col items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/dashboard')}
                        className="self-start mb-2"
                    >
                        ← Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-orange-900 text-center">Manage User Comments</h1>
                </div>
                {loading ? (
                    <div className="text-center py-8 text-orange-600">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-orange-600">No comments found.</div>
                ) : (
                    <div className="space-y-6">
                        {comments.map(comment => (
                            <div key={comment.id} className="bg-white rounded-lg shadow p-6 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                        {comment.profiles?.avatar_url ? (
                                            <Image
                                                src={comment.profiles.avatar_url}
                                                alt={comment.profiles?.username || "User"}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-orange-600">
                                                {(comment.profiles?.username || "U").charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{comment.profiles?.username || "Anonymous"}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 px-6">
                                    <div className="text-gray-700">{comment.comment_text}</div>
                                    {comment.updated_at && comment.updated_at !== comment.created_at && (
                                        <div className="text-xs text-gray-400 mt-1">(edited)</div>
                                    )}
                                </div>
                                <div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(comment.id)}
                                        disabled={deletingId === comment.id}
                                        title="Delete comment"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}