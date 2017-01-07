console.log('smart_categories')

$(".hide").remove()

function insertCategory (act, $before) {
  var $category = null
  if(act == 'add'){
    $category = $("#category option:selected").html();
    //console.log($category)
  }else{
    $category = $("#categoryDelete option:selected").html();
    //console.log($category)
  }

  const $removeBtn = $(`
    <button type="button" class="btn btn-danger btn-block">
	  <span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
	</button>
  `);

  var $row = null
  if(act == 'add'){
    $removeBtn.on('click', function () { 
      $(this).closest('.smart-categories').remove()
      $('form').validator('update')  
    })

    $row = $('<div class="form-group smart-categories"><div class="row"></div></div>')
      .append($('<div class="col-md-3"><h5></h5></div>').append($category))
      .append($('<div class="col-md-2"></div>').append($removeBtn))
  }else{
    $removeBtn.on('click', function () { 
      $(this).closest('.smart-categories-delete').remove()
      $('form').validator('update')  
    })

    $row = $('<div class="form-group smart-categories-delete"><div class="row"></div></div>')
      .append($('<div class="col-md-3"><h5></h5></div>').append($category))
      .append($('<div class="col-md-2"></div>').append($removeBtn))
  }


  $row.insertBefore($before)
}

function ajaxSubmit(url) {
        const headers = {
            'csrf-token': $('[name="_csrf"]').val()
        }
        return Promise.resolve(
            $.ajax({
            url: `/ajax${url}`,
            data: $(".form-horizontal").serialize(),
            method: 'POST',
            dataType: 'json',
            headers
            })
        )
    }

function isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

$('#category').each(function () {
  const $textarea = $(this)
  const $addBtn = $('<button type="button" class="btn btn-success btn-block"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></button>')

  $addBtn
    .on('click', function(e) { 
      insertCategory('add', $textarea)
      $('form').validator('update') 
    })
    .insertAfter($textarea)

    const $deleteCat = $("#categoryDelete")
    const $addBtnD = $('<button type="button" class="btn btn-success btn-block"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></button>')

    $addBtnD
      .on('click', function(e) { 
        insertCategory('delete', $deleteCat)
        $('form').validator('update') 
      })
      .insertAfter($deleteCat)
    
      $('form').validator('update')
      

    $textarea.closest('form')
    .on('submit', function (e) {
        e.preventDefault()
        const url = window.location.pathname;

        var categories = [];
        $('.smart-categories').each(function() {
            categories.push( $(this).text().trim() );
        });
        var newCategories = categories.join(', ');
        $("#category option:selected").val(newCategories)


        var categoriesD = [];
        $('.smart-categories-delete').each(function() {
            categoriesD.push( $(this).text().trim() );
        });
        var deleteCategories = categoriesD.join(', ');
        $("#categoryDelete option:selected").val(deleteCategories)
        
        var $cover = $("#cover")
        var cov = $cover.val()
        $('form').validator('update')

        if(isUrl(cov)){
          ajaxSubmit(url).then(json => {  
            if (json.success) {  
              location.assign('/book')  
            } else {
              location.reload()
            }
          })
          .catch(function (reason) {
            console.error(reason);
            //$('.help-block').text('Hiba történt a feldolgozás során')
          });
        }else{
          $('.help-block').text('Adjon meg egy URL-t.')
        }
    })


    

})



$('form').validator('update')
