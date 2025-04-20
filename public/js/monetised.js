$(document).ready(() => {
    $.get("/api/posts", results => {
        // Filter monetised posts
        const monetisedPosts = results.filter(post => post.monetise === true);
        outputPosts(monetisedPosts, $("#monetisedPostsContainer"));
    })
})

function outputPosts(results, container) {
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}
