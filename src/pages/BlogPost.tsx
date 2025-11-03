import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { fetchPostBySlug, type SanityPost } from '@/lib/sanity'
import ModernHeader from '@/components/ModernHeader'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet'

const seoOverrides: any = {
  // The following object should contain the provided SEO metadata:
  // Example shape:
  // title: '...',
  // description: '...',
  // keywords: ['k1', 'k2'] or 'k1, k2',
  // canonical: 'https://...',
  // openGraph: {
  //   type: 'article' | 'website',
  //   title: '...',
  //   description: '...',
  //   url: 'https://...',
  //   siteName: '...',
  //   locale: 'en_US',
  //   images: [
  //     { url: 'https://...', width: 1200, height: 630, alt: '...' }
  //     // or 'https://...'
  //   ]
  // },
  // twitter: {
  //   card: 'summary_large_image' | 'summary',
  //   site: '@site',
  //   creator: '@creator',
  //   title: '...',
  //   description: '...',
  //   image: 'https://...'
  // }
}

function MetaTags({
  title,
  description,
  keywords,
  url,
  image,
  baseType = 'website',
}: {
  title: string
  description?: string
  keywords?: string | string[]
  url?: string
  image?: string
  baseType?: 'website' | 'article'
}) {
  const og = seoOverrides?.openGraph || {}
  const tw = seoOverrides?.twitter || {}

  const finalTitle = seoOverrides?.title || og?.title || tw?.title || title
  const finalDescription =
    seoOverrides?.description || og?.description || tw?.description || description
  const finalKeywords = seoOverrides?.keywords || keywords
  const finalUrl = seoOverrides?.canonical || og?.url || url
  const finalType = og?.type || baseType
  const finalSiteName = og?.siteName
  const finalLocale = og?.locale
  const ogImages: any[] = Array.isArray(og?.images)
    ? og.images
    : og?.images
    ? [og.images]
    : image
    ? [image]
    : []

  const twitterCard = tw?.card || (ogImages.length > 0 ? 'summary_large_image' : 'summary')
  const twitterSite = tw?.site
  const twitterCreator = tw?.creator
  const twitterImage =
    tw?.image ||
    (Array.isArray(ogImages) && ogImages.length > 0
      ? typeof ogImages[0] === 'string'
        ? ogImages[0]
        : ogImages[0]?.url
      : undefined)

  const keywordsContent = Array.isArray(finalKeywords) ? finalKeywords.join(', ') : finalKeywords

  return (
    <Helmet>
      {finalTitle && <title>{finalTitle}</title>}
      {finalDescription && <meta name="description" content={finalDescription} />}
      {keywordsContent && <meta name="keywords" content={keywordsContent} />}

      {finalUrl && <link rel="canonical" href={finalUrl} />}

      <meta property="og:type" content={finalType || 'website'} />
      {finalTitle && <meta property="og:title" content={finalTitle} />}
      {finalDescription && <meta property="og:description" content={finalDescription} />}
      {finalUrl && <meta property="og:url" content={finalUrl} />}
      {finalSiteName && <meta property="og:site_name" content={finalSiteName} />}
      {finalLocale && <meta property="og:locale" content={finalLocale} />}
      {ogImages.map((img, idx) => {
        if (typeof img === 'string') {
          return <meta property="og:image" content={img} key={`og-image-${idx}`} />
        }
        return (
          <span key={`og-image-${idx}`}>
            {img?.url && <meta property="og:image" content={img.url} />}
            {img?.width && <meta property="og:image:width" content={String(img.width)} />}
            {img?.height && <meta property="og:image:height" content={String(img.height)} />}
            {img?.alt && <meta property="og:image:alt" content={img.alt} />}
          </span>
        )
      })}

      <meta name="twitter:card" content={twitterCard} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      {finalTitle && <meta name="twitter:title" content={finalTitle} />}
      {finalDescription && <meta name="twitter:description" content={finalDescription} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
    </Helmet>
  )
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<SanityPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        const fetchedPost = await fetchPostBySlug(slug)
        if (fetchedPost) {
          setPost(fetchedPost)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Failed to load post:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    const fallbackTitle =
      seoOverrides?.title || 'Loading... | ContentFarm Blog'
    const fallbackDescription =
      seoOverrides?.description || 'Loading blog post...'
    return (
      <div className="min-h-screen">
        <MetaTags
          title={fallbackTitle}
          description={fallbackDescription}
          keywords={seoOverrides?.keywords}
          url={seoOverrides?.canonical}
          image={
            Array.isArray(seoOverrides?.openGraph?.images) &&
            seoOverrides.openGraph.images.length > 0
              ? typeof seoOverrides.openGraph.images[0] === 'string'
                ? seoOverrides.openGraph.images[0]
                : seoOverrides.openGraph.images[0]?.url
              : undefined
          }
          baseType="article"
        />
        <ModernHeader />
        <Breadcrumb />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (notFound || !post) {
    const nfTitle =
      seoOverrides?.title || 'Post Not Found - ContentFarm'
    const nfDescription =
      seoOverrides?.description || 'The requested blog post could not be found.'
    return (
      <div className="min-h-screen">
        <MetaTags
          title={nfTitle}
          description={nfDescription}
          keywords={seoOverrides?.keywords}
          url={seoOverrides?.canonical}
          image={
            Array.isArray(seoOverrides?.openGraph?.images) &&
            seoOverrides.openGraph.images.length > 0
              ? typeof seoOverrides.openGraph.images[0] === 'string'
                ? seoOverrides.openGraph.images[0]
                : seoOverrides.openGraph.images[0]?.url
              : undefined
          }
          baseType="website"
        />
        <ModernHeader />
        <Breadcrumb />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to About
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const postUrl = `https://contentfarm.club/blog/${post.slug.current}`
  const postTitle = `${post.title} - ContentFarm Blog`
  const postDescription = post.excerpt || `Read ${post.title} on the ContentFarm blog`
  const postImage = post.mainImage?.asset.url

  return (
    <div className="min-h-screen">
      <MetaTags
        title={postTitle}
        description={postDescription}
        keywords={seoOverrides?.keywords}
        url={seoOverrides?.canonical || postUrl}
        image={
          (Array.isArray(seoOverrides?.openGraph?.images) &&
            seoOverrides.openGraph.images.length > 0
            ? (typeof seoOverrides.openGraph.images[0] === 'string'
                ? seoOverrides.openGraph.images[0]
                : seoOverrides.openGraph.images[0]?.url)
            : undefined) || postImage
        }
        baseType="article"
      />
      
      <ModernHeader />
      <Breadcrumb />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link 
          to="/about" 
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to About
        </Link>

        <article>
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              {post.author && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={post.author.image?.asset.url} 
                      alt={post.author.name} 
                    />
                    <AvatarFallback>
                      {post.author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-muted-foreground text-sm">Author</p>
                  </div>
                </div>
              )}
              
              <Badge variant="secondary">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Badge>
            </div>

            {post.mainImage && (
              <div className="rounded-lg overflow-hidden mb-8">
                <img
                  src={post.mainImage.asset.url}
                  alt={post.mainImage.alt || post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground">
            {post.excerpt && (
              <p className="lead text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>
            )}
            
            {post.body && (
              <div className="text-foreground leading-relaxed">
                <PortableText 
                  value={post.body}
                  components={{
                    block: {
                      normal: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                      h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                      h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-bold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                      link: ({children, value}) => (
                        <a href={value.href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    },
                    list: {
                      bullet: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                      number: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                    },
                    listItem: {
                      bullet: ({children}) => <li className="mb-1">{children}</li>,
                      number: ({children}) => <li className="mb-1">{children}</li>,
                    },
                  }}
                />
              </div>
            )}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  )
}

export default BlogPost