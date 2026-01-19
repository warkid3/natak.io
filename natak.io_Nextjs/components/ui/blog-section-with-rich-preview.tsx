import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const blogPosts = [
    {
        id: 1,
        title: "The Industrialization of Generative Identity",
        excerpt: "Why we moved from toy models to industrial-grade LoRA pipelines. Scaling consistency across thousands of generations.",
        author: "Harsh",
        role: "Founder",
        date: "Oct 24, 2025",
        category: "Engineering",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
        slug: "industrialization-of-identity",
        featured: true,
    },
    {
        id: 2,
        title: "Vibe Stealing: A Technical Deep Dive",
        excerpt: "How our Chrome extension extracts style tokens from existing imagery and maps them to your personal identity model.",
        author: "Sarah",
        role: "AI Research",
        date: "Nov 02, 2025",
        category: "Research",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
        slug: "vibe-stealing-deep-dive",
    },
    {
        id: 3,
        title: "Kanban for Creatives: Managing Chaos",
        excerpt: "Why traditional folder structures fail for AI generation workflows and how the Kanban method solves the 'thousand-seed' problem.",
        author: "David",
        role: "Product",
        date: "Nov 15, 2025",
        category: "Product",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=2539&auto=format&fit=crop",
        slug: "kanban-for-creatives",
    },
    {
        id: 4,
        title: "Scaling GPU Fleets efficiently",
        excerpt: "Lessons learned from managing a distributed cluster of A100s for real-time model training and inference.",
        author: "Harsh",
        role: "Founder",
        date: "Dec 01, 2025",
        category: "Infrastructure",
        image: "https://images.unsplash.com/photo-1558494949-efc025708dc7?q=80&w=2574&auto=format&fit=crop",
        slug: "scaling-gpu-fleets",
    }
];

export function BlogSection() {
    return (
        <div className="w-full py-20 lg:py-40 bg-void text-white">
            <div className="container mx-auto flex flex-col gap-14 px-6 md:px-12">
                <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center gap-8">
                    <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-bold font-sans">
                        Transmission <span className="text-lime">Log</span>
                    </h4>
                    <p className="text-muted max-w-md text-right hidden sm:block">
                        Updates from the factory floor. Engineering deep dives, product releases, and manifestos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Featured Post - Spans 2 cols on medium, 3 cols (full) on large if desired, or kept as is */}
                    <Link href={`/blogs/${blogPosts[0].slug}`} className="flex flex-col gap-4 hover:opacity-75 cursor-pointer md:col-span-2 lg:col-span-2 group">
                        <div className="bg-neutral-900 rounded-md aspect-video overflow-hidden border border-white/10 group-hover:border-lime/50 transition-colors">
                            <img src={blogPosts[0].image} alt={blogPosts[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <Badge className="bg-lime text-black hover:bg-lime/80 rounded-sm">{blogPosts[0].category}</Badge>
                            <p className="flex flex-row gap-2 text-sm items-center text-gray-400">
                                <span>By</span>
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>{blogPosts[0].author[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-white">{blogPosts[0].author}</span>
                            </p>
                            <span className="text-xs text-gray-500 ml-auto">{blogPosts[0].date}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="max-w-3xl text-3xl md:text-4xl tracking-tight font-bold text-white group-hover:text-lime transition-colors">
                                {blogPosts[0].title}
                            </h3>
                            <p className="max-w-3xl text-gray-400 text-base">
                                {blogPosts[0].excerpt}
                            </p>
                        </div>
                    </Link>

                    {/* Other Posts */}
                    {blogPosts.slice(1).map((post) => (
                        <Link key={post.id} href={`/blogs/${post.slug}`} className="flex flex-col gap-4 hover:opacity-75 cursor-pointer group">
                            <div className="bg-neutral-900 rounded-md aspect-video overflow-hidden border border-white/10 group-hover:border-lime/50 transition-colors">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="flex flex-row gap-4 items-center">
                                <Badge variant="secondary" className="bg-neutral-800 text-gray-300 hover:bg-neutral-700 rounded-sm">{post.category}</Badge>
                                <p className="flex flex-row gap-2 text-sm items-center text-gray-400">
                                    <span className="text-muted-foreground">By</span>
                                    <span className="text-white">{post.author}</span>
                                </p>
                                <span className="text-xs text-gray-500 ml-auto">{post.date}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="max-w-3xl text-xl tracking-tight font-bold text-white group-hover:text-lime transition-colors">
                                    {post.title}
                                </h3>
                                <p className="max-w-3xl text-gray-400 text-sm line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
