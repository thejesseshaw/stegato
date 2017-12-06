var itunesUrl = "https://itunes.apple.com/search?term=";
var albumUrl = "https://itunes.apple.com/lookup?id=";

function startMasonry() {
    console.log("Masonry is running");
    $('#results').masonry({
        // options
        itemSelector: '.grid-item',
        // columnWidth: 200,
        horizontalOrder: true,
        fitWidth: true
    });
}

$(document).ready(function(){
    startMasonry();
});

$(".musicsearch").on("submit", function(e) {
    $("#results").empty();
    e.preventDefault();
    var searchTerm = $(".searchterm").val();
    console.log(searchTerm);
    var urlSearch = searchTerm.split(' ').join('+');
    $.getJSON( `${itunesUrl}${urlSearch}`, function(data) {
        console.log(data.results.length);
        for (var i = 0; i < data.results.length; i++) {
            // console.log(data.results[i].artistId);
            if (searchTerm == data.results[i].artistName) {
                console.log("It's a match");
                const artistNumber = data.results[i].artistId;
                console.log(artistNumber);
                $.getJSON(`${albumUrl}${artistNumber}&entity=album`, function(data){
                    console.log(data.results.length);
                    for (var i = 1; i < data.results.length; i++) {
                        $("#results").append(`
                        <div class="grid-item">
                        <div class="flip-container" ontouchstart="this.classList.toggle('hover');">
                            <div class="flipper">
                                <div class="front">
                                <img class="card-img-top" src="${data.results[i].artworkUrl100}">
                                </div>
                                <div class="back">
                                <div class="card-block">
                                    <h5 class="text-bold">${data.results[i].artistName}</h5>
                                    <h5 class="text-bold">${data.results[i].collectionName}</h5>
                                    <p class="text-bold">${data.results[i].primaryGenreName}</p>
                                </div>
                                <div class="rating">
                                    <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                                </div>
                                </div>
                            </div>
                        </div>
                        `)

                    }
                })
                break;
            }
        }
    })
})

