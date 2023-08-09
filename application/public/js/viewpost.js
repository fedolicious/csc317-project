function buildCommentDiv(data) {
    const dateString = new Date().toLocaleString("en-us", {
        timeStyle: "medium",
        dateStyle: "medium"
    });
    const divComment = document.createElement('div');
    divComment.id = `message-${data.commentId}`;
    divComment.classList.add('comment');
    const usernametag = document.createElement('strong');
    usernametag.classList.add('comment-author');
    usernametag.appendChild(document.createTextNode(data.username));
    const dateSpan = document.createElement('span');
    dateSpan.appendChild(document.createTextNode(dateString));
    dateSpan.classList.add('comment-date');
    const commentText = document.createElement('div');
    commentText.classList.add('comment-text');
    commentText.appendChild(document.createTextNode(data.commentText));
    divComment.append(usernametag, dateSpan, commentText);
    return divComment;
}


const commentsList = document.getElementById("commentsList");
const commentButton = document.getElementById("commentButton");
let commentTextArea = document.getElementById("commentMsg");
if(commentButton) {
    commentButton.addEventListener("click", function(event){
        event.preventDefault();
        const commentText = commentTextArea.value;
        const postId = event.currentTarget.dataset.postid;

        const payLoad = {
            postId,
            commentText
        };
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body : JSON.stringify(payLoad)
        };
        fetch("/comments/create", fetchOptions)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            if(data.statusCode < 0) {
                window.location.replace(data.redirectTo);
            } else {
                const commentDiv = buildCommentDiv(data);
                commentsList.prepend(commentDiv);
                commentTextArea = "";
                // window.location.replace(`#message-${data.commentId}`);
            }
        }).catch(err => console.error(err));
        console.log(fetchOptions);
    });
}
if(commentTextArea) {
    commentTextArea.addEventListener("keypress", function(event) {
        // console.log(event);
        if(event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
            console.log("send");
        }
    })
}