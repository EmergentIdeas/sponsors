var sortable = require('sortablejs')
if(!sortable.create && sortable.default) {
    sortable = sortable.default
}


/**
 * Expects markup in the form of:
 * <div class="ei-editable-sortable-tiles">
 * 		<ul class="tiles" data-sort-url="/admin/sponsors/sort">
 * 			<li class="tile" data-id="e0e5e574-4709-48d9-8df1-167af79f4b1e"> <!-- Where the value of data-id is database identifier of the object represented by the tile -->
 * 				<!-- Some markup here which displays the information about the tile -->
 * 
 * 
 * 			</li>
 * 		</ul>
 * </div>
 * 
 * 
 */
var $tiles = $('.ei-editable-sortable-tiles .tiles')
if($tiles.length > 0) {
	var dd = sortable.create($tiles.get(0), {
		handle: '.move',
		onSort: function(evt) {
			var count = 0;
			var order = {}
			$(evt.target).find('li').each(function(li) {
				order[$(this).attr('data-id')] = count++
			})
			$.ajax({
				method: 'POST',
				url: $(evt.target).attr('data-sort-url'),
				data: order
			})
		}
	})
}


var UploadableImage = require('ei-pic-browser/uploadable-image')

$('.sponsor-fields-form input[type=text].picture-input-field').each(function() {
        new UploadableImage(this)
})
