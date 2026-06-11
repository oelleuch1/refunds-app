Get : /v1/posts => Get all posts
Response { "posts": Post[] }

PostApiResponse {
posts: Post[];
}

fetchPosts() {
return fetch('/v1/posts')
.then(response => response.json())
.then(data => {
console.log(data.posts); // Array of posts without author information
});
}

Get /v2/posts => Get all posts with author information
Response { "items": Post[], count: number, page: number, pageSize: number }

type PostApiResponseWithPagination = {
items: Post[];
count: number;
page: number, pageSize: number
}

fetchPostsWithPagination(page: number, pageSize: number) {
return fetch(`/v2/posts?page=${page}&pageSize=${pageSize}`)
.then(response => response.json())
.then(data => {
console.log(data.items); // Array of posts with author information
console.log(`Total posts: ${data.count}`);
});

// In your project ajax.fromjson('/v2/.....')
}
