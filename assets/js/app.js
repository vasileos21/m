// selectorul ce va contine elementul din meiul de navigatie corespunzator paginii curente
const activeRoute = dataLink => $(`li > a[data-link="${dataLink}"]`).first().parent()

// functia de incarcare dinamica in sectiunea html <section id="page-content">
const loadContent = link => {
    $('#page-content').load(
        `${link}.html`
    )
}

// modulul de control al navigatiei in site
const navEngine = () => {
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

// functia principala ce va rula odata ce a fost incarcate toate resursele aferente aplicatiei
$(() => {
    loadContent('pagina-acasa')
    window._currentRoute = activeRoute('pagina-acasa')
    window._currentRoute.addClass('route-active')
    navEngine()
})