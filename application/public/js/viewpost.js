//POSTING COMMENTS
const commentButton = document.getElementById("commentButton");
let commentBox = document.getElementById("commentBox");
if(commentButton) {
    commentBox.addEventListener("focusin", function(event) {
        hideLastReplyBox();
    });
    commentBox.addEventListener("keypress", function(event) {
        sendCommentWithEnter(event,commentBox)
    });
    commentButton.addEventListener("click", function(event){
        event.preventDefault();
        sendComment(commentBox,event.currentTarget.parentElement.dataset.postid,null);
    });
}

//POSTING REPLY COMMENT
const replyCommentButtons = document.getElementsByClassName("replyCommentButton");
    const replyBoxes = document.getElementsByClassName("replyBox");
let lastReplyBox;
for(let i = 0; i < replyCommentButtons.length; i++) {
    replyBoxes[i].addEventListener("keypress", function(event) {
        sendCommentWithEnter(event,replyBoxes[i]);
        lastReplyBox.classList.remove("replyContent-hidden");
    });
    replyCommentButtons[i].addEventListener("click", function(event){
        event.preventDefault();
        sendComment(replyBoxes[i],
            event.currentTarget.parentElement.dataset.postid,
            event.currentTarget.parentElement.dataset.commentid
        );
        lastReplyBox.classList.remove("replyContent-hidden");
    });
}
//SHOWING/HIDING REPLY BOX
function hideLastReplyBox() {
    if(lastReplyBox) {
        lastReplyBox.classList.add("replyContent-hidden");
        let children = lastReplyBox.children;
        for(let j = 0; j < children.length; j++) {
            children[j].setAttribute("tabIndex",-1);
        }
        lastReplyBox.getElementsByClassName("replyBox")[0].value = "";
    }
}
const replyButtons = document.getElementsByClassName("replyButton");
for(let i = 0; i < replyButtons.length; i++) {
    replyButtons[i].addEventListener("click", function(event){
        //toggle reply boxes
        hideLastReplyBox();
        lastReplyBox = event.target.parentElement.getElementsByClassName("replyContent")[0];
        lastReplyBox.classList.remove("replyContent-hidden");
        //toggle tabbing
        let children = lastReplyBox.children;
        for(let j = 0; j < children.length; j++) {
            children[j].setAttribute("tabIndex",0);
        }
    });
}
function sendComment(commentTextArea,postId,parentId = null) {
    if(parentId === "null") { parentId = null; }
    console.log(`"${commentTextArea.value}, ${postId}, ${parentId}"`);
    let commentText = commentTextArea.value;
    commentText = commentText.trimRight();
    if(commentText === "") { return; }
    const payLoad = {
        postId,
        commentText,
        parentId
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
        // console.log(data);
        if(data.statusCode  < 0) {
            window.location.replace(data.redirectTo);
        } else {
            const newHTML = `
            <li id="message-clientSide" class="comment">
                <div class="commentContent">
                    <strong>${data.username}:</strong>
                    <span>${new Date().toLocaleString("en-us", {
                        timeStyle: "short",
                        dateStyle: "short"
                    })}</span>
                    <div class="commentBody">${commentTextArea.value}</div>
<!--                    <input type="submit" value="Reply" class="replyButton" id="reply-41">-->
<!--                    <div class="replyContent replyContent-hidden">-->
<!--                        <textarea class="replyBox" name="key" rows="10" tabindex="-1"></textarea>-->
<!--                        <input type="submit" value="Comment" class="replyButton" tabindex="-1">-->
<!--                    </div>-->
                </div>
                <ul>
                </ul>
            </li>`
            if(parentId === null) {
                document.getElementById("commentsList").insertAdjacentHTML("afterbegin",newHTML);
            } else {
                document.getElementById(`message-${parentId}`)
                .getElementsByClassName("childComments")[0]
                .insertAdjacentHTML("afterbegin",newHTML);
            }
            commentTextArea.value = "";
            if(lastReplyBox) {
                hideLastReplyBox();
            }
            // window.location.replace(`#message-${data.commentId}`);
        }
    }).catch(err => console.error(err));
    // console.log(fetchOptions);

}
function sendCommentWithEnter(event, textBox) {
    if(event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
        event.preventDefault();
        textBox.blur();
        sendComment(textBox,textBox.parentElement.dataset.postid,textBox.parentElement.dataset.commentid);
    }
}