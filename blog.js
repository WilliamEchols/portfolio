const blogPosts = [];

function displayBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    if (!blogContainer) return;
    
    blogContainer.innerHTML = '';
    
    blogPosts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'blog-post-preview';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-meta">${post.date}</div>
            <p>${post.summary}</p>
            <a href="#post-${post.id}" class="read-more" data-post-id="${post.id}">Read more</a>
        `;
        blogContainer.appendChild(postElement);
    });

    if (blogPosts.length === 0) {
        blogContainer.innerHTML = '<p>There\'s nothing here (yet).</p>';
    }
    
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            const postId = parseInt(this.getAttribute('data-post-id'));
            displaySinglePost(postId);
        });
    });
}

function displaySinglePost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    const blogContainer = document.getElementById('blog-posts');
    if (!blogContainer) return;
    
    const scrollPosition = window.scrollY;
    
    blogContainer.innerHTML = `
        <div class="single-post">
            <a href="#" class="back-to-blog">&larr; Back to all posts</a>
            <a href="#" class="share-button">↳ Copy link</a>
            <br>
            <h2>${post.title}</h2>
            <div class="post-meta">${post.date}</div>
            <div class="post-content">
                ${post.content}
            </div>
        </div>
    `;
    
    document.querySelector('.back-to-blog').addEventListener('click', function(e) {
        e.preventDefault();
        history.pushState("", document.title, window.location.pathname + window.location.search);
        displayBlogPosts();
        window.scrollTo(0, scrollPosition);
    });
    
    document.querySelector('.share-button').addEventListener('click', function(e) {
        e.preventDefault();
        const postUrl = window.location.href;
        
        navigator.clipboard.writeText(postUrl).then(() => {
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Could not copy URL: ', err);
            alert('Could not copy URL. Please copy it manually from the address bar.');
        });
    });
    
    window.scrollTo(0, 0);
}

function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#post-')) {
        const postId = parseInt(hash.replace('#post-', ''));
        if (!isNaN(postId)) {
            displaySinglePost(postId);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('blog-posts')) {
        checkUrlHash();
        
        if (!window.location.hash.startsWith('#post-')) {
            displayBlogPosts();
        }
        
        window.addEventListener('hashchange', checkUrlHash);
    }
}); 