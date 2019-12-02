$(function () {
    $('#sidebarToggler, .overlay').on('click', function () {
        $('.sidebar').toggleClass('dropdown').toggleClass('d-block');
        $('.overlay').toggleClass('active');
    });
});

$(function () {
    $('#search-icon').click(function(e) {
        e.preventDefault();
        $('#search-box').toggleClass("d-none");
    });
});
