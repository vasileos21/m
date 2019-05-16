const activeRoute = dataLink => $(`li > a[data-link="${dataLink}"]`).first().parent()

const loadContent = link => {
    $('#page-content').load(
        `${link}.html`
    )
}

const loaders = () => {
    $('li > a').on('click', function () {
        const target = $(this)
        const link = target.data('link')
        if (link) {
            window._currentRoute.removeClass('route-active')
            window._currentRoute = activeRoute(link)
            window._currentRoute.addClass('route-active')
            loadContent(link)
        }
    })
}


$(() => {
    loadContent('pagina-acasa')
    window._currentRoute = activeRoute('pagina-acasa')
    window._currentRoute.addClass('route-active')
    loaders()
})