//PHOTOS
let photoCount = 0;
fetch("https://jsonplaceholder.typicode.com/albums/2/photos").then(function(response) {
    return response.json();
}).then(function(data) {
    //APPEND IMAGES
    let ExtraHTML = "";
    data.forEach(function(element) {
        ExtraHTML += `<div class="photo-card">
                          <p>${element.title}</p>
                          <img src="${element.thumbnailUrl}" alt="placeholder photo">
                      </div>`;
        photoCount++;
    })
    document.getElementById("photos").innerHTML += ExtraHTML;
    //SET PHOTO COUNT
    document.getElementById("photo-count").innerHTML = photoCount;
    //MAKE IMAGES CLICKABLE
    [...document.getElementsByClassName("photo-card")].forEach(function(element) {
        element.addEventListener("click", remove,{once:true})
    })
});
function remove(event) {
    const target = event.currentTarget;
    setTimeout(function(){
        document.getElementById("photo-count").innerHTML--;
        target.remove();
    }, 500);
    target.classList.add("photo-card-hidden");
}
