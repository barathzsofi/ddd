console.log("search")

function ajaxSearch(text) {
  const headers = {
    'csrf-token': $('[name="_csrf"]').val()
  }
  return $.ajax({
    url: `/ajax/search`,
    method: 'GET',
    dataType: 'json',
    data: { search: text },
    headers
  })
}


function onSearch () {
  const text = $(this).val()
  console.log(text)
  const suggestions = $('.book-suggestions')

  if (text.length === 0) {
    suggestions.empty()
    return;
  }

  ajaxSearch(text)
    .then(books => {
      suggestions.empty()

      for (let book of books) {
        suggestions.append(`<a class="list-group-item" href="/book/${book.id}">${book.writer}: ${book.title}</a>`)
      }
    })
}

$('.book-search').on('input', onSearch)